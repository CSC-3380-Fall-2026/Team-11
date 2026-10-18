"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateTelemetryConfig = createOrUpdateTelemetryConfig;
const api_1 = require("../api");
const apiv2_1 = require("../apiv2");
const error_1 = require("../error");
const API_VERSION = "v1alpha";
async function createOrUpdateTelemetryConfig(projectId, appId, logBucket, samplingRate = 1) {
    const client = new apiv2_1.Client({ urlPrefix: (0, api_1.firebaseTelemetryAdminOrigin)(), apiVersion: API_VERSION });
    const configId = appId.replace(/[:.]/g, "-");
    const configName = `projects/${projectId}/locations/global/configs/${configId}`;
    const configBody = {
        name: configName,
        appId,
        logBucket,
        samplingRate,
    };
    try {
        const res = await client.post(`/projects/${projectId}/locations/global/configs?configId=${configId}`, configBody);
        return res.body;
    }
    catch (err) {
        if (err.status === 409) {
            try {
                const patchRes = await client.patch(`/projects/${projectId}/locations/global/configs/${configId}?updateMask=logBucket,samplingRate`, configBody);
                return patchRes.body;
            }
            catch (patchErr) {
                const msg = patchErr.message || JSON.stringify(patchErr.body) || patchErr;
                throw new error_1.FirebaseError(`Failed to patch telemetry config for web app ${appId} (status ${patchErr.status}): ${msg}`, { original: patchErr });
            }
        }
        const msg = err.message || JSON.stringify(err.body) || err;
        throw new error_1.FirebaseError(`Failed to configure telemetry for web app ${appId} (status ${err.status}): ${msg}`, { original: err });
    }
}
