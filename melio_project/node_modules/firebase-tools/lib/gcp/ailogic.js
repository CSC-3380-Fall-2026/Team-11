"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROVIDER_TYPES = exports.WRITABLE_CONFIG_PATHS = exports.TEMPLATE_ID_REGEX = exports.client = exports.AI_LOGIC_TRIGGERS_TO_EVENTS = exports.AI_LOGIC_EVENTS_TO_TRIGGER = exports.AI_LOGIC_AFTER_GENERATE_CONTENT = exports.AI_LOGIC_BEFORE_GENERATE_CONTENT = exports.GLOBAL_LOCATION = exports.AILOGIC_LOGGING_PREFIX = exports.API_VERSION = void 0;
exports.createTrigger = createTrigger;
exports.getTrigger = getTrigger;
exports.updateTrigger = updateTrigger;
exports.deleteTrigger = deleteTrigger;
exports.listTriggers = listTriggers;
exports.upsertBlockingFunction = upsertBlockingFunction;
exports.deleteBlockingFunction = deleteBlockingFunction;
exports.templateIdFromName = templateIdFromName;
exports.assertValidTemplateId = assertValidTemplateId;
exports.assertKnownConfigPath = assertKnownConfigPath;
exports.withTemplate404 = withTemplate404;
exports.isProviderType = isProviderType;
exports.parseProviderType = parseProviderType;
exports.getTemplate = getTemplate;
exports.updateTemplate = updateTemplate;
exports.deleteTemplate = deleteTemplate;
exports.setTemplateLocked = setTemplateLocked;
exports.listTemplates = listTemplates;
exports.getConfig = getConfig;
exports.updateConfig = updateConfig;
exports.enableProvider = enableProvider;
exports.disableProvider = disableProvider;
exports.listProviders = listProviders;
exports.isAILogicApiEnabled = isAILogicApiEnabled;
exports.ensureAILogicApiEnabled = ensureAILogicApiEnabled;
const apiv2_1 = require("../apiv2");
const api_1 = require("../api");
const error_1 = require("../error");
const ensureApiEnabled = require("../ensureApiEnabled");
const serviceUsage = require("./serviceusage");
const colorette_1 = require("colorette");
const cloudbilling = require("./cloudbilling");
const iam = require("./iam");
const logger_1 = require("../logger");
const prompt_1 = require("../prompt");
exports.API_VERSION = "v1beta";
exports.AILOGIC_LOGGING_PREFIX = "ailogic";
exports.GLOBAL_LOCATION = "global";
exports.AI_LOGIC_BEFORE_GENERATE_CONTENT = "google.firebase.ailogic.v1.beforeGenerate";
exports.AI_LOGIC_AFTER_GENERATE_CONTENT = "google.firebase.ailogic.v1.afterGenerate";
exports.AI_LOGIC_EVENTS_TO_TRIGGER = {
    [exports.AI_LOGIC_BEFORE_GENERATE_CONTENT]: "before-generate-content",
    [exports.AI_LOGIC_AFTER_GENERATE_CONTENT]: "after-generate-content",
};
exports.AI_LOGIC_TRIGGERS_TO_EVENTS = {
    "before-generate-content": exports.AI_LOGIC_BEFORE_GENERATE_CONTENT,
    "after-generate-content": exports.AI_LOGIC_AFTER_GENERATE_CONTENT,
};
exports.client = new apiv2_1.Client({
    urlPrefix: (0, api_1.aiLogicProxyOrigin)(),
    auth: true,
    apiVersion: exports.API_VERSION,
});
async function createTrigger(projectId, location, triggerId, trigger, validateOnly = false) {
    const parent = `projects/${projectId}/locations/${location}`;
    const res = await exports.client.post(`${parent}/triggers`, trigger, {
        queryParams: {
            triggerId,
            validateOnly: validateOnly ? "true" : "false",
        },
    });
    return res.body;
}
async function getTrigger(projectId, location, triggerId) {
    const name = `projects/${projectId}/locations/${location}/triggers/${triggerId}`;
    const res = await exports.client.get(name);
    return res.body;
}
async function updateTrigger(projectId, location, triggerId, trigger, updateMask, allowMissing = false, validateOnly = false) {
    const name = `projects/${projectId}/locations/${location}/triggers/${triggerId}`;
    const queryParams = {
        allowMissing: allowMissing ? "true" : "false",
        validateOnly: validateOnly ? "true" : "false",
    };
    if (updateMask && updateMask.length > 0) {
        queryParams.updateMask = updateMask.join(",");
    }
    const res = await exports.client.patch(name, trigger, { queryParams });
    return res.body;
}
async function deleteTrigger(projectId, location, triggerId, allowMissing = true, validateOnly = false, etag) {
    const name = `projects/${projectId}/locations/${location}/triggers/${triggerId}`;
    const queryParams = {
        allowMissing: allowMissing ? "true" : "false",
        validateOnly: validateOnly ? "true" : "false",
    };
    if (etag) {
        queryParams.etag = etag;
    }
    await exports.client.delete(name, { queryParams });
}
async function listTriggers(projectId, location, filter) {
    const parent = `projects/${projectId}/locations/${location}`;
    let pageToken;
    const triggers = [];
    do {
        const queryParams = pageToken ? { pageToken } : {};
        if (filter) {
            queryParams.filter = filter;
        }
        const res = await exports.client.get(`${parent}/triggers`, { queryParams });
        if (res.body.triggers) {
            triggers.push(...res.body.triggers);
        }
        pageToken = res.body.nextPageToken;
    } while (pageToken);
    return triggers;
}
async function upsertBlockingFunction(endpoint) {
    const eventType = endpoint.blockingTrigger.eventType;
    const triggerId = exports.AI_LOGIC_EVENTS_TO_TRIGGER[eventType];
    const location = endpoint.blockingTrigger.options?.regionalWebhook ? endpoint.region : "global";
    const triggerBody = {
        cloudFunction: {
            id: endpoint.id,
            locationId: endpoint.region,
        },
    };
    try {
        return await createTrigger(endpoint.project, location, triggerId, triggerBody);
    }
    catch (err) {
        if ((0, error_1.getErrStatus)(err) === 409) {
            return await updateTrigger(endpoint.project, location, triggerId, triggerBody, [
                "cloudFunction",
            ]);
        }
        throw err;
    }
}
async function deleteBlockingFunction(endpoint) {
    const eventType = endpoint.blockingTrigger.eventType;
    const triggerId = exports.AI_LOGIC_EVENTS_TO_TRIGGER[eventType];
    const location = endpoint.blockingTrigger.options?.regionalWebhook ? endpoint.region : "global";
    await deleteTrigger(endpoint.project, location, triggerId, true);
}
function templateIdFromName(name) {
    return name.split("/").pop() ?? "";
}
exports.TEMPLATE_ID_REGEX = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
function assertValidTemplateId(templateId) {
    if (!exports.TEMPLATE_ID_REGEX.test(templateId)) {
        throw new error_1.FirebaseError(`Invalid template id: ${(0, colorette_1.bold)(templateId)}. Template ids must start with a letter or digit and contain only letters, digits, '.', '_', and '-'.`);
    }
}
exports.WRITABLE_CONFIG_PATHS = [
    "security.auth-only",
    "security.template-only",
    "monitoring.state",
    "monitoring.sample-rate-percentage",
];
function assertKnownConfigPath(path, validPaths) {
    if (!validPaths.includes(path)) {
        throw new error_1.FirebaseError(`Unknown configuration path: ${path}\n\nValid paths:\n\n` +
            validPaths.map((p) => `  ${p}`).join("\n"));
    }
}
function templateName(projectId, templateId) {
    return `projects/${projectId}/locations/${exports.GLOBAL_LOCATION}/templates/${templateId}`;
}
async function withTemplate404(templateId, fn) {
    try {
        return await fn();
    }
    catch (err) {
        if ((0, error_1.getErrStatus)(err) === 404) {
            throw new error_1.FirebaseError(`Template ${(0, colorette_1.bold)(templateId)} does not exist.`);
        }
        throw err;
    }
}
exports.PROVIDER_TYPES = ["gemini-developer-api", "gemini-agent-platform-api"];
function isProviderType(value) {
    return exports.PROVIDER_TYPES.some((p) => p === value);
}
function parseProviderType(value) {
    if (!isProviderType(value)) {
        throw new error_1.FirebaseError(`Invalid provider type: ${(0, colorette_1.bold)(value)}. Must be one of: ${exports.PROVIDER_TYPES.map((p) => `'${p}'`).join(", ")}.`);
    }
    return value;
}
async function getTemplate(projectId, templateId) {
    const res = await exports.client.get(templateName(projectId, templateId));
    return res.body;
}
async function updateTemplate(projectId, templateId, template, updateMask, allowMissing = true) {
    const queryParams = {
        allowMissing: allowMissing ? "true" : "false",
    };
    if (updateMask && updateMask.length > 0) {
        queryParams.updateMask = updateMask.join(",");
    }
    const res = await exports.client.patch(templateName(projectId, templateId), template, { queryParams });
    return res.body;
}
async function deleteTemplate(projectId, templateId, etag) {
    const queryParams = {};
    if (etag) {
        queryParams.etag = etag;
    }
    await exports.client.delete(templateName(projectId, templateId), { queryParams });
}
async function setTemplateLocked(projectId, templateId, locked) {
    await exports.client.post(`${templateName(projectId, templateId)}:modifyLock`, { locked });
}
async function listTemplates(projectId) {
    const parent = `projects/${projectId}/locations/${exports.GLOBAL_LOCATION}`;
    let pageToken;
    const templates = [];
    do {
        const queryParams = pageToken ? { pageToken } : {};
        const res = await exports.client.get(`${parent}/templates`, { queryParams });
        if (res.body?.templates) {
            templates.push(...res.body.templates);
        }
        pageToken = res.body?.nextPageToken;
    } while (pageToken);
    return templates;
}
async function getConfig(projectId) {
    const name = `projects/${projectId}/locations/${exports.GLOBAL_LOCATION}/config`;
    const res = await exports.client.get(name);
    return res.body;
}
async function updateConfig(projectId, config, updateMask) {
    const name = `projects/${projectId}/locations/${exports.GLOBAL_LOCATION}/config`;
    const queryParams = {};
    if (updateMask && updateMask.length > 0) {
        queryParams.updateMask = updateMask.join(",");
    }
    const res = await exports.client.patch(name, config, { queryParams });
    return res.body;
}
async function enableProvider(projectId, providerType) {
    if (providerType === "gemini-agent-platform-api") {
        const billingEnabled = await cloudbilling.checkBillingEnabled(projectId);
        if (!billingEnabled) {
            throw new error_1.FirebaseError(`Your project ${(0, colorette_1.bold)(projectId)} must be on the Blaze (pay-as-you-go) plan to enable the Agent Platform. To upgrade, visit the following URL:\n\nhttps://console.firebase.google.com/project/${projectId}/usage/details`);
        }
    }
    await ensureApiEnabled.ensure(projectId, "firebasevertexai.googleapis.com", exports.AILOGIC_LOGGING_PREFIX);
    const providerApi = providerType === "gemini-developer-api"
        ? "generativelanguage.googleapis.com"
        : "aiplatform.googleapis.com";
    await ensureApiEnabled.ensure(projectId, providerApi, exports.AILOGIC_LOGGING_PREFIX);
}
async function disableProvider(projectId, providerType) {
    if (providerType === "gemini-developer-api") {
        await serviceUsage.disableServiceAndPoll(projectId, "generativelanguage.googleapis.com", exports.AILOGIC_LOGGING_PREFIX);
        const isVertexEnabled = await ensureApiEnabled.check(projectId, "aiplatform.googleapis.com", exports.AILOGIC_LOGGING_PREFIX, true);
        if (!isVertexEnabled) {
            await serviceUsage.disableServiceAndPoll(projectId, "firebasevertexai.googleapis.com", exports.AILOGIC_LOGGING_PREFIX);
        }
    }
    else if (providerType === "gemini-agent-platform-api") {
        await serviceUsage.disableServiceAndPoll(projectId, "aiplatform.googleapis.com", exports.AILOGIC_LOGGING_PREFIX);
        const isDeveloperEnabled = await ensureApiEnabled.check(projectId, "generativelanguage.googleapis.com", exports.AILOGIC_LOGGING_PREFIX, true);
        if (!isDeveloperEnabled) {
            await serviceUsage.disableServiceAndPoll(projectId, "firebasevertexai.googleapis.com", exports.AILOGIC_LOGGING_PREFIX);
        }
    }
}
async function listProviders(projectId) {
    const [isAILogicEnabled, isDeveloperEnabled, isVertexEnabled] = await Promise.all([
        isAILogicApiEnabled(projectId),
        ensureApiEnabled.check(projectId, "generativelanguage.googleapis.com", exports.AILOGIC_LOGGING_PREFIX, true),
        ensureApiEnabled.check(projectId, "aiplatform.googleapis.com", exports.AILOGIC_LOGGING_PREFIX, true),
    ]);
    if (!isAILogicEnabled) {
        return [];
    }
    const enabled = [];
    if (isDeveloperEnabled) {
        enabled.push("gemini-developer-api");
    }
    if (isVertexEnabled) {
        enabled.push("gemini-agent-platform-api");
    }
    return enabled;
}
async function isAILogicApiEnabled(projectId) {
    return ensureApiEnabled.check(projectId, "firebasevertexai.googleapis.com", exports.AILOGIC_LOGGING_PREFIX, true);
}
async function ensureAILogicApiEnabled(projectId, options) {
    if (await isAILogicApiEnabled(projectId)) {
        return;
    }
    if (options.nonInteractive) {
        throw new error_1.FirebaseError(`The Firebase AI Logic API (firebasevertexai.googleapis.com) is not enabled on project ${projectId}.\n\n` +
            `Enable Firebase AI Logic with one of the Gemini API providers by running:\n\n` +
            `  firebase ailogic:providers:enable gemini-developer-api\n` +
            `  firebase ailogic:providers:enable gemini-agent-platform-api\n\n` +
            `Then run this command again.`);
    }
    const { missing } = await iam.testIamPermissions(projectId, ["serviceusage.services.enable"]);
    if (missing.length > 0) {
        throw new error_1.FirebaseError(`You do not have permission to enable the Firebase AI Logic API on project ${projectId}.\n\n` +
            `Missing permission: ${missing.join(", ")}\n\n` +
            `This permission is included in the Owner and Editor roles. Ask a project ` +
            `administrator to enable the API or grant you the permission, then run this command again.`);
    }
    logger_1.logger.info(`The Firebase AI Logic API (firebasevertexai.googleapis.com) is not enabled on project ${projectId}.`);
    const proceed = await (0, prompt_1.confirm)({
        message: "Would you like to enable it now?",
        default: true,
        force: options.force,
    });
    if (!proceed) {
        throw new error_1.FirebaseError("Command aborted.", { exit: 1 });
    }
    for (;;) {
        const provider = await (0, prompt_1.select)({
            message: "Which Gemini API provider do you want to enable?",
            choices: [
                { name: "gemini-developer-api", value: "gemini-developer-api" },
                {
                    name: "gemini-agent-platform-api (requires the Blaze plan)",
                    value: "gemini-agent-platform-api",
                },
                { name: "cancel", value: "cancel" },
            ],
        });
        if (provider === "cancel") {
            throw new error_1.FirebaseError("Command aborted.", { exit: 1 });
        }
        if (provider === "gemini-agent-platform-api") {
            const billingEnabled = await cloudbilling.checkBillingEnabled(projectId);
            if (!billingEnabled) {
                logger_1.logger.info(`\n${(0, colorette_1.bold)("Error:")} The gemini-agent-platform-api provider requires the pay-as-you-go (Blaze) plan.\n` +
                    `Project ${projectId} is on the Spark plan.\n\n` +
                    `Upgrade your plan at:\n\n` +
                    `  https://console.firebase.google.com/project/${projectId}/usage/details\n`);
                continue;
            }
        }
        logger_1.logger.info(`Enabling firebasevertexai.googleapis.com...`);
        logger_1.logger.info(`Enabling provider ${provider}...`);
        await enableProvider(projectId, provider);
        logger_1.logger.info((0, colorette_1.bold)(`Successfully enabled Firebase AI Logic with provider: ${provider}`));
        break;
    }
}
