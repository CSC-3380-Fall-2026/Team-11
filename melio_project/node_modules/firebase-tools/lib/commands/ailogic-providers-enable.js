"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const requirePermissions_1 = require("../requirePermissions");
const projectUtils_1 = require("../projectUtils");
const ailogic = require("../gcp/ailogic");
const clc = require("colorette");
const logger_1 = require("../logger");
exports.command = new command_1.Command("ailogic:providers:enable <providerType>")
    .description("enable a Gemini API provider service")
    .help(`enables the Google Cloud APIs that back a Gemini API provider, along with the Firebase AI Logic API.

Valid values for <providerType>:

  gemini-developer-api       the Gemini Developer API
  gemini-agent-platform-api  the Gemini API on the Agent Platform; requires the Blaze (pay-as-you-go) plan

For example:

  firebase ailogic:providers:enable gemini-developer-api`)
    .before(requirePermissions_1.requirePermissions, ["serviceusage.services.enable", "firebasevertexai.config.update"])
    .action(async (providerType, options) => {
    const projectId = (0, projectUtils_1.needProjectId)(options);
    const provider = ailogic.parseProviderType(providerType);
    await ailogic.enableProvider(projectId, provider);
    logger_1.logger.info(clc.green(`Successfully enabled provider: ${clc.bold(provider)}`));
});
