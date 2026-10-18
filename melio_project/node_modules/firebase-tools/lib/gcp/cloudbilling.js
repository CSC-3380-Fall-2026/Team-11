"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBillingEnabled = isBillingEnabled;
exports.clearCache = clearCache;
exports.checkBillingEnabled = checkBillingEnabled;
exports.setBillingAccount = setBillingAccount;
exports.listBillingAccounts = listBillingAccounts;
exports.enableBilling = enableBilling;
const clc = require("colorette");
const opn = require("open");
const api_1 = require("../api");
const apiv2_1 = require("../apiv2");
const error_1 = require("../error");
const logger_1 = require("../logger");
const prompt = require("../prompt");
const utils = require("../utils");
const ensureApiEnabled_1 = require("../ensureApiEnabled");
const API_VERSION = "v1";
const client = new apiv2_1.Client({ urlPrefix: (0, api_1.cloudbillingOrigin)(), apiVersion: API_VERSION });
async function isBillingEnabled(setup) {
    if (setup.isBillingEnabled !== undefined) {
        return setup.isBillingEnabled;
    }
    if (!setup.projectId) {
        return false;
    }
    setup.isBillingEnabled = await checkBillingEnabled(setup.projectId);
    return setup.isBillingEnabled;
}
const billingEnabledCache = new Map();
function clearCache() {
    billingEnabledCache.clear();
}
function checkBillingEnabled(projectId, forceRefresh = false) {
    if (!forceRefresh) {
        const cached = billingEnabledCache.get(projectId);
        if (cached !== undefined) {
            return cached;
        }
    }
    const promise = (async () => {
        await (0, ensureApiEnabled_1.ensure)(projectId, "cloudbilling.googleapis.com", "billing", true);
        const res = await client.get(utils.endpoint(["projects", projectId, "billingInfo"]), {
            retries: 3,
            retryCodes: [429, 500, 503],
            headers: { "x-goog-user-project": projectId },
        });
        return res.body.billingEnabled;
    })().catch((err) => {
        billingEnabledCache.delete(projectId);
        throw err;
    });
    billingEnabledCache.set(projectId, promise);
    return promise;
}
async function setBillingAccount(projectId, billingAccountName) {
    await (0, ensureApiEnabled_1.ensure)(projectId, "cloudbilling.googleapis.com", "billing", true);
    const res = await client.put(utils.endpoint(["projects", projectId, "billingInfo"]), {
        billingAccountName: billingAccountName,
    }, {
        retryCodes: [429, 500, 503],
        headers: { "x-goog-user-project": projectId },
    });
    const enabled = res.body.billingEnabled;
    billingEnabledCache.set(projectId, Promise.resolve(enabled));
    return enabled;
}
async function listBillingAccounts(projectId) {
    if (projectId) {
        await (0, ensureApiEnabled_1.ensure)(projectId, "cloudbilling.googleapis.com", "billing", true);
    }
    const res = await client.get(utils.endpoint(["billingAccounts"]), {
        retryCodes: [429, 500, 503],
        headers: projectId ? { "x-goog-user-project": projectId } : undefined,
    });
    return res.body.billingAccounts || [];
}
const ADD_BILLING_ACCOUNT = "Add new billing account";
function logBillingStatus(enabled, projectId, featureName) {
    const prefix = featureName === "Extensions" ? "extensions" : featureName.toLowerCase();
    if (!enabled) {
        throw new error_1.FirebaseError(`${prefix}: ${clc.bold(projectId)} could not be upgraded. Please add a billing account via the Firebase console before proceeding.`);
    }
    utils.logLabeledSuccess(prefix, `${clc.bold(projectId)} has successfully been upgraded.`);
}
async function openBillingAccount(projectId, url, open, featureName = "Extensions") {
    if (open) {
        try {
            opn(url);
        }
        catch (err) {
            logger_1.logger.debug("Unable to open billing URL: " + err.stack);
        }
    }
    const target = featureName === "Extensions" ? "your extension" : featureName.toLowerCase();
    await prompt.confirm({
        message: `Press enter when finished upgrading your project to continue setting up ${target}.`,
        default: true,
    });
    return exports.checkBillingEnabled(projectId, true);
}
async function chooseBillingAccount(projectId, accounts, featureName) {
    const choices = accounts.map((m) => m.displayName);
    choices.push(ADD_BILLING_ACCOUNT);
    const verb = featureName === "Extensions" ? "require" : "requires";
    const answer = await prompt.select({
        message: `${featureName} ${verb} your project to be upgraded to the Blaze plan. You have access to the following billing accounts.
Please select the one that you would like to associate with this project:`,
        choices: choices,
    });
    let billingEnabled;
    if (answer === ADD_BILLING_ACCOUNT) {
        const billingURL = `https://console.cloud.google.com/billing/linkedaccount?project=${projectId}`;
        billingEnabled = await openBillingAccount(projectId, billingURL, true, featureName);
    }
    else {
        const billingAccount = accounts.find((a) => a.displayName === answer);
        billingEnabled = await exports.setBillingAccount(projectId, billingAccount.name);
    }
    return logBillingStatus(billingEnabled, projectId, featureName);
}
async function setUpBillingAccount(projectId, featureName) {
    const billingURL = `https://console.cloud.google.com/billing/linkedaccount?project=${projectId}`;
    const verb = featureName === "Extensions" ? "require" : "requires";
    logger_1.logger.info();
    logger_1.logger.info(`${featureName} ${verb} your project to be upgraded to the Blaze plan. Please visit the following link to add a billing account:`);
    logger_1.logger.info();
    logger_1.logger.info(clc.bold(clc.underline(billingURL)));
    logger_1.logger.info();
    const open = await prompt.confirm({
        message: "Press enter to open the URL.",
        default: true,
    });
    const billingEnabled = await openBillingAccount(projectId, billingURL, open, featureName);
    return logBillingStatus(billingEnabled, projectId, featureName);
}
async function enableBilling(projectId, featureName = "Extensions") {
    const billingAccounts = await exports.listBillingAccounts(projectId);
    if (billingAccounts) {
        const accounts = billingAccounts.filter((account) => account.open);
        return accounts.length > 0
            ? chooseBillingAccount(projectId, accounts, featureName)
            : setUpBillingAccount(projectId, featureName);
    }
}
