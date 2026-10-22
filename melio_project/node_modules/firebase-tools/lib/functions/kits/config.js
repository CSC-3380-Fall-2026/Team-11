"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listKitConfigs = listKitConfigs;
const projectConfig_1 = require("../projectConfig");
function listKitConfigs(config) {
    const normalized = (0, projectConfig_1.normalizeAndValidate)(config.functions);
    return normalized.filter((s) => (0, projectConfig_1.isKitConfig)(s));
}
