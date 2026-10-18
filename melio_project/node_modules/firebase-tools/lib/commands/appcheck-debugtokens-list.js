"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const Table = require("cli-table3");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const api_1 = require("../appcheck/api");
const appcheck_prompts_1 = require("./appcheck-prompts");
const requireAuth_1 = require("../requireAuth");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
function logDebugTokensList(debugTokens) {
    if (debugTokens.length === 0) {
        logger_1.logger.info(clc.bold("No App Check debug tokens found."));
        return;
    }
    const tableHead = ["Display Name", "Resource Name", "Update Time"];
    const table = new Table({ head: tableHead, style: { head: ["green"] } });
    debugTokens.forEach(({ displayName, name, updateTime }) => {
        table.push([displayName, name, updateTime || "N/A"]);
    });
    logger_1.logger.info(table.toString());
}
exports.command = new command_1.Command("appcheck:debugtokens:list")
    .description("list all Firebase App Check debug tokens for an app")
    .option("--app <appId>", "the app id of your Firebase app")
    .before(requireAuth_1.requireAuth)
    .action(async (options) => {
    const { appId } = await (0, appcheck_prompts_1.getOrPromptProjectAndAppId)(options, "Select the app to list debug tokens for:");
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    const debugTokens = await (0, utils_1.promiseWithSpinner)(async () => await (0, api_1.listDebugTokens)(projectNumber, appId), `Listing App Check debug tokens for app ${clc.bold(appId)}`);
    logDebugTokensList(debugTokens);
    return debugTokens;
});
