"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requireAuth_1 = require("../requireAuth");
const requirePermissions_1 = require("../requirePermissions");
const logger_1 = require("../logger");
const api_1 = require("../appcheck/api");
const providers_1 = require("../appcheck/providers");
const appcheck_prompts_1 = require("./appcheck-prompts");
function detailLines(provider, config) {
    switch (provider) {
        case "device-check":
            return [
                `Key id:        ${config.keyId ?? "not set"}`,
                `Private key:   ${config.privateKeySet ? "set" : "not set"}`,
            ];
        case "recaptcha-enterprise":
            return [
                `Site key:      ${config.siteKey ?? "not set"}`,
                `Min score:     ${config.riskAnalysis?.minValidScore ?? "default"}`,
            ];
        case "recaptcha-v3":
            return [
                `Site secret:   ${config.siteSecretSet ? "set" : "not set"}`,
                `Min score:     ${config.minValidScore ?? "default"}`,
            ];
        case "play-integrity":
            return [
                `Min device:    ${config.deviceIntegrity?.minDeviceRecognitionLevel ?? "default"}`,
                `Licensed:      ${config.accountDetails?.requireLicensed ? "required" : "not required"}`,
                `Unrecognized:  ${config.appIntegrity?.allowUnrecognizedVersion ? "allowed" : "not allowed"}`,
            ];
        default:
            return [];
    }
}
exports.command = new command_1.Command("appcheck:providers:get <provider>")
    .description("show one App Check attestation provider for an app")
    .help(`shows the App Check settings for one attestation provider on one app.

<provider> is one of:

${(0, providers_1.providerHelp)()}

For example:

  \`firebase appcheck:providers:get recaptcha-enterprise --app 1:1234567890:web:abc123\``)
    .option("--app <appId>", "the app id of your Firebase app")
    .before(requireAuth_1.requireAuth)
    .before(requirePermissions_1.requirePermissions, [
    "firebaseappcheck.appAttestConfig.get",
    "firebaseappcheck.deviceCheckConfig.get",
    "firebaseappcheck.playIntegrityConfig.get",
    "firebaseappcheck.recaptchaEnterpriseConfig.get",
    "firebaseappcheck.recaptchaV3Config.get",
])
    .action(async (provider, options) => {
    const providerType = (0, providers_1.parseProviderType)(provider);
    const { appId, platform } = await (0, appcheck_prompts_1.getOrPromptApp)(options, `Select the app to read ${providerType} settings for:`);
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    (0, providers_1.assertProviderSupportsPlatform)(providerType, platform, appId);
    const config = await (0, api_1.getProviderConfig)(projectNumber, appId, providerType);
    logger_1.logger.info(`Provider:      ${clc.bold(providerType)}`);
    logger_1.logger.info(`App:           ${appId} (${platform})`);
    for (const line of detailLines(providerType, config)) {
        logger_1.logger.info(line);
    }
    logger_1.logger.info(`Token TTL:     ${(0, providers_1.formatTokenTtl)(config.tokenTtl)}`);
    return { ...config, provider: providerType, configured: (0, providers_1.isConfigured)(providerType, config) };
});
