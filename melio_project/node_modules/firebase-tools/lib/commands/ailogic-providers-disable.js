"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const requirePermissions_1 = require("../requirePermissions");
const projectUtils_1 = require("../projectUtils");
const ailogic = require("../gcp/ailogic");
const clc = require("colorette");
const logger_1 = require("../logger");
const error_1 = require("../error");
const prompt_1 = require("../prompt");
exports.command = new command_1.Command("ailogic:providers:disable <providerType>")
    .description("disable a Gemini API provider service")
    .help(`disables the Google Cloud API that backs a Gemini API provider. Running apps that use the provider will no longer be able to invoke it.

Valid values for <providerType>:

  gemini-developer-api       the Gemini Developer API
  gemini-agent-platform-api  the Gemini API on the Agent Platform

For example:

  firebase ailogic:providers:disable gemini-developer-api`)
    .option("-f, --force", "bypass confirmation prompt")
    .before(requirePermissions_1.requirePermissions, ["serviceusage.services.disable", "firebasevertexai.config.update"])
    .action(async (providerType, options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    const provider = ailogic.parseProviderType(providerType);
    const confirmed = await (0, prompt_1.confirm)({
        message: `You are about to disable ${clc.bold(provider)}. This will stop running apps from invoking it. Are you sure?`,
        force: options.force,
        nonInteractive: options.nonInteractive,
    });
    if (!confirmed) {
        throw new error_1.FirebaseError("Command aborted.", { exit: 1 });
    }
    await ailogic.disableProvider(projectId, provider);
    logger_1.logger.info(clc.green(`Successfully disabled provider: ${clc.bold(provider)}`));
});
