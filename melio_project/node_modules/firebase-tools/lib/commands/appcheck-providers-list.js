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
const api_1 = require("../appcheck/api");
const providers_1 = require("../appcheck/providers");
const appcheck_prompts_1 = require("./appcheck-prompts");
function formatConfigured(configured) {
    if (configured === null) {
        return "n/a";
    }
    return configured ? "Yes" : "No";
}
exports.command = new command_1.Command("appcheck:providers:list")
    .description("list App Check attestation providers for an app")
    .help(`shows how one app can prove it is real, and which providers are set up.

Only the providers that work on the app's platform are shown:

${(0, providers_1.providerHelp)()}

App Attest and Play Integrity have no key or secret to register, so the API cannot say whether an app really uses them. Those show as "n/a" in the Configured column.

reCAPTCHA now works on iOS and Android as well as web, through the reCAPTCHA attestation provider added to the mobile SDKs in June 2026. It uses the same reCAPTCHA Enterprise settings as the web provider, so configure it with \`recaptcha-enterprise\`. That provider is in public preview on mobile.`)
    .option("--app <appId>", "the app id of your Firebase app")
    .before(requireAuth_1.requireAuth)
    .before(requirePermissions_1.requirePermissions, [
    "firebaseappcheck.appAttestConfig.get",
    "firebaseappcheck.deviceCheckConfig.get",
    "firebaseappcheck.playIntegrityConfig.get",
    "firebaseappcheck.recaptchaEnterpriseConfig.get",
    "firebaseappcheck.recaptchaV3Config.get",
])
    .action(async (options) => {
    const { appId, platform } = await (0, appcheck_prompts_1.getOrPromptApp)(options, "Select the app to list App Check providers for:");
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    const providers = (0, providers_1.providersForPlatform)(platform);
    const configs = await (0, utils_1.promiseWithSpinner)(() => Promise.all(providers.map((p) => (0, api_1.getProviderConfig)(projectNumber, appId, p))), `Reading App Check providers for app ${clc.bold(appId)}`);
    const rows = providers.map((provider, i) => ({
        provider,
        configured: (0, providers_1.isConfigured)(provider, configs[i]),
        tokenTtl: (0, providers_1.formatTokenTtl)(configs[i].tokenTtl),
        settings: (0, providers_1.summarizeConfig)(provider, configs[i]),
    }));
    logger_1.logger.info(`App: ${clc.bold(appId)} (${platform})`);
    const table = new Table({
        head: ["Provider", "Configured", "Token TTL", "Settings"],
        style: { head: ["green"] },
    });
    for (const row of rows) {
        table.push([
            clc.bold(row.provider),
            formatConfigured(row.configured),
            row.tokenTtl,
            row.settings,
        ]);
    }
    logger_1.logger.info(table.toString());
    return rows;
});
