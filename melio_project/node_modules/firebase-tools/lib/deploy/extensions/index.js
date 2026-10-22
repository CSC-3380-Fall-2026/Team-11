"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.deploy = exports.prepare = void 0;
var prepare_1 = require("./prepare");
Object.defineProperty(exports, "prepare", { enumerable: true, get: function () { return prepare_1.prepare; } });
var deploy_1 = require("./deploy");
Object.defineProperty(exports, "deploy", { enumerable: true, get: function () { return deploy_1.deploy; } });
var release_1 = require("./release");
Object.defineProperty(exports, "release", { enumerable: true, get: function () { return release_1.release; } });
exports.help = "Deploys configuration changes to your installed Extension instances.";
exports.detailedHelp = "Firebase Extensions deploys settings and configuration environments for installed extension instances.\n\n" +
    "Configuration format in firebase.json:\n" +
    "{\n" +
    '  "extensions": {\n' +
    '    "my-extension-instance-id": "firebase/storage-resize-images@^0.1.0"\n' +
    "  }\n" +
    "}";
