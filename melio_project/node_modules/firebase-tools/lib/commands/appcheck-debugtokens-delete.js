"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const api_1 = require("../appcheck/api");
const appcheck_prompts_1 = require("./appcheck-prompts");
const requireAuth_1 = require("../requireAuth");
const utils_1 = require("../utils");
const prompt_1 = require("../prompt");
const error_1 = require("../error");
exports.command = new command_1.Command("appcheck:debugtokens:delete <debugTokenId>")
    .description("delete a Firebase App Check debug token for an app")
    .option("--app <appId>", "the app id of your Firebase app")
    .option("--force", "attempt to delete debug token without prompting for confirmation")
    .before(requireAuth_1.requireAuth)
    .action(async (debugTokenId, options) => {
    const { appId } = await (0, appcheck_prompts_1.getOrPromptProjectAndAppId)(options, "Select the app to delete a debug token from:");
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    let debugTokenName = debugTokenId;
    if (!debugTokenName.startsWith("projects/")) {
        debugTokenName = `projects/${projectNumber}/apps/${appId}/debugTokens/${debugTokenId}`;
    }
    else {
        const expectedPrefix = `projects/${projectNumber}/apps/${appId}/debugTokens/`;
        if (!debugTokenName.startsWith(expectedPrefix)) {
            throw new error_1.FirebaseError(`Debug token ${debugTokenId} does not belong to app ${appId} in project ${projectNumber}`, { exit: 1 });
        }
    }
    if (!options.force) {
        if (options.nonInteractive) {
            throw new error_1.FirebaseError("Must pass --force to delete in non-interactive mode.", {
                exit: 1,
            });
        }
        const confirmMessage = `You are about to delete App Check debug token ${clc.bold(debugTokenName)}. Do you wish to continue?`;
        const consent = await (0, prompt_1.confirm)({
            message: confirmMessage,
            default: false,
        });
        if (!consent) {
            throw new error_1.FirebaseError("Delete App Check debug token canceled.");
        }
    }
    await (0, utils_1.promiseWithSpinner)(async () => await (0, api_1.deleteDebugToken)(debugTokenName), `Deleting App Check debug token ${clc.bold(debugTokenName)}`);
    (0, utils_1.logSuccess)(`Successfully deleted App Check debug token ${clc.bold(debugTokenName)}`);
});
