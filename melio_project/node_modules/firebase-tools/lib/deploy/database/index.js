"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.deploy = exports.prepare = void 0;
var prepare_1 = require("./prepare");
Object.defineProperty(exports, "prepare", { enumerable: true, get: function () { return prepare_1.prepare; } });
var deploy_1 = require("./deploy");
Object.defineProperty(exports, "deploy", { enumerable: true, get: function () { return deploy_1.deploy; } });
var release_1 = require("./release");
Object.defineProperty(exports, "release", { enumerable: true, get: function () { return release_1.release; } });
exports.help = "Deploys security rules referenced by your project's firebase.json.";
exports.detailedHelp = "Realtime Database deploys rules to database instances.\n\n" +
    "Single database configuration in firebase.json:\n" +
    "{\n" +
    '  "database": {\n' +
    '    "rules": "database.rules"\n' +
    "  }\n" +
    "}\n\n" +
    "Multiple database instances configuration (by target or database ID):\n" +
    "{\n" +
    '  "database": [\n' +
    '    { "target": "my-db-target", "rules": "rules.rules" },\n' +
    '    { "database": "my-database-id", "rules": "rules2.rules" }\n' +
    "  ]\n" +
    "}";
