"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NETWORK_TIMEOUT_MS = exports.REPLACEMENTS_GITHUB_RAW_URL = void 0;
exports.getReplacementsRegistry = getReplacementsRegistry;
exports.getExtensionReplacement = getExtensionReplacement;
exports.getReplacementPackageName = getReplacementPackageName;
exports.getDeprecationWarningMessage = getDeprecationWarningMessage;
const logger_1 = require("../logger");
const replacementsData = require("./replacements.json");
const DECOMMISSION_DATE_STR = "March 31, 2027";
exports.REPLACEMENTS_GITHUB_RAW_URL = "https://raw.githubusercontent.com/firebase/firebase-tools/main/src/extensions/replacements.json";
exports.NETWORK_TIMEOUT_MS = 2000;
async function getReplacementsRegistry() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), exports.NETWORK_TIMEOUT_MS);
    try {
        const res = await fetch(exports.REPLACEMENTS_GITHUB_RAW_URL, { signal: controller.signal });
        if (res.ok) {
            const data = (await res.json());
            if (data?.replacements && typeof data.replacements === "object") {
                return data;
            }
        }
    }
    catch (err) {
        logger_1.logger.debug(`Failed to fetch fresh replacements catalog from GitHub: ${String(err)}`);
    }
    finally {
        clearTimeout(timeoutId);
    }
    return replacementsData;
}
function getExtensionReplacement(extensionRef, registry = replacementsData) {
    if (!extensionRef) {
        return undefined;
    }
    return registry.replacements?.[extensionRef];
}
function getReplacementPackageName(extensionRef, registry = replacementsData) {
    if (!extensionRef) {
        return undefined;
    }
    const entry = registry.replacements?.[extensionRef];
    if (entry?.status === "REPLACEMENT_AVAILABLE" && entry.npmPackage) {
        return entry.npmPackage;
    }
    return undefined;
}
function getDeprecationWarningMessage(extensionRef, registry) {
    const replacement = getExtensionReplacement(extensionRef, registry);
    if (!replacement) {
        return undefined;
    }
    switch (replacement.status) {
        case "REPLACEMENT_AVAILABLE":
            return (`Extension '${extensionRef}' is deprecated and will be decommissioned on ${DECOMMISSION_DATE_STR}.\n` +
                `  Recommended replacement: ${replacement.npmPackage}`);
        case "CONFIRMED_NO_REPLACEMENT":
            return (`Extension '${extensionRef}' is deprecated and will be decommissioned on ${DECOMMISSION_DATE_STR}.\n` +
                `  Note: No npm package replacement is planned for this extension.`);
        case "PENDING_PUBLISHER":
            return (`Extension '${extensionRef}' is deprecated and will be decommissioned on ${DECOMMISSION_DATE_STR}.\n` +
                `  A replacement package has not yet been announced by the publisher.`);
    }
}
