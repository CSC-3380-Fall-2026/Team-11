"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_LOGIC_APP_CHECK_DOCS = exports.AI_LOGIC_ENFORCEMENT_DATE = exports.SERVICE_ALIAS_TO_ID = void 0;
exports.displayNameForServiceId = displayNameForServiceId;
exports.isMandatoryFrom = isMandatoryFrom;
exports.serviceAliasHelp = serviceAliasHelp;
exports.resolveServiceId = resolveServiceId;
exports.aliasForServiceId = aliasForServiceId;
exports.isAutoEnforcedService = isAutoEnforcedService;
exports.parseEnforcementMode = parseEnforcementMode;
exports.assertReplayProtectionAllowed = assertReplayProtectionAllowed;
exports.formatEnforcementMode = formatEnforcementMode;
exports.formatUpdateTime = formatUpdateTime;
exports.buildServiceRows = buildServiceRows;
exports.confirmationForModeChange = confirmationForModeChange;
const error_1 = require("../error");
exports.SERVICE_ALIAS_TO_ID = {
    auth: "identitytoolkit.googleapis.com",
    firestore: "firestore.googleapis.com",
    database: "firebasedatabase.googleapis.com",
    storage: "firebasestorage.googleapis.com",
    ailogic: "firebaseml.googleapis.com",
    dataconnect: "firebasedataconnect.googleapis.com",
};
const SERVICE_ID_TO_ALIAS = Object.fromEntries(Object.entries(exports.SERVICE_ALIAS_TO_ID).map(([alias, id]) => [id, alias]));
const SERVICE_DISPLAY_NAMES = {
    "identitytoolkit.googleapis.com": "Firebase Authentication",
    "firestore.googleapis.com": "Cloud Firestore",
    "firebasedatabase.googleapis.com": "Firebase Realtime Database",
    "firebasestorage.googleapis.com": "Cloud Storage for Firebase",
    "firebaseml.googleapis.com": "Firebase AI Logic",
    "firebasedataconnect.googleapis.com": "Firebase SQL Connect",
    "maps-backend.googleapis.com": "Maps JavaScript API",
    "places.googleapis.com": "Places API (New)",
    "oauth2.googleapis.com": "Google Identity for iOS",
};
function displayNameForServiceId(serviceId) {
    return SERVICE_DISPLAY_NAMES[serviceId] ?? serviceId;
}
const OTHER_SUPPORTED_SERVICE_IDS = new Set([
    "maps-backend.googleapis.com",
    "places.googleapis.com",
    "oauth2.googleapis.com",
]);
const AUTO_ENFORCED_SERVICE_IDS = new Set(["firebaseml.googleapis.com"]);
exports.AI_LOGIC_ENFORCEMENT_DATE = "November 2, 2026";
exports.AI_LOGIC_APP_CHECK_DOCS = "https://firebase.google.com/docs/ai-logic/app-check";
function isMandatoryFrom(serviceId) {
    return serviceId === "firebaseml.googleapis.com";
}
const ENFORCEMENT_MODES = ["OFF", "UNENFORCED", "ENFORCED"];
const MODE_RANK = { OFF: 0, UNENFORCED: 1, ENFORCED: 2 };
function serviceAliasHelp() {
    return Object.entries(exports.SERVICE_ALIAS_TO_ID)
        .map(([alias, id]) => `  ${alias.padEnd(13)} ${displayNameForServiceId(id)}`)
        .join("\n");
}
function resolveServiceId(service) {
    const id = exports.SERVICE_ALIAS_TO_ID[service];
    if (id) {
        return id;
    }
    if (SERVICE_ID_TO_ALIAS[service] || OTHER_SUPPORTED_SERVICE_IDS.has(service)) {
        return service;
    }
    throw new error_1.FirebaseError(`Unknown service: ${service}\n\nValid services:\n\n${serviceAliasHelp()}`);
}
function aliasForServiceId(serviceId) {
    return SERVICE_ID_TO_ALIAS[serviceId] ?? serviceId;
}
function isAutoEnforcedService(serviceId) {
    return AUTO_ENFORCED_SERVICE_IDS.has(serviceId);
}
function parseEnforcementMode(mode) {
    const upper = mode.toUpperCase();
    const found = ENFORCEMENT_MODES.find((m) => m === upper);
    if (!found) {
        throw new error_1.FirebaseError(`Unknown mode: ${mode}. Must be one of: ${ENFORCEMENT_MODES.map((m) => m.toLowerCase()).join(", ")}.`);
    }
    return found;
}
function assertReplayProtectionAllowed(enforcement, replayProtection) {
    if (MODE_RANK[replayProtection] > MODE_RANK[enforcement]) {
        throw new error_1.FirebaseError(`Replay protection cannot be stronger than enforcement. Set enforcement to ${replayProtection.toLowerCase()} first, or lower the replay protection level.`);
    }
}
function formatEnforcementMode(mode) {
    if (!mode) {
        return "Off";
    }
    return mode.charAt(0) + mode.slice(1).toLowerCase();
}
function formatUpdateTime(updateTime) {
    if (!updateTime || updateTime.startsWith("1970-01-01")) {
        return "never";
    }
    return updateTime;
}
function buildServiceRows(services) {
    const configured = new Map(services.map((s) => [s.name.split("/").pop() ?? "", s]));
    const ids = new Set([...Object.values(exports.SERVICE_ALIAS_TO_ID), ...configured.keys()]);
    return [...ids]
        .map((serviceId) => {
        const service = configured.get(serviceId);
        return {
            alias: aliasForServiceId(serviceId),
            serviceId,
            enforcementMode: service?.enforcementMode ?? null,
            replayProtection: service?.replayProtection ?? null,
            updateTime: service?.updateTime ?? null,
        };
    })
        .sort((a, b) => a.alias.localeCompare(b.alias));
}
function confirmationForModeChange(serviceId, alias, current, next) {
    if (next === current) {
        return null;
    }
    if (isAutoEnforcedService(serviceId)) {
        if (next === "ENFORCED") {
            return null;
        }
        return (`${alias} is enforced by default to help protect your project resources and mitigate ` +
            `Gemini API abuse. Turning enforcement ${next.toLowerCase()} leaves it open to abuse.\n\n` +
            `Starting ${exports.AI_LOGIC_ENFORCEMENT_DATE}, Firebase will automatically enforce App Check for ` +
            `all Gemini API requests via Firebase AI Logic, and App Check cannot be un-enforced for AI ` +
            `Logic. Requests to AI Logic without a valid App Check token will be rejected, and users ` +
            `running versions of your app that do not have App Check implemented will experience ` +
            `service disruption.\n\n` +
            `Continue?`);
    }
    return next === "ENFORCED"
        ? `Enforcing App Check for ${alias} will reject requests from clients that do not send a valid App Check token. Clients on old app versions may stop working. Continue?`
        : null;
}
