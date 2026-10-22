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
const PREVIEW_LENGTH = 60;
const ELLIPSIS = "...";
exports.command = new command_1.Command("ailogic:templates:list")
    .description("list deployed templates")
    .help(`lists every deployed server prompt template with its id, display name, lock state, and a preview of its content. Use \`ailogic:templates:get <templateId>\` to print a template in full.`)
    .before(requirePermissions_1.requirePermissions, [
    "firebasevertexai.templates.get",
    "serviceusage.services.get",
])
    .action(async (options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    if (!(await ailogic.isAILogicApiEnabled(projectId))) {
        logger_1.logger.info("Firebase AI Logic is not enabled on this project.");
        return [];
    }
    const templates = await ailogic.listTemplates(projectId);
    if (templates.length === 0) {
        logger_1.logger.info(clc.bold("No deployed templates found."));
        return templates;
    }
    const table = new Table({
        head: ["Template ID", "Display Name", "Locked", "Template Preview"],
        style: { head: ["green"] },
    });
    for (const t of templates) {
        const templateString = t.templateString ?? "";
        const preview = templateString.length > PREVIEW_LENGTH
            ? templateString.substring(0, PREVIEW_LENGTH - ELLIPSIS.length) + ELLIPSIS
            : templateString;
        table.push([
            clc.bold(ailogic.templateIdFromName(t.name)),
            t.displayName || "",
            t.locked ? "Yes" : "No",
            preview.replace(/\r?\n/g, " "),
        ]);
    }
    logger_1.logger.info(table.toString());
    return templates;
});
