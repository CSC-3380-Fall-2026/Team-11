"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const clc = require("colorette");
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requirePermissions_1 = require("../requirePermissions");
const helper = require("../deploy/functions/functionsDeployHelper");
const utils = require("../utils");
const backend = require("../deploy/functions/backend");
const projectConfig = require("../functions/projectConfig");
const delete_1 = require("../deploy/functions/delete");
const error_1 = require("../error");
exports.command = new command_1.Command("functions:delete [filters...]")
    .description("delete one or more Cloud Functions by name, group name, or codebase.")
    .option("--region <region>", "Specify region of the function to be deleted. " +
    "If omitted, functions from all regions whose names match the filters will be deleted. ")
    .withForce()
    .before(requirePermissions_1.requirePermissions, ["cloudfunctions.functions.list", "cloudfunctions.functions.delete"])
    .action(async (filters, options) => {
    if (!filters.length) {
        return utils.reject("Must supply at least function or group name.");
    }
    const context = {
        projectId: (0, projectUtils_1.needProjectId)(options),
        filters: [],
    };
    let existingBackend = await backend.existingBackend(context);
    await backend.checkAvailability(context, backend.empty());
    if (options.region) {
        existingBackend = backend.matchingBackend(existingBackend, (ep) => ep.region === options.region);
    }
    const activeCodebases = [
        ...new Set(backend
            .allEndpoints(existingBackend)
            .map((ep) => ep.codebase || projectConfig.DEFAULT_CODEBASE)),
    ];
    context.filters = helper.parseDeleteFilters(filters, activeCodebases);
    const allEndpoints = backend.allEndpoints(existingBackend);
    const collisions = helper.detectCodebaseAndIdCollisions(filters, activeCodebases, allEndpoints, projectConfig.DEFAULT_CODEBASE);
    for (const c of collisions) {
        utils.logLabeledBullet("functions", `Target '${clc.bold(c.filter)}' matches both a codebase and a function (${c.functionLabel}). Codebase deletion takes precedence. ` +
            `(To delete the function instead, run: ${clc.bold(c.workaroundCommand)})`);
    }
    const deletionCount = await (0, delete_1.deleteFunctionsByEndpointFilters)(context, options);
    if (deletionCount === 0) {
        throw new error_1.FirebaseError(`The specified filters do not match any existing functions in project ${clc.bold(context.projectId)}.`);
    }
});
