"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.release = release;
exports.printTriggerUrls = printTriggerUrls;
const clc = require("colorette");
const logger_1 = require("../../../logger");
const functional_1 = require("../../../functional");
const utils = require("../../../utils");
const backend = require("../backend");
const planner = require("./planner");
const fabricator = require("./fabricator");
const reporter = require("./reporter");
const executor = require("./executor");
const prompts = require("../prompts");
const functionsConfig_1 = require("../../../functionsConfig");
const functionsDeployHelper_1 = require("../functionsDeployHelper");
const error_1 = require("../../../error");
const getProjectNumber_1 = require("../../../getProjectNumber");
const extensions_1 = require("../../extensions");
const artifacts = require("../../../functions/artifacts");
const lifecycle_1 = require("./lifecycle");
async function release(context, options, payload) {
    if (context.extensions && payload.extensions) {
        await (0, extensions_1.release)(context.extensions, options, payload.extensions);
    }
    if (!context.config) {
        return;
    }
    if (!payload.functions) {
        return;
    }
    if (!context.sources) {
        return;
    }
    const plan = {};
    for (const [codebase, { wantBackend, haveBackend, haveRoles, existingManagedSA, managedSA },] of Object.entries(payload.functions)) {
        plan[codebase] = await planner.createDeploymentPlan({
            codebase,
            wantBackend,
            haveBackend,
            projectId: context.projectId,
            filters: context.filters,
            haveRoles,
            existingManagedSA,
            managedSA,
        });
    }
    await prompts.promptForSecurityChanges(plan, options);
    const allRegionalChanges = Object.values(plan)
        .map((codebasePlan) => Object.values(codebasePlan.regionalChangesets))
        .reduce(functional_1.reduceFlat, []);
    const fnsToDelete = allRegionalChanges
        .map((regionalChanges) => regionalChanges.endpointsToDelete)
        .reduce(functional_1.reduceFlat, []);
    const shouldDelete = await prompts.promptForFunctionDeletion(fnsToDelete, options);
    if (!shouldDelete) {
        for (const changes of allRegionalChanges) {
            changes.endpointsToDelete = [];
        }
    }
    const fnsToUpdate = allRegionalChanges
        .map((regionalChanges) => regionalChanges.endpointsToUpdate)
        .reduce(functional_1.reduceFlat, []);
    const fnsToUpdateSafe = await prompts.promptForUnsafeMigration(fnsToUpdate, options);
    const safeEndpoints = new Set(fnsToUpdateSafe.map((eu) => eu.endpoint));
    for (const changes of allRegionalChanges) {
        changes.endpointsToUpdate = changes.endpointsToUpdate.filter((eu) => safeEndpoints.has(eu.endpoint));
    }
    const throttlerOptions = {
        retries: 30,
        backoff: 20000,
        concurrency: 40,
        maxBackoff: 100000,
    };
    const runThrottlerOptions = {
        ...throttlerOptions,
        concurrency: 2,
    };
    const projectNumber = options.projectNumber || (await (0, getProjectNumber_1.getProjectNumber)(context.projectId));
    const fab = new fabricator.Fabricator({
        functionExecutor: new executor.QueueExecutor(throttlerOptions),
        runFunctionExecutor: new executor.QueueExecutor(runThrottlerOptions),
        executor: new executor.QueueExecutor(throttlerOptions),
        sources: context.sources,
        appEngineLocation: (0, functionsConfig_1.getAppEngineLocation)(context.firebaseConfig),
        projectNumber: projectNumber,
        projectId: context.projectId,
    });
    const summary = await fab.applyPlan(plan);
    await reporter.logAndTrackDeployStats(summary, context);
    reporter.printErrors(summary);
    const wantBackend = backend.merge(...Object.values(payload.functions).map((p) => p.wantBackend));
    printTriggerUrls(wantBackend, projectNumber);
    for (const [codebase, { wantBackend: w, haveBackend: h }] of Object.entries(payload.functions)) {
        const { errors } = getCodebaseDeployStats(codebase, w, h, summary);
        if (errors.length === 0) {
            await (0, lifecycle_1.executeLifecycleHooks)(w, h, plan, codebase, options);
        }
    }
    await setupArtifactCleanupPolicies(options, options.projectId, Object.keys(wantBackend.endpoints));
    const allErrors = summary.results.filter((r) => r.error).map((r) => r.error);
    if (allErrors.length) {
        for (const [codebase, { wantBackend: w, haveBackend: h }] of Object.entries(payload.functions)) {
            const { errors } = getCodebaseDeployStats(codebase, w, h, summary);
            if (errors.length > 0) {
                const event = (0, lifecycle_1.determineLifecycleEvent)(h);
                if (w.lifecycleHooks?.[event]) {
                    utils.logLabeledWarning("functions", `Lifecycle hook "${event}" for codebase "${codebase}" was configured but not executed because one or more function deployments failed.`);
                }
            }
        }
        const opts = allErrors.length === 1 ? { original: allErrors[0] } : { children: allErrors };
        logger_1.logger.debug("Functions deploy failed.");
        for (const error of allErrors) {
            logger_1.logger.debug(JSON.stringify(error, null, 2));
        }
        throw new error_1.FirebaseError("There was an error deploying functions", { ...opts, exit: 2 });
    }
}
function printTriggerUrls(results, projectNumber) {
    const httpsFunctions = backend
        .allEndpoints(results)
        .filter((b) => backend.isHttpsTriggered(b) || backend.isDataConnectGraphqlTriggered(b));
    if (httpsFunctions.length === 0) {
        return;
    }
    for (const httpsFunc of httpsFunctions) {
        if (!httpsFunc.uri) {
            logger_1.logger.debug("Not printing URL for HTTPS function. Typically this means it didn't match a filter or we failed deployment");
            continue;
        }
        if (backend.isDataConnectGraphqlTriggered(httpsFunc)) {
            const uri = backend.maybeDeterministicCloudRunUri(httpsFunc, projectNumber);
            logger_1.logger.info(clc.bold("Function URL"), `(${(0, functionsDeployHelper_1.getFunctionLabel)(httpsFunc)}):`, uri);
            continue;
        }
        logger_1.logger.info(clc.bold("Function URL"), `(${(0, functionsDeployHelper_1.getFunctionLabel)(httpsFunc)}):`, httpsFunc.uri);
    }
}
function getCodebaseDeployStats(codebase, wantBackend, haveBackend, summary) {
    const cb = codebase || "default";
    const results = summary.results.filter((r) => (r.endpoint.codebase ?? "default") === cb ||
        !!wantBackend.endpoints[r.endpoint.region]?.[r.endpoint.id] ||
        !!haveBackend.endpoints[r.endpoint.region]?.[r.endpoint.id]);
    const errors = results.filter((r) => r.error);
    return { results, errors };
}
async function setupArtifactCleanupPolicies(options, projectId, locations) {
    if (locations.length === 0) {
        return;
    }
    const { locationsToSetup, locationsWithErrors: locationsWithCheckErrors } = await artifacts.checkCleanupPolicy(projectId, locations);
    if (locationsToSetup.length === 0) {
        return;
    }
    const daysToKeep = await prompts.promptForCleanupPolicyDays(options, locationsToSetup);
    utils.logLabeledBullet("functions", `Configuring cleanup policy for ${locationsToSetup.length > 1 ? "repositories" : "repository"} in ${locationsToSetup.join(", ")}. ` +
        `Images older than ${daysToKeep} days will be automatically deleted.`);
    const { locationsWithPolicy, locationsWithErrors: locationsWithSetupErrors } = await artifacts.setCleanupPolicies(projectId, locationsToSetup, daysToKeep);
    utils.logLabeledBullet("functions", `Configured cleanup policy for ${locationsWithPolicy.length > 1 ? "repositories" : "repository"} in ${locationsToSetup.join(", ")}.`);
    const locationsWithErrors = [...locationsWithCheckErrors, ...locationsWithSetupErrors];
    if (locationsWithErrors.length > 0) {
        utils.logLabeledWarning("functions", `Failed to set up cleanup policy for repositories in ${locationsWithErrors.length > 1 ? "regions" : "region"} ` +
            `${locationsWithErrors.join(", ")}.` +
            "This could result in a small monthly bill as container images accumulate over time.");
        utils.logLabeledWarning("functions", `Functions successfully deployed but could not set up cleanup policy in ` +
            `${locationsWithErrors.length > 1 ? "regions" : "region"} ${locationsWithErrors.join(", ")}. ` +
            `Pass the --force option to automatically set up a cleanup policy or ` +
            "run 'firebase functions:artifacts:setpolicy' to set up a cleanup policy to automatically delete old images.");
    }
}
