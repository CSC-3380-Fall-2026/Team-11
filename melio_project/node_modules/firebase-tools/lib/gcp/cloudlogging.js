"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEntries = listEntries;
exports.createOrUpdateLogBucket = createOrUpdateLogBucket;
exports.createOrUpdateLogSink = createOrUpdateLogSink;
const api_1 = require("../api");
const apiv2_1 = require("../apiv2");
const error_1 = require("../error");
const API_VERSION = "v2";
async function listEntries(projectId, filter, pageSize, order, pageToken) {
    const client = new apiv2_1.Client({ urlPrefix: (0, api_1.cloudloggingOrigin)(), apiVersion: API_VERSION });
    const body = {
        resourceNames: [`projects/${projectId}`],
        filter,
        orderBy: `timestamp ${order}`,
        pageSize,
    };
    if (pageToken) {
        body.pageToken = pageToken;
    }
    try {
        const result = await client.post("/entries:list", body);
        return {
            entries: result.body.entries ?? [],
            nextPageToken: result.body.nextPageToken,
        };
    }
    catch (err) {
        throw new error_1.FirebaseError("Failed to retrieve log entries from Google Cloud.", {
            original: err,
        });
    }
}
async function createOrUpdateLogBucket(projectId, bucketId, location = "global", analyticsEnabled = true) {
    const client = new apiv2_1.Client({ urlPrefix: (0, api_1.cloudloggingOrigin)(), apiVersion: API_VERSION });
    const path = `/projects/${projectId}/locations/${location}/buckets`;
    try {
        const res = await client.post(`${path}?bucketId=${bucketId}`, { analyticsEnabled });
        return res.body;
    }
    catch (err) {
        if (err.status === 409) {
            try {
                const patchRes = await client.patch(`${path}/${bucketId}?updateMask=analyticsEnabled`, { analyticsEnabled });
                return patchRes.body;
            }
            catch (patchErr) {
                const msg = patchErr.message || JSON.stringify(patchErr.body) || patchErr;
                throw new error_1.FirebaseError(`Failed to patch log bucket ${bucketId} (status ${patchErr.status}): ${msg}`, { original: patchErr });
            }
        }
        const msg = err.message || JSON.stringify(err.body) || err;
        if (typeof msg === "string" && msg.toLowerCase().includes("billing account")) {
            throw new error_1.FirebaseError(`Creating a Cloud Logging bucket requires a valid linked billing account (Blaze plan). Please attach a billing account to project ${projectId} and try again.`, { original: err });
        }
        throw new error_1.FirebaseError(`Failed to create or update log bucket ${bucketId} (status ${err.status}): ${msg}`, { original: err });
    }
}
async function createOrUpdateLogSink(projectId, sinkName, destination, filter) {
    const client = new apiv2_1.Client({ urlPrefix: (0, api_1.cloudloggingOrigin)(), apiVersion: API_VERSION });
    const path = `/projects/${projectId}/sinks`;
    const body = {
        name: sinkName,
        destination,
        filter,
    };
    try {
        const res = await client.post(path, body);
        return res.body;
    }
    catch (err) {
        if (err.status === 409) {
            try {
                const putRes = await client.put(`${path}/${sinkName}`, body);
                return putRes.body;
            }
            catch (putErr) {
                const msg = putErr.message || JSON.stringify(putErr.body) || putErr;
                throw new error_1.FirebaseError(`Failed to update log sink ${sinkName} (status ${putErr.status}): ${msg}`, { original: putErr });
            }
        }
        const msg = err.message || JSON.stringify(err.body) || err;
        throw new error_1.FirebaseError(`Failed to create or update log sink ${sinkName} (status ${err.status}): ${msg}`, { original: err });
    }
}
