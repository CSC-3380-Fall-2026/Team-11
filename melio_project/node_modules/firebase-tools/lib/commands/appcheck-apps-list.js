"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const Table = require("cli-table3");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requireAuth_1 = require("../requireAuth");
const requirePermissions_1 = require("../requirePermissions");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const apps_1 = require("../management/apps");
const api_1 = require("../appcheck/api");
const providers_1 = require("../appcheck/providers");
function appIdFromConfigName(name) {
    return name?.split("/apps/")[1]?.split("/")[0] ?? "";
}
exports.command = new command_1.Command("appcheck:apps:list")
    .description("list apps with their App Check attestation providers")
    .help(`shows every app in the project with the App Check providers that are set up for it.

Use this to see which apps are ready before turning enforcement on with \`appcheck:services:set\`.

App Attest and Play Integrity are left out of the Providers column: they have no key or secret to register, so the API cannot say whether an app really uses them. Use \`appcheck:providers:list --app <appId>\` to see their settings.`)
    .before(requireAuth_1.requireAuth)
    .before(requirePermissions_1.requirePermissions, [
    "firebaseappcheck.appAttestConfig.get",
    "firebaseappcheck.deviceCheckConfig.get",
    "firebaseappcheck.playIntegrityConfig.get",
    "firebaseappcheck.recaptchaEnterpriseConfig.get",
    "firebaseappcheck.recaptchaV3Config.get",
])
    .action(async (options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    const { apps, configsByProvider } = await (0, utils_1.promiseWithSpinner)(async () => {
        const [appList, ...configLists] = await Promise.all([
            (0, apps_1.listFirebaseApps)(projectId, apps_1.AppPlatform.ANY),
            ...providers_1.ATTESTATION_PROVIDERS.map((p) => (0, api_1.batchGetProviderConfigs)(projectNumber, p)),
        ]);
        return {
            apps: appList,
            configsByProvider: new Map(providers_1.ATTESTATION_PROVIDERS.map((p, i) => [p, configLists[i]])),
        };
    }, "Reading apps and App Check providers");
    const rows = apps.map((app) => {
        const providers = (0, providers_1.providersForPlatform)(app.platform).filter((provider) => {
            const config = configsByProvider
                .get(provider)
                ?.find((c) => appIdFromConfigName(c.name) === app.appId);
            return Boolean(config && (0, providers_1.isConfigured)(provider, config));
        });
        return {
            appId: app.appId,
            platform: app.platform,
            displayName: app.displayName ?? "",
            providers,
        };
    });
    if (rows.length === 0) {
        logger_1.logger.info(clc.bold(`No apps found in project ${projectId}.`));
        return rows;
    }
    const table = new Table({
        head: ["App ID", "Platform", "Display Name", "Providers"],
        style: { head: ["green"] },
    });
    for (const row of rows) {
        table.push([
            clc.bold(row.appId),
            row.platform,
            row.displayName,
            row.providers.length ? row.providers.join(", ") : "not configured",
        ]);
    }
    logger_1.logger.info(table.toString());
    return rows;
});
