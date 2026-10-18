"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.createDebugToken = createDebugToken;
exports.listDebugTokens = listDebugTokens;
exports.deleteDebugToken = deleteDebugToken;
exports.listServices = listServices;
exports.getService = getService;
exports.updateService = updateService;
exports.getProviderConfig = getProviderConfig;
exports.updateProviderConfig = updateProviderConfig;
exports.batchGetProviderConfigs = batchGetProviderConfigs;
const api_1 = require("../api");
const apiv2_1 = require("../apiv2");
const providers_1 = require("./providers");
const API_VERSION = "v1";
exports.client = new apiv2_1.Client({
    urlPrefix: (0, api_1.appCheckOrigin)(),
    auth: true,
    apiVersion: API_VERSION,
});
async function createDebugToken(projectNumber, appId, displayName, token) {
    const parent = `projects/${projectNumber}/apps/${appId}`;
    const res = await exports.client.post(`${parent}/debugTokens`, {
        displayName,
        token,
    });
    return res.body;
}
async function listDebugTokens(projectNumber, appId) {
    const parent = `projects/${projectNumber}/apps/${appId}`;
    const debugTokens = [];
    let pageToken = "";
    do {
        const queryParams = {};
        if (pageToken) {
            queryParams.pageToken = pageToken;
        }
        const res = await exports.client.get(`${parent}/debugTokens`, { queryParams });
        if (res.body?.debugTokens) {
            debugTokens.push(...res.body.debugTokens);
        }
        pageToken = res.body?.nextPageToken || "";
    } while (pageToken);
    return debugTokens;
}
async function deleteDebugToken(name) {
    await exports.client.delete(name);
}
async function listServices(projectNumber) {
    const services = [];
    let pageToken = "";
    do {
        const queryParams = {};
        if (pageToken) {
            queryParams.pageToken = pageToken;
        }
        const res = await exports.client.get(`projects/${projectNumber}/services`, {
            queryParams,
        });
        if (res.body?.services) {
            services.push(...res.body.services);
        }
        pageToken = res.body?.nextPageToken || "";
    } while (pageToken);
    return services;
}
async function getService(projectNumber, serviceId) {
    const res = await exports.client.get(`projects/${projectNumber}/services/${serviceId}`);
    return res.body;
}
async function updateService(projectNumber, serviceId, update) {
    const updateMask = ["enforcementMode"];
    if (update.replayProtection) {
        updateMask.push("replayProtection");
    }
    const res = await exports.client.patch(`projects/${projectNumber}/services/${serviceId}`, update, { queryParams: { updateMask: updateMask.join(",") } });
    return res.body;
}
async function getProviderConfig(projectNumber, appId, provider) {
    const { configResource } = providers_1.PROVIDER_META[provider];
    const res = await exports.client.get(`projects/${projectNumber}/apps/${appId}/${configResource}`);
    return res.body;
}
async function updateProviderConfig(projectNumber, appId, provider, update, updateMask) {
    const { configResource } = providers_1.PROVIDER_META[provider];
    const res = await exports.client.patch(`projects/${projectNumber}/apps/${appId}/${configResource}`, update, { queryParams: { updateMask: updateMask.join(",") } });
    return res.body;
}
async function batchGetProviderConfigs(projectNumber, provider) {
    const { configResource } = providers_1.PROVIDER_META[provider];
    const res = await exports.client.get(`projects/${projectNumber}/apps/-/${configResource}:batchGet`);
    return res.body?.configs ?? [];
}
