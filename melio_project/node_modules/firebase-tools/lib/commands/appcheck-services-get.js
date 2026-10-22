"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requireAuth_1 = require("../requireAuth");
const requirePermissions_1 = require("../requirePermissions");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const api_1 = require("../appcheck/api");
const services_1 = require("../appcheck/services");
exports.command = new command_1.Command("appcheck:services:get <service>")
    .description("show App Check enforcement for one service")
    .help(`shows the App Check enforcement settings for one service.

<service> is one of:

${(0, services_1.serviceAliasHelp)()}

App Check also protects some Google services that are not Firebase products, such as the Maps JavaScript API and Google Identity for iOS. Those have no short name; pass their App Check service id if you need them.

For example:

  \`firebase appcheck:services:get firestore\``)
    .before(requireAuth_1.requireAuth)
    .before(requirePermissions_1.requirePermissions, ["firebaseappcheck.services.get"])
    .action(async (service, options) => {
    const serviceId = (0, services_1.resolveServiceId)(service);
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    const result = await (0, api_1.getService)(projectNumber, serviceId);
    logger_1.logger.info(`Service:            ${clc.bold((0, services_1.aliasForServiceId)(serviceId))} (${(0, services_1.displayNameForServiceId)(serviceId)})`);
    logger_1.logger.info(`Enforcement:        ${(0, services_1.formatEnforcementMode)(result.enforcementMode)}`);
    logger_1.logger.info(`Replay protection:  ${(0, services_1.formatEnforcementMode)(result.replayProtection)}`);
    logger_1.logger.info(`Last updated:       ${(0, services_1.formatUpdateTime)(result.updateTime)}`);
    if ((0, services_1.isMandatoryFrom)(serviceId) && result.enforcementMode !== "ENFORCED") {
        (0, utils_1.logWarning)(`Starting ${services_1.AI_LOGIC_ENFORCEMENT_DATE}, Firebase will automatically enforce App Check for all Gemini API requests via Firebase AI Logic, and App Check cannot be un-enforced for AI Logic. Implement App Check before this date to avoid service interruptions: ${services_1.AI_LOGIC_APP_CHECK_DOCS}`);
    }
    return result;
});
