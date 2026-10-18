"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAppApiKeyRestriction = updateAppApiKeyRestriction;
const api_1 = require("../api");
const apiv2_1 = require("../apiv2");
const error_1 = require("../error");
const operation_poller_1 = require("../operation-poller");
const API_VERSION = "v2";
const CREDENTIALS_CONSOLE_URL = "https://console.cloud.google.com/apis/credentials";
const client = new apiv2_1.Client({
    urlPrefix: (0, api_1.apiKeysOrigin)(),
    auth: true,
    apiVersion: API_VERSION,
});
async function updateAppApiKeyRestriction(options) {
    const { apiKey, service } = options;
    const keyResourceName = await lookupKeyResourceName(apiKey);
    const key = await getKey(keyResourceName);
    await ensureServiceInKeyRestrictions(key, service);
}
async function lookupKeyResourceName(apiKeyString) {
    try {
        const res = await client.get("/keys:lookupKey", {
            queryParams: { keyString: apiKeyString },
        });
        return res.body.name;
    }
    catch (err) {
        if ((0, error_1.getErrStatus)(err) === 403) {
            throw new error_1.FirebaseError(`Permission denied when looking up API key.\n\n` +
                `To resolve this, ensure your account has the right permissions on the project in the Google Cloud Console:\n\n` +
                `  ${CREDENTIALS_CONSOLE_URL}`, { original: err instanceof Error ? err : undefined, status: 403 });
        }
        throw err;
    }
}
async function getKey(keyResourceName) {
    try {
        const res = await client.get(keyResourceName);
        return res.body;
    }
    catch (err) {
        if ((0, error_1.getErrStatus)(err) === 403) {
            throw new error_1.FirebaseError(`Permission denied when retrieving API key ${keyResourceName}.\n\n` +
                `To resolve this, ensure your account has the right permissions on the project in the Google Cloud Console:\n\n` +
                `  ${CREDENTIALS_CONSOLE_URL}`, { original: err instanceof Error ? err : undefined, status: 403 });
        }
        throw err;
    }
}
async function ensureServiceInKeyRestrictions(key, service) {
    if (!key.restrictions?.apiTargets || key.restrictions.apiTargets.length === 0) {
        return;
    }
    const alreadyAllowed = key.restrictions.apiTargets.some((target) => target.service === service);
    if (alreadyAllowed) {
        return;
    }
    const updatedRestrictions = {
        ...key.restrictions,
        apiTargets: [...key.restrictions.apiTargets, { service }],
    };
    await updateKeyRestrictions({
        ...key,
        restrictions: updatedRestrictions,
    });
}
async function updateKeyRestrictions(key) {
    const queryParams = { updateMask: "restrictions" };
    try {
        const res = await client.patch(key.name, key, {
            queryParams,
        });
        await (0, operation_poller_1.pollOperation)({
            apiOrigin: (0, api_1.apiKeysOrigin)(),
            apiVersion: API_VERSION,
            operationResourceName: res.body.name,
        });
    }
    catch (err) {
        if ((0, error_1.getErrStatus)(err) === 403) {
            const keyIdentifier = key.displayName ? `${key.displayName} (${key.name})` : key.name;
            throw new error_1.FirebaseError(`Permission denied when updating API key ${keyIdentifier}.\n\n` +
                `To resolve this, ensure your account has the right permissions on the project in the Google Cloud Console:\n\n` +
                `  ${CREDENTIALS_CONSOLE_URL}`, { original: err instanceof Error ? err : undefined, status: 403 });
        }
        throw err;
    }
}
