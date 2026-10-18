"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const requirePermissions_1 = require("../requirePermissions");
const projectUtils_1 = require("../projectUtils");
const ailogic = require("../gcp/ailogic");
const logger_1 = require("../logger");
const READABLE_CONFIG_PATHS = [
    "providers",
    ...ailogic.PROVIDER_TYPES.map((p) => `providers.${p}`),
    "security",
    ...ailogic.WRITABLE_CONFIG_PATHS.filter((p) => p.startsWith("security.")),
    "monitoring",
    ...ailogic.WRITABLE_CONFIG_PATHS.filter((p) => p.startsWith("monitoring.")),
];
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
exports.command = new command_1.Command("ailogic:config:get [path]")
    .description("read AI Logic configuration")
    .help(`prints the full AI Logic configuration for the active project as JSON. If [path] is given, prints only that section or value.

Valid values for [path]:

${READABLE_CONFIG_PATHS.map((p) => `  ${p}`).join("\n")}

For example, to check whether requests are restricted to authenticated users:

  firebase ailogic:config:get security.auth-only`)
    .before(requirePermissions_1.requirePermissions, ["firebasevertexai.config.get", "serviceusage.services.get"])
    .action(async (path, options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    if (path) {
        ailogic.assertKnownConfigPath(path, READABLE_CONFIG_PATHS);
    }
    if (!(await ailogic.isAILogicApiEnabled(projectId))) {
        logger_1.logger.info("Firebase AI Logic is not enabled on this project.");
        return;
    }
    const config = await ailogic.getConfig(projectId);
    const monitoringState = config.telemetryConfig?.mode === "ALL";
    const sampleRatePercent = config.telemetryConfig?.samplingRate !== undefined
        ? Math.round(config.telemetryConfig.samplingRate * 100)
        : 100;
    const needsProviders = !path || path === "providers" || path.startsWith("providers.");
    const enabledProviders = needsProviders ? await ailogic.listProviders(projectId) : [];
    const configObj = {
        ...(needsProviders && {
            providers: Object.fromEntries(ailogic.PROVIDER_TYPES.map((p) => [p, enabledProviders.includes(p)])),
        }),
        security: {
            "auth-only": config.trafficFilter?.firebaseAuthRequired ?? false,
            "template-only": config.trafficFilter?.templateOnly ?? false,
        },
        monitoring: {
            state: monitoringState,
            "sample-rate-percentage": sampleRatePercent,
        },
    };
    if (!path) {
        logger_1.logger.info(JSON.stringify(configObj, null, 2));
        return configObj;
    }
    let val = configObj;
    for (const part of path.split(".")) {
        if (!isRecord(val)) {
            val = undefined;
            break;
        }
        val = val[part];
    }
    logger_1.logger.info(typeof val === "object" ? JSON.stringify(val, null, 2) : String(val));
    return val;
});
