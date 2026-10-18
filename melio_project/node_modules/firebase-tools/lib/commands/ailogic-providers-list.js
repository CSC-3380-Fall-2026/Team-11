"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const requirePermissions_1 = require("../requirePermissions");
const projectUtils_1 = require("../projectUtils");
const ailogic = require("../gcp/ailogic");
const clc = require("colorette");
const logger_1 = require("../logger");
const Table = require("cli-table3");
exports.command = new command_1.Command("ailogic:providers:list")
    .description("list which Gemini API providers are enabled")
    .before(requirePermissions_1.requirePermissions, ["serviceusage.services.get"])
    .action(async (options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    const enabledProviders = await ailogic.listProviders(projectId);
    if (enabledProviders.length === 0) {
        logger_1.logger.info(clc.bold("No Gemini API providers are enabled."));
        return enabledProviders;
    }
    const tableHead = ["Provider", "Status"];
    const table = new Table({ head: tableHead, style: { head: ["green"] } });
    for (const provider of ailogic.PROVIDER_TYPES) {
        const isEnabled = enabledProviders.includes(provider);
        table.push([clc.bold(provider), isEnabled ? clc.green("Enabled") : clc.red("Disabled")]);
    }
    logger_1.logger.info(table.toString());
    return enabledProviders;
});
