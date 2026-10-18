"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrPromptProjectAndAppId = void 0;
exports.getOrPromptAppId = getOrPromptAppId;
exports.getOrPromptApp = getOrPromptApp;
const apps_1 = require("../management/apps");
const projectUtils_1 = require("../projectUtils");
const appUtils_1 = require("../appUtils");
const error_1 = require("../error");
const logger_1 = require("../logger");
const clc = require("colorette");
async function chooseApp(projectId, apps, options, message) {
    const localApps = await (0, appUtils_1.detectApps)(options.cwd || process.cwd());
    const localAppIds = localApps.map((a) => a.appId).filter(Boolean);
    const local = localAppIds.length ? apps.filter((app) => localAppIds.includes(app.appId)) : [];
    const choices = local.length ? local : apps;
    if (choices.length === 1) {
        return choices[0];
    }
    if (options.nonInteractive) {
        throw new error_1.FirebaseError(`Project ${projectId} has multiple apps, must specify an app id.`);
    }
    return (0, apps_1.selectAppInteractively)(choices, apps_1.AppPlatform.ANY, { message });
}
async function listAppsOrThrow(projectId) {
    const apps = await (0, apps_1.listFirebaseApps)(projectId, apps_1.AppPlatform.ANY);
    if (!apps.length) {
        throw new error_1.FirebaseError(`There are no apps associated with project ${projectId}.`);
    }
    return apps;
}
async function getOrPromptAppId(options, message = "Select the app to register a debug token for:") {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    logger_1.logger.info(`Active Project: ${clc.bold(projectId)}`);
    if (options.app) {
        return { projectId, appId: options.app };
    }
    const app = await chooseApp(projectId, await listAppsOrThrow(projectId), options, message);
    return { projectId, appId: app.appId };
}
exports.getOrPromptProjectAndAppId = getOrPromptAppId;
async function getOrPromptApp(options, message) {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    logger_1.logger.info(`Active Project: ${clc.bold(projectId)}`);
    const apps = await listAppsOrThrow(projectId);
    if (options.app) {
        const app = apps.find((a) => a.appId === options.app);
        if (!app) {
            throw new error_1.FirebaseError(`App ${options.app} was not found in project ${projectId}.`);
        }
        return { projectId, appId: app.appId, platform: app.platform };
    }
    const app = await chooseApp(projectId, apps, options, message);
    return { projectId, appId: app.appId, platform: app.platform };
}
