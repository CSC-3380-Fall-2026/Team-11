"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineLifecycleEvent = determineLifecycleEvent;
exports.hasLifecycleHooks = hasLifecycleHooks;
exports.isRecoveryDeployment = isRecoveryDeployment;
exports.executeLifecycleHooks = executeLifecycleHooks;
exports.executeHook = executeHook;
const backend = require("../backend");
const error_1 = require("../../../error");
const logger_1 = require("../../../logger");
const utils_1 = require("../../../utils");
const cloudtasks = require("../../../gcp/cloudtasks");
const computeEngine = require("../../../gcp/computeEngine");
const projects_1 = require("../../../management/projects");
const functional_1 = require("../../../functional");
const prompts = require("../prompts");
function determineLifecycleEvent(haveBackend) {
    const hasExistingEndpoints = backend.someEndpoint(haveBackend, (ep) => ep.state !== "FAILED");
    if (!hasExistingEndpoints) {
        return "afterFirstDeploy";
    }
    return "afterRedeploy";
}
function hasLifecycleHooks(backendSpec) {
    return !!(backendSpec.lifecycleHooks && Object.keys(backendSpec.lifecycleHooks).length > 0);
}
function isRecoveryDeployment(wantBackend, haveBackend) {
    const wantEndpoints = backend.allEndpoints(wantBackend);
    const haveEndpoints = backend.allEndpoints(haveBackend);
    const wantHashes = new Set(wantEndpoints.map((ep) => ep.hash).filter((h) => !!h));
    if (!wantHashes.size) {
        return false;
    }
    const hasSameHash = haveEndpoints.some((ep) => ep.hash && wantHashes.has(ep.hash));
    if (!hasSameHash) {
        return false;
    }
    const hasNetNewFunctions = wantEndpoints.some((wantEp) => !backend.findEndpoint(haveBackend, (haveEp) => haveEp.id === wantEp.id && haveEp.region === wantEp.region && haveEp.state !== "FAILED"));
    return hasNetNewFunctions;
}
async function executeLifecycleHooks(wantBackend, haveBackend, plan, codebase, options) {
    if (!hasLifecycleHooks(wantBackend)) {
        return false;
    }
    const codebasePlan = plan && codebase ? plan[codebase] : undefined;
    if (codebasePlan && codebase) {
        const allWantEndpoints = backend.allEndpoints(wantBackend);
        const isFiltered = allWantEndpoints.some(backend.missingEndpoint(codebasePlan.plannedBackend));
        if (isFiltered) {
            const event = determineLifecycleEvent(haveBackend);
            (0, utils_1.logLabeledWarning)("functions", `Lifecycle hook "${event}" for codebase "${codebase}" was configured but not executed because this was a partial deployment (filtered).`);
            (0, utils_1.logLabeledBullet)("functions", `You can run the lifecycle hook in isolation by running: firebase functions:lifecycle:run ${event} ${codebase}`);
            return false;
        }
    }
    let event;
    if (isRecoveryDeployment(wantBackend, haveBackend)) {
        event = await prompts.promptForLifecycleEvent(codebase ?? "default", wantBackend, options);
        if (!event) {
            (0, utils_1.logLabeledBullet)("functions", `Skipping lifecycle hooks for codebase "${codebase ?? "default"}".`);
            return false;
        }
    }
    else {
        event = determineLifecycleEvent(haveBackend);
    }
    const hooks = wantBackend.lifecycleHooks || {};
    const hook = hooks[event];
    if (!hook) {
        logger_1.logger.debug(`No lifecycle hook configured for event: ${event}`);
        return false;
    }
    if (event === "afterRedeploy" && plan) {
        const codebasePlans = codebase ? [plan[codebase]].filter(Boolean) : Object.values(plan);
        const hasResourceModifications = codebasePlans.some((codebasePlan) => Object.values(codebasePlan.regionalChangesets).some((changeset) => changeset.endpointsToCreate.length > 0 ||
            changeset.endpointsToUpdate.length > 0 ||
            changeset.endpointsToDelete.length > 0));
        if (!hasResourceModifications) {
            (0, utils_1.logLabeledBullet)("functions", `No resources modified for codebase: ${codebase ?? "default"}. Skipping afterRedeploy lifecycle hook.`);
            return false;
        }
    }
    try {
        await executeHook(event, hook, wantBackend);
        return true;
    }
    catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        (0, utils_1.logLabeledWarning)("functions", `Failed to execute ${event} lifecycle hook: ${errorMsg}`);
        (0, utils_1.logLabeledBullet)("functions", `You can retry the lifecycle hook in isolation by running: firebase functions:lifecycle:run ${event} ${codebase ?? "default"}`);
        return false;
    }
}
async function executeTaskQueueHook(taskHook, wantBackend) {
    const targetEndpoint = backend.findEndpoint(wantBackend, (ep) => ep.id === taskHook.function);
    if (!targetEndpoint) {
        throw new error_1.FirebaseError(`Target endpoint "${taskHook.function}" not found in backend for lifecycle hook.`);
    }
    if (!backend.isTaskQueueTriggered(targetEndpoint)) {
        throw new error_1.FirebaseError(`Target endpoint "${taskHook.function}" is not a task queue function.`);
    }
    const queueName = cloudtasks.queueNameForEndpoint(targetEndpoint);
    const bodyStr = taskHook.body ? JSON.stringify(taskHook.body) : "";
    const body = bodyStr ? Buffer.from(bodyStr).toString("base64") : undefined;
    const url = targetEndpoint.uri;
    if (!url) {
        throw new error_1.FirebaseError(`Target endpoint "${taskHook.function}" does not have a trigger URI.`);
    }
    const projectMetadata = await (0, projects_1.getProject)(targetEndpoint.project);
    const projectNumber = projectMetadata.projectNumber;
    const sa = targetEndpoint.serviceAccount || (await computeEngine.getDefaultServiceAccount(projectNumber));
    const task = {
        httpRequest: {
            url,
            httpMethod: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            oidcToken: {
                serviceAccountEmail: sa,
                audience: url,
            },
        },
    };
    if (body) {
        task.httpRequest.body = body;
    }
    await cloudtasks.enqueueTask(queueName, task);
    (0, utils_1.logLabeledSuccess)("functions", `Successfully queued task for lifecycle hook ${taskHook.function} in queue ${queueName}.`);
    return targetEndpoint;
}
function getCloudConsoleLogUrl(endpoint) {
    const { project, region, id } = endpoint;
    const serviceName = endpoint.runServiceId || id;
    const query = `resource.type="cloud_run_revision"\nresource.labels.service_name="${serviceName}"\nresource.labels.location="${region}"`;
    return `https://console.cloud.google.com/logs/query;query=${encodeURIComponent(query)};project=${project}`;
}
async function executeHook(event, hook, backendSpec) {
    let executedEndpoint;
    if ("task" in hook) {
        (0, utils_1.logLabeledBullet)("functions", `Executing ${event} lifecycle hook targeting: ${hook.task.function}...`);
        executedEndpoint = await executeTaskQueueHook(hook.task, backendSpec);
    }
    else if ("call" in hook) {
        throw new error_1.FirebaseError(`Lifecycle hook action type "call" is not supported.`);
    }
    else if ("http" in hook) {
        throw new error_1.FirebaseError(`Lifecycle hook action type "http" is not supported.`);
    }
    else {
        (0, functional_1.assertExhaustive)(hook);
    }
    if (executedEndpoint) {
        (0, utils_1.logLabeledBullet)("functions", `View logs for ${event} at: ${getCloudConsoleLogUrl(executedEndpoint)}`);
    }
    return executedEndpoint;
}
