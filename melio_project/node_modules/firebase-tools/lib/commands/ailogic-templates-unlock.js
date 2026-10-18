"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const requirePermissions_1 = require("../requirePermissions");
const projectUtils_1 = require("../projectUtils");
const ailogic = require("../gcp/ailogic");
const clc = require("colorette");
const utils = require("../utils");
exports.command = new command_1.Command("ailogic:templates:unlock <templateId>")
    .description("unlock a template")
    .help(`unlocks one deployed server prompt template so it can be updated or deleted again.

<templateId> is the template's id, as shown in \`ailogic:templates:list\`.

For example:

  \`firebase ailogic:templates:unlock my-template\``)
    .before(requirePermissions_1.requirePermissions, [
    "firebasevertexai.templates.update",
    "serviceusage.services.get",
])
    .action(async (templateId, options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    ailogic.assertValidTemplateId(templateId);
    await ailogic.ensureAILogicApiEnabled(projectId, options);
    await ailogic.withTemplate404(templateId, () => ailogic.setTemplateLocked(projectId, templateId, false));
    utils.logSuccess(`Unlocked template: ${clc.bold(templateId)}`);
    return { templateId, locked: false };
});
