"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.release = release;
const clc = require("colorette");
const utils = require("../../utils");
const error_1 = require("../../error");
const projectUtils_1 = require("../../projectUtils");
const ailogic = require("../../gcp/ailogic");
async function release(context, options) {
    if (!context.ailogic) {
        return;
    }
    const projectId = (0, projectUtils_1.needProjectId)(options);
    const { templates, plan, etags } = context.ailogic;
    for (const templateId of plan.creates) {
        utils.logLabeledBullet("ailogic", `creating template ${clc.bold(templateId)}...`);
        await ailogic.updateTemplate(projectId, templateId, {
            templateString: templates.get(templateId) ?? "",
            displayName: templateId,
        });
    }
    for (const templateId of plan.updates) {
        utils.logLabeledBullet("ailogic", `updating template ${clc.bold(templateId)}...`);
        const etag = etags.get(templateId);
        try {
            await ailogic.updateTemplate(projectId, templateId, {
                templateString: templates.get(templateId) ?? "",
                ...(etag ? { etag } : {}),
            }, ["templateString"]);
        }
        catch (err) {
            if ((0, error_1.getErrStatus)(err) === 409) {
                throw new error_1.FirebaseError(`Template ${clc.bold(templateId)} was modified while deploying. Re-run the deploy to apply your local files against the latest remote state.`);
            }
            throw err;
        }
    }
    for (const templateId of plan.deletes) {
        utils.logLabeledBullet("ailogic", `deleting template ${clc.bold(templateId)}...`);
        try {
            await ailogic.deleteTemplate(projectId, templateId, etags.get(templateId));
        }
        catch (err) {
            if ((0, error_1.getErrStatus)(err) === 404) {
                utils.logLabeledBullet("ailogic", `template ${clc.bold(templateId)} was already deleted.`);
                continue;
            }
            if ((0, error_1.getErrStatus)(err) === 409) {
                throw new error_1.FirebaseError(`Template ${clc.bold(templateId)} was modified while deploying, so it was not deleted. Re-run the deploy to plan against the latest remote state.`);
            }
            throw err;
        }
    }
    if (plan.creates.length === 0 && plan.updates.length === 0 && plan.deletes.length === 0) {
        utils.logLabeledSuccess("ailogic", "all templates are already up to date.");
    }
    else {
        utils.logLabeledSuccess("ailogic", `templates deployed: ${plan.creates.length} created, ${plan.updates.length} updated, ${plan.deletes.length} deleted.`);
    }
}
