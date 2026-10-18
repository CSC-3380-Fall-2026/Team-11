"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const requirePermissions_1 = require("../requirePermissions");
const projectUtils_1 = require("../projectUtils");
const ailogic = require("../gcp/ailogic");
const clc = require("colorette");
const utils = require("../utils");
const prompt_1 = require("../prompt");
const error_1 = require("../error");
exports.command = new command_1.Command("ailogic:templates:delete <templateId>")
    .description("delete a template")
    .help(`deletes one deployed server prompt template after confirmation (skippable with --force).

<templateId> is the template's id, as shown in \`ailogic:templates:list\`. A locked template cannot be deleted; unlock it first with \`ailogic:templates:unlock\` (--force does not override a lock).

For example:

  \`firebase ailogic:templates:delete my-template --force\``)
    .option("-f, --force", "bypass confirmation prompt")
    .before(requirePermissions_1.requirePermissions, [
    "firebasevertexai.templates.delete",
    "serviceusage.services.get",
])
    .action(async (templateId, options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    ailogic.assertValidTemplateId(templateId);
    await ailogic.ensureAILogicApiEnabled(projectId, options);
    const template = await ailogic.withTemplate404(templateId, () => ailogic.getTemplate(projectId, templateId));
    if (template.locked) {
        throw new error_1.FirebaseError(`The following templates are locked and cannot be deleted:\n\n  ${templateId}\n\nUnlock them by running:\n\n  firebase ailogic:templates:unlock <templateId>`);
    }
    const confirmed = await (0, prompt_1.confirm)({
        message: `Are you sure you want to delete template ${clc.bold(templateId)}?`,
        force: options.force,
        nonInteractive: options.nonInteractive,
    });
    if (!confirmed) {
        throw new error_1.FirebaseError("Command aborted.", { exit: 1 });
    }
    try {
        await ailogic.withTemplate404(templateId, () => ailogic.deleteTemplate(projectId, templateId, template.etag));
    }
    catch (err) {
        if ((0, error_1.getErrStatus)(err) === 409) {
            throw new error_1.FirebaseError(`Template ${clc.bold(templateId)} was modified while awaiting confirmation. Re-run the command to delete its latest version.`);
        }
        throw err;
    }
    utils.logSuccess(`Deleted template: ${clc.bold(templateId)}`);
    return template;
});
