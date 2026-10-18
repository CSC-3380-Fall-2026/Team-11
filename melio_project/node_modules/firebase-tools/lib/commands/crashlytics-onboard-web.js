"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const error_1 = require("../error");
const logger_1 = require("../logger");
const apps_1 = require("../management/apps");
const projectUtils_1 = require("../projectUtils");
const requireAuth_1 = require("../requireAuth");
const onboarding_1 = require("../crashlytics/onboarding");
exports.command = new command_1.Command("crashlytics:onboard:web [appId]")
    .description("onboard a Firebase web app to Crashlytics")
    .option("--app <appID>", "the app id of your Firebase app")
    .before(requireAuth_1.requireAuth)
    .action(async (appIdInput = "", options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    let appId = appIdInput ?? options.app ?? "";
    let appPlatform = apps_1.AppPlatform.ANY;
    if (!appId) {
        const apps = await (0, apps_1.listFirebaseApps)(projectId, apps_1.AppPlatform.ANY);
        (0, apps_1.checkForApps)(apps, apps_1.AppPlatform.ANY);
        if (apps.length === 1) {
            appId = apps[0].appId;
            appPlatform = apps[0].platform;
        }
        else if (options.nonInteractive) {
            throw new error_1.FirebaseError(`Project ${projectId} has multiple apps, must specify an app id.`);
        }
        else {
            const appMetadata = await (0, apps_1.selectAppInteractively)(apps, apps_1.AppPlatform.ANY);
            appId = appMetadata.appId;
            appPlatform = appMetadata.platform;
        }
    }
    else {
        const apps = await (0, apps_1.listFirebaseApps)(projectId, apps_1.AppPlatform.ANY);
        const matchedApp = apps.find((a) => a.appId === appId);
        if (matchedApp) {
            appPlatform = matchedApp.platform;
        }
        else if (appId.includes(":web:")) {
            appPlatform = apps_1.AppPlatform.WEB;
        }
        else if (appId.includes(":android:")) {
            appPlatform = apps_1.AppPlatform.ANDROID;
        }
        else if (appId.includes(":ios:")) {
            appPlatform = apps_1.AppPlatform.IOS;
        }
    }
    if (appPlatform !== apps_1.AppPlatform.WEB && !appId.includes(":web:")) {
        logger_1.logger.info(`Crashlytics onboarding via the CLI is currently only supported for Web apps. No onboarding steps needed for non-Web app: ${appId}`);
        return undefined;
    }
    return await (0, onboarding_1.onboardCrashlyticsWeb)(projectId, appId, options);
});
