"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const Table = require("cli-table3");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requireAuth_1 = require("../requireAuth");
const requirePermissions_1 = require("../requirePermissions");
const logger_1 = require("../logger");
const utils_1 = require("../utils");
const api_1 = require("../appcheck/api");
const services_1 = require("../appcheck/services");
exports.command = new command_1.Command("appcheck:services:list")
    .description("list App Check enforcement for each service")
    .help(`shows whether App Check is enforced for each service in the active project.

Enforcement can be:

  Enforced     requests without a valid App Check token are rejected
  Unenforced   requests are allowed, but counted in the App Check metrics
  Off          App Check is not applied

A service that was never configured also reads as off, with "never" in the Updated column.

Use \`appcheck:services:set <service> <mode>\` to change one.`)
    .before(requireAuth_1.requireAuth)
    .before(requirePermissions_1.requirePermissions, ["firebaseappcheck.services.get"])
    .action(async (options) => {
    const projectNumber = await (0, projectUtils_1.needProjectNumber)(options);
    const services = await (0, utils_1.promiseWithSpinner)(() => (0, api_1.listServices)(projectNumber), "Reading App Check services");
    const rows = (0, services_1.buildServiceRows)(services);
    const table = new Table({
        head: ["Service", "Service API", "Enforcement", "Replay Protection", "Updated"],
        style: { head: ["green"] },
    });
    for (const row of rows) {
        table.push([
            clc.bold(row.alias),
            (0, services_1.displayNameForServiceId)(row.serviceId),
            (0, services_1.formatEnforcementMode)(row.enforcementMode ?? undefined),
            (0, services_1.formatEnforcementMode)(row.replayProtection ?? undefined),
            (0, services_1.formatUpdateTime)(row.updateTime ?? undefined),
        ]);
    }
    logger_1.logger.info(table.toString());
    const aiLogic = rows.find((row) => (0, services_1.isMandatoryFrom)(row.serviceId));
    if (aiLogic && aiLogic.enforcementMode !== "ENFORCED") {
        (0, utils_1.logWarning)(`App Check is not enforced for ${aiLogic.alias}. Starting ${services_1.AI_LOGIC_ENFORCEMENT_DATE}, Firebase will automatically enforce App Check for all Gemini API requests via Firebase AI Logic. Requests without a valid App Check token will be rejected. Implement App Check before this date to avoid service interruptions: ${services_1.AI_LOGIC_APP_CHECK_DOCS}`);
    }
    return rows;
});
