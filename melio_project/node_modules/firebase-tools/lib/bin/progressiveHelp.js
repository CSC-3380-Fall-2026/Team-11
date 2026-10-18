"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProgressiveHelp = setupProgressiveHelp;
const clc = require("colorette");
const logger_1 = require("../logger");
const NAMESPACE_DESCRIPTIONS = {
    appdistribution: "manage App Distribution resources",
    apphosting: "manage App Hosting resources",
    apps: "manage Firebase apps",
    auth: "manage Firebase Auth",
    crashlytics: "manage Crashlytics symbols and mappings",
    database: "manage Realtime Database",
    dataconnect: "manage Data Connect resources",
    emulators: "start and manage local Firebase emulators",
    experiments: "enable and disable CLI experiments",
    ext: "manage Firebase Extensions",
    firestore: "manage Cloud Firestore resources",
    functions: "manage Cloud Functions",
    hosting: "manage Firebase Hosting sites and channels",
    projects: "manage Firebase projects",
    remoteconfig: "manage Remote Config",
    target: "manage deploy targets",
};
function patchHelpInformation(cmd, prefix, program) {
    const originalHelpInformation = cmd.helpInformation;
    cmd.helpInformation = function () {
        const filteredCommands = program.commands.filter((subCmd) => {
            const name = subCmd.name();
            if (prefix === "") {
                return !name.includes(":");
            }
            else {
                if (!name.startsWith(prefix + ":")) {
                    return false;
                }
                const remainder = name.slice(prefix.length + 1);
                return !remainder.includes(":");
            }
        });
        const originalCommands = this.commands;
        this.commands = filteredCommands;
        const result = originalHelpInformation.call(this);
        this.commands = originalCommands;
        return result;
    };
}
function setupProgressiveHelp(client) {
    const program = client.cli;
    const existingNames = new Set(program.commands.map((cmd) => cmd.name()));
    const allNamespaces = new Set();
    for (const cmd of program.commands) {
        const parts = cmd.name().split(":");
        for (let i = 1; i < parts.length; i++) {
            const ns = parts.slice(0, i).join(":");
            allNamespaces.add(ns);
        }
    }
    for (const ns of allNamespaces) {
        if (!existingNames.has(ns)) {
            const description = NAMESPACE_DESCRIPTIONS[ns] || `manage ${ns} resources`;
            const nsCmd = program.command(ns);
            nsCmd.description(description);
            nsCmd.action(() => {
                nsCmd.outputHelp();
            });
            nsCmd.on("--help", () => {
                logger_1.logger.info();
                logger_1.logger.info("To see more about a specific command, run:");
                logger_1.logger.info(`  ${clc.bold("firebase " + ns + ":<command> --help")}`);
            });
        }
    }
    try {
        const { TARGETS, VALID_DEPLOY_TARGETS } = require("../deploy");
        for (const targetName of VALID_DEPLOY_TARGETS) {
            const ns = `deploy:${targetName}`;
            if (!existingNames.has(ns)) {
                const target = TARGETS[targetName];
                const description = target.help || `deploy ${targetName} resources`;
                const nsCmd = program.command(ns);
                nsCmd.description(description);
                nsCmd.action(() => {
                    nsCmd.outputHelp();
                    logger_1.logger.info();
                    logger_1.logger.info(`To deploy ${targetName}, run: ${clc.bold("firebase deploy --only " + targetName)}`);
                    logger_1.logger.info();
                });
                nsCmd.on("--help", () => {
                    logger_1.logger.info();
                    logger_1.logger.info(clc.bold(`Detailed setup and configuration for ${targetName}:`));
                    logger_1.logger.info();
                    if (target && target.detailedHelp) {
                        logger_1.logger.info(target.detailedHelp);
                    }
                    else {
                        logger_1.logger.info(`Configuration for ${clc.bold(targetName)} is defined in your project's ${clc.bold("firebase.json")}.`);
                        logger_1.logger.info(`For more details, see the Firebase documentation:`);
                        logger_1.logger.info(`  https://firebase.google.com/docs/cli#the_firebasejson_file`);
                    }
                    logger_1.logger.info();
                    logger_1.logger.info(clc.bold("General help for firebase deploy:"));
                    logger_1.logger.info();
                    const deployCmd = program.commands.find((c) => c.name() === "deploy");
                    if (deployCmd) {
                        deployCmd.outputHelp();
                    }
                });
            }
        }
    }
    catch (e) {
    }
    const progTyped = program;
    patchHelpInformation(progTyped, "", progTyped);
    for (const cmd of program.commands) {
        const name = cmd.name();
        if (allNamespaces.has(name)) {
            patchHelpInformation(cmd, name, progTyped);
        }
    }
    program.on("--help", () => {
        logger_1.logger.info();
        logger_1.logger.info("To see more about a specific namespace or command, run:");
        logger_1.logger.info(`  ${clc.bold("firebase <namespace|command> --help")}`);
    });
}
