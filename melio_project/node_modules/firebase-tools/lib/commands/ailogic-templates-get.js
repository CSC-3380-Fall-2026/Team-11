"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const requirePermissions_1 = require("../requirePermissions");
const projectUtils_1 = require("../projectUtils");
const ailogic = require("../gcp/ailogic");
const templates_1 = require("../ailogic/templates");
const logger_1 = require("../logger");
exports.command = new command_1.Command("ailogic:templates:get <templateId>")
    .description("print one template")
    .help(`prints the full content of one deployed server prompt template.

<templateId> is the template's id, as shown in the first column of \`ailogic:templates:list\` (for templates deployed from files, the file path without the ${templates_1.PROMPT_FILE_EXT} extension, with '/' as '.').

For example:

  \`firebase ailogic:templates:get my-template\``)
    .before(requirePermissions_1.requirePermissions, [
    "firebasevertexai.templates.get",
    "serviceusage.services.get",
])
    .action(async (templateId, options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    ailogic.assertValidTemplateId(templateId);
    if (!(await ailogic.isAILogicApiEnabled(projectId))) {
        logger_1.logger.info("Firebase AI Logic is not enabled on this project.");
        return;
    }
    const template = await ailogic.withTemplate404(templateId, () => ailogic.getTemplate(projectId, templateId));
    logger_1.logger.info(template.templateString);
    return template;
});
