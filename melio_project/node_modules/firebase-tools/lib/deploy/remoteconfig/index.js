"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.deploy = exports.release = exports.prepare = void 0;
const prepare_1 = require("./prepare");
exports.prepare = prepare_1.default;
const release_1 = require("./release");
exports.release = release_1.default;
const deploy_1 = require("./deploy");
exports.deploy = deploy_1.default;
exports.help = "Deploys Remote Config templates defined in your project's firebase.json.";
exports.detailedHelp = "Firebase Remote Config deploys client-facing templates and configurations.\n\n" +
    "Configuration format in firebase.json:\n" +
    "{\n" +
    '  "remoteconfig": {\n' +
    '    "template": "remoteconfig.template.json"\n' +
    "  }\n" +
    "}";
