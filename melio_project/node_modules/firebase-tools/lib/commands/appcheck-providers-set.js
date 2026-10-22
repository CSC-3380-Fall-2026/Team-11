"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requireAuth_1 = require("../requireAuth");
const requirePermissions_1 = require("../requirePermissions");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const api_1 = require("../appcheck/api");
const providers_1 = require("../appcheck/providers");
const appcheck_prompts_1 = require("./appcheck-prompts");
exports.command = new command_1.Command("appcheck:providers:set <provider>")
    .description("configure an App Check attestation provider for an app")
    .help(`configures one attestation provider for one app.

<provider> is one of:

${(0, providers_1.providerHelp)()}

Flags per provider:

  all                    --token-ttl <30m|1h|1d, between 30m and 7d>
  device-check           --key-id <id> --private-key <value or @file>
  recaptcha-enterprise   --site-key <key> --min-score <0.0-1.0>
  recaptcha-v3           --site-secret <value or @file> --min-score <0.0-1.0>
  play-integrity         --min-device-integrity <${Object.keys(providers_1.DEVICE_INTEGRITY_LEVELS).join("|")}>
                         --[no-]require-licensed --[no-]allow-unrecognized-version
  app-attest             only --token-ttl

Secrets accept @path to read a file, so a private key does not end up in your shell history.

On iOS and Android, use \`recaptcha-enterprise\` for the reCAPTCHA attestation provider that the mobile SDKs added in June 2026 (Apple 12.15.0, Android firebase-appcheck-recaptcha 19.0.0). It is in public preview there and uses the same site key settings as the web provider.

This command changes how a token is checked, it does not turn enforcement on. Use \`appcheck:services:set\` for that.

For example:

  \`firebase appcheck:providers:set device-check --app 1:123:ios:abc --key-id ABCD1234EF --private-key @AuthKey.p8\``)
    .option("--app <appId>", "the app id of your Firebase app")
    .option("--token-ttl <duration>", "how long App Check tokens stay valid, e.g. 30m, 1h, 1d")
    .option("--key-id <keyId>", "device-check: the Apple key identifier")
    .option("--private-key <value>", "device-check: the .p8 contents, or @path to the file")
    .option("--site-key <siteKey>", "recaptcha-enterprise: the reCAPTCHA Enterprise site key")
    .option("--site-secret <value>", "recaptcha-v3: the site secret, or @path to a file")
    .option("--min-score <score>", "recaptcha: minimum score to accept, 0.0 to 1.0")
    .option("--min-device-integrity <level>", `play-integrity: minimum device level (${Object.keys(providers_1.DEVICE_INTEGRITY_LEVELS).join(", ")})`)
    .option("--require-licensed", "play-integrity: require the LICENSED account verdict")
    .option("--no-require-licensed", "play-integrity: stop requiring the LICENSED verdict")
    .option("--allow-unrecognized-version", "play-integrity: allow unrecognized app versions")
    .option("--no-allow-unrecognized-version", "play-integrity: reject unrecognized app versions")
    .before(requireAuth_1.requireAuth)
    .before(requirePermissions_1.requirePermissions, [
    "firebaseappcheck.appAttestConfig.update",
    "firebaseappcheck.deviceCheckConfig.update",
    "firebaseappcheck.playIntegrityConfig.update",
    "firebaseappcheck.recaptchaEnterpriseConfig.update",
    "firebaseappcheck.recaptchaV3Config.update",
])
    .action(async (provider, options) => {
    const providerType = (0, providers_1.parseProviderType)(provider);
    const { update, updateMask } = (0, providers_1.buildProviderUpdate)(providerType, options);
    const { appId, platform } = await (0, appcheck_prompts_1.getOrPromptApp)(options, `Select the app to configure ${providerType} for:`);
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    (0, providers_1.assertProviderSupportsPlatform)(providerType, platform, appId);
    const result = await (0, api_1.updateProviderConfig)(projectNumber, appId, providerType, update, updateMask);
    (0, utils_1.logSuccess)(`Updated ${clc.bold(providerType)} for app ${clc.bold(appId)}.`);
    if (result.keyId) {
        logger_1.logger.info(`   Key id:      ${result.keyId}`);
    }
    if (result.privateKeySet) {
        logger_1.logger.info(`   Private key: set`);
    }
    if (result.siteKey) {
        logger_1.logger.info(`   Site key:    ${result.siteKey}`);
    }
    if (result.siteSecretSet) {
        logger_1.logger.info(`   Site secret: set`);
    }
    const minScore = result.riskAnalysis?.minValidScore ?? result.minValidScore;
    if (minScore !== undefined) {
        logger_1.logger.info(`   Min score:   ${minScore}`);
    }
    if (result.deviceIntegrity?.minDeviceRecognitionLevel) {
        logger_1.logger.info(`   Min device:  ${result.deviceIntegrity.minDeviceRecognitionLevel}`);
    }
    if (providerType === "play-integrity") {
        const licensed = result.accountDetails?.requireLicensed ?? false;
        const unrecognized = result.appIntegrity?.allowUnrecognizedVersion ?? false;
        logger_1.logger.info(`   Licensed:    ${licensed ? "required" : "not required"}`);
        logger_1.logger.info(`   Unrecognized versions: ${unrecognized ? "allowed" : "not allowed"}`);
    }
    logger_1.logger.info(`   Token TTL:   ${(0, providers_1.formatTokenTtl)(result.tokenTtl)}`);
    return result;
});
