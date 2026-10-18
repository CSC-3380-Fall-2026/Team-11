"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.deploy = exports.prepare = void 0;
var prepare_1 = require("./prepare");
Object.defineProperty(exports, "prepare", { enumerable: true, get: function () { return prepare_1.prepare; } });
var deploy_1 = require("./deploy");
Object.defineProperty(exports, "deploy", { enumerable: true, get: function () { return deploy_1.deploy; } });
var release_1 = require("./release");
Object.defineProperty(exports, "release", { enumerable: true, get: function () { return release_1.release; } });
exports.help = "Deploys static web apps to Firebase Hosting, including assets, redirects, rewrites and headers.";
exports.detailedHelp = "Firebase Hosting deploys web assets, redirects, rewrites, and header configurations.\n\n" +
    "Single site configuration in firebase.json:\n" +
    "{\n" +
    '  "hosting": {\n' +
    '    "public": "public",\n' +
    '    "ignore": [\n' +
    '      "firebase.json",\n' +
    '      "**/.*",\n' +
    '      "**/node_modules/**"\n' +
    "    ],\n" +
    '    "rewrites": [\n' +
    '      { "source": "**", "destination": "/index.html" }\n' +
    "    ]\n" +
    "  }\n" +
    "}\n\n" +
    "Multiple sites configuration (by site ID or deploy target):\n" +
    "{\n" +
    '  "hosting": [\n' +
    "    {\n" +
    '      "site": "my-site-id",\n' +
    '      "public": "dist"\n' +
    "    },\n" +
    "    {\n" +
    '      "target": "my-site-target",\n' +
    '      "public": "build"\n' +
    "    }\n" +
    "  ]\n" +
    "}";
