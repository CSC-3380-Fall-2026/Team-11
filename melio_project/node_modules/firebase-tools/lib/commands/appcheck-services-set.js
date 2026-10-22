"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requireAuth_1 = require("../requireAuth");
const requirePermissions_1 = require("../requirePermissions");
const prompt_1 = require("../prompt");
const error_1 = require("../error");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const api_1 = require("../appcheck/api");
const services_1 = require("../appcheck/services");
exports.command = new command_1.Command("appcheck:services:set <service> <mode>")
    .description("set App Check enforcement for one service")
    .help(`sets the App Check enforcement mode for one service.

<service> is one of:

${(0, services_1.serviceAliasHelp)()}

<mode> is one of:

  off          App Check is not applied
  unenforced   requests are allowed, but counted in the App Check metrics
  enforced     requests without a valid App Check token are rejected

For most services the usual rollout is unenforced first, then check the metrics in the console, then enforced.

Firebase AI Logic works differently. It is enforced by default and enforcement becomes mandatory, so there is no monitoring phase: keep it enforced, use a debug token while you develop (\`appcheck:debugtokens:create\`), and register a real attestation provider before you ship (\`appcheck:providers:set\`).

--replay-protection sets the replay protection level, which cannot be stronger than <mode>. Not every service supports it.

For example:

  \`firebase appcheck:services:set firestore unenforced\`
  \`firebase appcheck:services:set firestore enforced\``)
    .option("--replay-protection <mode>", "replay protection level: off, unenforced, or enforced. Cannot be stronger than <mode>, and not every service supports it")
    .option("-f, --force", "bypass confirmation prompt")
    .before(requireAuth_1.requireAuth)
    .before(requirePermissions_1.requirePermissions, ["firebaseappcheck.services.get", "firebaseappcheck.services.update"])
    .action(async (service, mode, options) => {
    const serviceId = (0, services_1.resolveServiceId)(service);
    const alias = (0, services_1.aliasForServiceId)(serviceId);
    const enforcementMode = (0, services_1.parseEnforcementMode)(mode);
    const replayProtection = options.replayProtection
        ? (0, services_1.parseEnforcementMode)(options.replayProtection)
        : undefined;
    if (replayProtection) {
        (0, services_1.assertReplayProtectionAllowed)(enforcementMode, replayProtection);
    }
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    const current = await (0, api_1.getService)(projectNumber, serviceId);
    const question = (0, services_1.confirmationForModeChange)(serviceId, alias, current.enforcementMode, enforcementMode);
    if (question) {
        const confirmed = await (0, prompt_1.confirm)({
            message: question,
            force: options.force,
            nonInteractive: options.nonInteractive,
        });
        if (!confirmed) {
            throw new error_1.FirebaseError("Command aborted.", { exit: 1 });
        }
    }
    let result;
    try {
        result = await (0, api_1.updateService)(projectNumber, serviceId, {
            enforcementMode,
            replayProtection,
        });
    }
    catch (err) {
        if (replayProtection && (0, error_1.getErrStatus)(err) === 400) {
            throw new error_1.FirebaseError(`The API rejected replay protection for ${clc.bold(alias)}. Not every service supports it.\n\nRun the command again without --replay-protection to set enforcement on its own.`, { original: err instanceof Error ? err : undefined });
        }
        throw err;
    }
    const replayText = replayProtection
        ? `, replay protection ${replayProtection.toLowerCase()}`
        : "";
    (0, utils_1.logSuccess)(`App Check for ${clc.bold(alias)} is now ${enforcementMode.toLowerCase()}${replayText}.`);
    if (enforcementMode === "UNENFORCED") {
        logger_1.logger.info(`Requests without a valid token are allowed and counted in the metrics.`);
    }
    if ((0, services_1.isMandatoryFrom)(serviceId) && enforcementMode !== "ENFORCED") {
        (0, utils_1.logWarning)(`Starting ${services_1.AI_LOGIC_ENFORCEMENT_DATE}, Firebase will automatically enforce App Check for all Gemini API requests via Firebase AI Logic, and App Check cannot be un-enforced for AI Logic. Implement App Check before this date to avoid service interruptions: ${services_1.AI_LOGIC_APP_CHECK_DOCS}`);
    }
    return result;
});
