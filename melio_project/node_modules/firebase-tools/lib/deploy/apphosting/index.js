"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.deploy = exports.prepare = void 0;
const prepare_1 = require("./prepare");
exports.prepare = prepare_1.default;
const deploy_1 = require("./deploy");
exports.deploy = deploy_1.default;
const release_1 = require("./release");
exports.release = release_1.default;
exports.help = "Deploys framework-centered web apps. See https://firebase.google.com/docs/app-hosting/frameworks-tooling#web-frameworks-and-app-hosting for a full list of supported frameworks.";
exports.detailedHelp = "App Hosting deploys Frameworks-based web application backends.\n\n" +
    "Single backend configuration in firebase.json:\n" +
    "{\n" +
    '  "apphosting": {\n' +
    '    "backendId": "my-backend-id",\n' +
    '    "rootDir": ".",\n' +
    '    "ignore": ["node_modules", ".git"]\n' +
    "  }\n" +
    "}\n\n" +
    "Multiple backends configuration:\n" +
    "{\n" +
    '  "apphosting": [\n' +
    "    {\n" +
    '      "backendId": "my-backend-1",\n' +
    '      "rootDir": "apps/backend-1",\n' +
    '      "ignore": ["node_modules"]\n' +
    "    },\n" +
    "    {\n" +
    '      "backendId": "my-backend-2",\n' +
    '      "rootDir": "apps/backend-2",\n' +
    '      "ignore": ["node_modules"]\n' +
    "    }\n" +
    "  ]\n" +
    "}";
