"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.prepare = void 0;
exports.deploy = deploy;
const prepare_1 = require("./prepare");
Object.defineProperty(exports, "prepare", { enumerable: true, get: function () { return prepare_1.prepare; } });
const release_1 = require("./release");
Object.defineProperty(exports, "release", { enumerable: true, get: function () { return release_1.release; } });
async function deploy() { }
exports.help = "Deploys AI Logic server prompt templates defined in your project's firebase.json.";
exports.detailedHelp = "AI Logic deploys the .prompt files in your prompts directory as server prompt templates: " +
    "new files are created, changed files are updated, unchanged files are skipped, and " +
    "templates whose files were removed are deleted after confirmation.\n\n" +
    "Configuration format in firebase.json:\n" +
    "{\n" +
    '  "ailogic": {\n' +
    '    "templates": "prompts"\n' +
    "  }\n" +
    "}";
