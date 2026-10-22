"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const requireConfig_1 = require("../requireConfig");
const command_1 = require("../command");
const config_1 = require("../functions/kits/config");
const utils_1 = require("../utils");
const logger_1 = require("../logger");
const Table = require("cli-table3");
exports.command = new command_1.Command("functions:kits:list")
    .description("list all the kits that are installed in your firebase.json")
    .before(requireConfig_1.requireConfig)
    .action((options) => {
    const firebaseConfig = options.config;
    const validatedConfig = firebaseConfig.src;
    const kitConfigs = (0, config_1.listKitConfigs)(validatedConfig);
    if (kitConfigs.length < 1) {
        (0, utils_1.logLabeledBullet)("functions", `there are no kits in firebase.json`);
        return;
    }
    const table = new Table({ head: ["Kit", "Instances"], style: { head: ["yellow"] } });
    for (const kitConfig of kitConfigs) {
        const instanceIds = Object.keys(kitConfig.instances);
        table.push([kitConfig.kit, instanceIds.join(", ")]);
    }
    logger_1.logger.info(table.toString());
});
