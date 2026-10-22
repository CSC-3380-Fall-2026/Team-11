"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const command_1 = require("../command");
const projectUtils_1 = require("../projectUtils");
const requirePermissions_1 = require("../requirePermissions");
const error_1 = require("../error");
const functions_lifecycle_list_1 = require("./functions-lifecycle-list");
const backend = require("../deploy/functions/backend");
const lifecycle_1 = require("../deploy/functions/release/lifecycle");
exports.command = new command_1.Command("functions:lifecycle:run <hookName> <codebase>")
    .description("run a specific lifecycle hook in isolation")
    .before(requirePermissions_1.requirePermissions, ["cloudfunctions.functions.list", "run.services.list"])
    .action(async (hookName, codebase, options) => {
    if (hookName !== "afterFirstDeploy" && hookName !== "afterRedeploy") {
        throw new error_1.FirebaseError(`Invalid hook name "${hookName}". Supported hooks are "afterFirstDeploy" and "afterRedeploy".`);
    }
    const projectId = (0, projectUtils_1.needProjectId)(options);
    const codebaseBuild = await (0, functions_lifecycle_list_1.loadCodebaseBuild)(codebase, options);
    const hook = codebaseBuild.lifecycleHooks?.[hookName];
    if (!hook) {
        throw new error_1.FirebaseError(`No lifecycle hook "${hookName}" configured for codebase "${codebase}".`);
    }
    const context = {
        projectId,
    };
    const existingBackend = await backend.existingBackend(context);
    await (0, lifecycle_1.executeHook)(hookName, hook, existingBackend);
});
