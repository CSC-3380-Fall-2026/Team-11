"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ATTESTATION_PROVIDERS = exports.PROVIDER_META = exports.DEVICE_INTEGRITY_LEVELS = void 0;
exports.providerHelp = providerHelp;
exports.parseProviderType = parseProviderType;
exports.providersForPlatform = providersForPlatform;
exports.assertProviderSupportsPlatform = assertProviderSupportsPlatform;
exports.isConfigured = isConfigured;
exports.formatTokenTtl = formatTokenTtl;
exports.summarizeConfig = summarizeConfig;
exports.buildProviderUpdate = buildProviderUpdate;
const fs = require("fs");
const error_1 = require("../error");
const TTL_MIN_SECONDS = 30 * 60;
const TTL_MAX_SECONDS = 7 * 24 * 60 * 60;
exports.DEVICE_INTEGRITY_LEVELS = {
    none: "NO_INTEGRITY",
    basic: "MEETS_BASIC_INTEGRITY",
    device: "MEETS_DEVICE_INTEGRITY",
    strong: "MEETS_STRONG_INTEGRITY",
};
exports.PROVIDER_META = {
    "app-attest": { configResource: "appAttestConfig", platforms: ["IOS"], label: "App Attest" },
    "device-check": { configResource: "deviceCheckConfig", platforms: ["IOS"], label: "DeviceCheck" },
    "play-integrity": {
        configResource: "playIntegrityConfig",
        platforms: ["ANDROID"],
        label: "Play Integrity",
    },
    "recaptcha-enterprise": {
        configResource: "recaptchaEnterpriseConfig",
        platforms: ["IOS", "ANDROID", "WEB"],
        label: "reCAPTCHA Enterprise",
    },
    "recaptcha-v3": {
        configResource: "recaptchaV3Config",
        platforms: ["WEB"],
        label: "reCAPTCHA v3",
    },
};
exports.ATTESTATION_PROVIDERS = [
    "app-attest",
    "device-check",
    "play-integrity",
    "recaptcha-enterprise",
    "recaptcha-v3",
];
function providerHelp() {
    return exports.ATTESTATION_PROVIDERS.map((p) => `  ${p.padEnd(22)} ${exports.PROVIDER_META[p].label} (${exports.PROVIDER_META[p].platforms.join(", ")})`).join("\n");
}
function parseProviderType(provider) {
    if (provider in exports.PROVIDER_META) {
        return provider;
    }
    throw new error_1.FirebaseError(`Unknown provider: ${provider}\n\nValid providers:\n\n${providerHelp()}`);
}
function providerSupportsPlatform(provider, platform) {
    return exports.PROVIDER_META[provider].platforms.some((p) => p === platform);
}
function providersForPlatform(platform) {
    return exports.ATTESTATION_PROVIDERS.filter((p) => providerSupportsPlatform(p, platform));
}
function assertProviderSupportsPlatform(provider, platform, appId) {
    if (providerSupportsPlatform(provider, platform)) {
        return;
    }
    const supported = providersForPlatform(platform);
    const platformName = platform.charAt(0) + platform.slice(1).toLowerCase();
    throw new error_1.FirebaseError(`${provider} is a ${exports.PROVIDER_META[provider].platforms.join("/")} provider. App ${appId} is a ${platformName} app.\n\n` +
        (supported.length
            ? `Providers for ${platformName} apps: ${supported.join(", ")}.`
            : `No App Check providers are available for ${platformName} apps.`));
}
function isConfigured(provider, config) {
    switch (provider) {
        case "device-check":
            return Boolean(config.privateKeySet ?? config.keyId);
        case "recaptcha-v3":
            return Boolean(config.siteSecretSet);
        case "recaptcha-enterprise":
            return Boolean(config.siteKey);
        default:
            return null;
    }
}
function parseTokenTtl(ttl) {
    const match = /^(\d+)([smhd])$/.exec(ttl.trim());
    if (!match) {
        throw new error_1.FirebaseError(`Invalid --token-ttl: ${ttl}. Use a number followed by s, m, h or d, for example 30m, 2h or 1d.`);
    }
    const value = Number(match[1]);
    const unitSeconds = { s: 1, m: 60, h: 3600, d: 86400 };
    const seconds = value * unitSeconds[match[2]];
    if (seconds < TTL_MIN_SECONDS || seconds > TTL_MAX_SECONDS) {
        throw new error_1.FirebaseError(`Invalid --token-ttl: ${ttl}. Must be between 30 minutes (30m) and 7 days (7d).`);
    }
    return `${seconds}s`;
}
function formatTokenTtl(ttl) {
    if (!ttl) {
        return "default";
    }
    const seconds = Number(ttl.replace(/s$/, ""));
    if (!Number.isFinite(seconds)) {
        return ttl;
    }
    if (seconds % 86400 === 0) {
        return `${seconds / 86400}d`;
    }
    if (seconds % 3600 === 0) {
        return `${seconds / 3600}h`;
    }
    if (seconds % 60 === 0) {
        return `${seconds / 60}m`;
    }
    return `${seconds}s`;
}
function resolveSecretFlag(value) {
    if (!value.startsWith("@")) {
        return value;
    }
    const path = value.slice(1);
    try {
        return fs.readFileSync(path, "utf8").trim();
    }
    catch (err) {
        throw new error_1.FirebaseError(`Could not read ${path}: ${(0, error_1.getErrMsg)(err)}`, {
            original: (0, error_1.getError)(err),
        });
    }
}
function parseMinScore(value) {
    const score = Number(value);
    if (!Number.isFinite(score) || score < 0 || score > 1) {
        throw new error_1.FirebaseError(`--min-score must be a number between 0.0 and 1.0.`);
    }
    return score;
}
function parseDeviceIntegrityLevel(level) {
    const parsed = exports.DEVICE_INTEGRITY_LEVELS[level.toLowerCase()];
    if (!parsed) {
        throw new error_1.FirebaseError(`Invalid --min-device-integrity: ${level}. Must be one of: ${Object.keys(exports.DEVICE_INTEGRITY_LEVELS).join(", ")}.`);
    }
    return parsed;
}
function summarizeConfig(provider, config) {
    switch (provider) {
        case "device-check":
            return config.keyId ? `key id: ${config.keyId}` : "";
        case "recaptcha-enterprise":
            return [
                config.siteKey ? `site key: ${config.siteKey}` : "",
                config.riskAnalysis?.minValidScore !== undefined
                    ? `min score: ${config.riskAnalysis.minValidScore}`
                    : "",
            ]
                .filter(Boolean)
                .join(", ");
        case "recaptcha-v3":
            return config.minValidScore !== undefined ? `min score: ${config.minValidScore}` : "";
        case "play-integrity":
            return [
                config.deviceIntegrity?.minDeviceRecognitionLevel
                    ? `min device: ${config.deviceIntegrity.minDeviceRecognitionLevel}`
                    : "",
                config.accountDetails?.requireLicensed ? "licensed required" : "",
                config.appIntegrity?.allowUnrecognizedVersion ? "unrecognized versions allowed" : "",
            ]
                .filter(Boolean)
                .join(", ");
        default:
            return "";
    }
}
function buildProviderUpdate(provider, options) {
    const update = {};
    const updateMask = [];
    if (options.tokenTtl) {
        update.tokenTtl = parseTokenTtl(options.tokenTtl);
        updateMask.push("tokenTtl");
    }
    switch (provider) {
        case "device-check": {
            if (Boolean(options.keyId) !== Boolean(options.privateKey)) {
                throw new error_1.FirebaseError(`device-check needs both --key-id and --private-key.`);
            }
            if (options.keyId && options.privateKey) {
                update.keyId = options.keyId;
                update.privateKey = resolveSecretFlag(options.privateKey);
                updateMask.push("keyId", "privateKey");
            }
            break;
        }
        case "recaptcha-enterprise": {
            if (options.siteKey) {
                update.siteKey = options.siteKey;
                updateMask.push("siteKey");
            }
            if (options.minScore) {
                update.riskAnalysis = { minValidScore: parseMinScore(options.minScore) };
                updateMask.push("riskAnalysis.minValidScore");
            }
            break;
        }
        case "recaptcha-v3": {
            if (options.siteSecret) {
                update.siteSecret = resolveSecretFlag(options.siteSecret);
                updateMask.push("siteSecret");
            }
            if (options.minScore) {
                update.minValidScore = parseMinScore(options.minScore);
                updateMask.push("minValidScore");
            }
            break;
        }
        case "play-integrity": {
            if (options.minDeviceIntegrity) {
                update.deviceIntegrity = {
                    minDeviceRecognitionLevel: parseDeviceIntegrityLevel(options.minDeviceIntegrity),
                };
                updateMask.push("deviceIntegrity.minDeviceRecognitionLevel");
            }
            if (options.requireLicensed !== undefined) {
                update.accountDetails = { requireLicensed: options.requireLicensed };
                updateMask.push("accountDetails.requireLicensed");
            }
            if (options.allowUnrecognizedVersion !== undefined) {
                update.appIntegrity = { allowUnrecognizedVersion: options.allowUnrecognizedVersion };
                updateMask.push("appIntegrity.allowUnrecognizedVersion");
            }
            break;
        }
        case "app-attest":
            break;
    }
    if (updateMask.length === 0) {
        throw new error_1.FirebaseError(`Nothing to set for ${provider}. Pass at least one setting, for example --token-ttl 1h.`);
    }
    return { update, updateMask };
}
