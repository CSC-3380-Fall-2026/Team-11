"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepare = prepare;
const clc = require("colorette");
const utils = require("../../utils");
const error_1 = require("../../error");
const prompt_1 = require("../../prompt");
const projectUtils_1 = require("../../projectUtils");
const fsutils_1 = require("../../fsutils");
const ailogic = require("../../gcp/ailogic");
const templates = require("../../ailogic/templates");
const VALID_FILTERS = ["templates"];
function filterIncludes(options, subTarget) {
    if (!options.only) {
        return true;
    }
    const filters = options.only
        .split(",")
        .filter((t) => t === "ailogic" || t.startsWith("ailogic:"))
        .map((t) => t.split(":")[1]);
    for (const f of filters) {
        if (f && !VALID_FILTERS.includes(f)) {
            throw new error_1.FirebaseError(`Unknown AI Logic deploy filter ${clc.bold(`ailogic:${f}`)}. Valid filters:\n\n` +
                VALID_FILTERS.map((v) => `  ailogic:${v}`).join("\n"));
        }
    }
    return filters.some((f) => f === undefined || f === subTarget);
}
async function prepare(context, options) {
    if (!filterIncludes(options, "templates")) {
        return;
    }
    const projectId = (0, projectUtils_1.needProjectId)(options);
    const templatesDir = options.config.src.ailogic?.templates ?? templates.DEFAULT_PROMPTS_DIR;
    const dir = options.config.path(templatesDir);
    if (!(0, fsutils_1.dirExistsSync)(dir)) {
        throw new error_1.FirebaseError(`AI Logic templates directory ${clc.bold(templatesDir)} (from firebase.json) does not exist.`);
    }
    const local = templates.readPromptDirectory(dir);
    if (local.errors.length > 0) {
        throw new error_1.FirebaseError(["The following prompt files failed validation:"]
            .concat(local.errors.map((e) => `  ${e.file}: ${e.error}`))
            .join("\n"));
    }
    await ailogic.ensureAILogicApiEnabled(projectId, options);
    const remote = await ailogic.listTemplates(projectId);
    const prune = local.templates.size > 0;
    if (!prune && remote.length > 0) {
        utils.logLabeledWarning("ailogic", `no ${templates.PROMPT_FILE_EXT} files found in ${clc.bold(templatesDir)}; ` +
            `existing remote templates were left untouched.`);
    }
    const plan = templates.planTemplateDeploy(local.templates, remote, prune);
    if (plan.lockedViolations.length > 0) {
        throw new error_1.FirebaseError(`The following templates are locked and cannot be updated or deleted:\n\n` +
            plan.lockedViolations.map((id) => `  ${id}`).join("\n") +
            `\n\nUnlock them by running:\n\n  firebase ailogic:templates:unlock <templateId>\n\nThen deploy again. No templates were deployed.`);
    }
    if (plan.unchanged.length > 0) {
        utils.logLabeledBullet("ailogic", `skipping ${plan.unchanged.length} unchanged template(s): ${plan.unchanged.join(", ")}`);
    }
    if (plan.deletes.length > 0) {
        const confirmed = await (0, prompt_1.confirm)({
            message: `This will delete the following remote templates whose ${templates.PROMPT_FILE_EXT} files were removed:\n\n` +
                plan.deletes.map((id) => `  ${id}`).join("\n") +
                `\n\nAre you sure you want to proceed?`,
            force: options.force,
            nonInteractive: options.nonInteractive,
        });
        if (!confirmed) {
            throw new error_1.FirebaseError("Command aborted.", { exit: 1 });
        }
    }
    context.ailogic = {
        templates: local.templates,
        plan,
        etags: new Map(remote.map((t) => [ailogic.templateIdFromName(t.name), t.etag])),
    };
}
