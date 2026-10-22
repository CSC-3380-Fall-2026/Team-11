"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedKitInstanceEnv = seedKitInstanceEnv;
const error_1 = require("../../error");
const env_1 = require("../env");
function seedKitInstanceEnv(opts) {
    if (!opts.envs || Object.keys(opts.envs).length === 0) {
        return;
    }
    if (!opts.projectId) {
        throw new error_1.FirebaseError("A project ID is required to seed environment variables for a kit instance.");
    }
    const normalizedEnvs = {};
    for (const [key, value] of Object.entries(opts.envs)) {
        if (value === undefined || value === null) {
            continue;
        }
        if (Array.isArray(value)) {
            normalizedEnvs[key] = value.join(",");
        }
        else if ((0, error_1.isObject)(value)) {
            normalizedEnvs[key] = JSON.stringify(value);
        }
        else {
            normalizedEnvs[key] = String(value);
        }
    }
    if (Object.keys(normalizedEnvs).length === 0) {
        return;
    }
    (0, env_1.writeUserEnvs)(normalizedEnvs, {
        configDir: opts.configDir,
        functionsSource: opts.functionsSource,
        projectDir: opts.projectDir,
        projectId: opts.projectId,
        projectAlias: opts.projectAlias,
    });
}
