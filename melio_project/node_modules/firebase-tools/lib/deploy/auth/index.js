"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.deploy = exports.prepare = void 0;
var prepare_1 = require("./prepare");
Object.defineProperty(exports, "prepare", { enumerable: true, get: function () { return prepare_1.prepare; } });
var deploy_1 = require("./deploy");
Object.defineProperty(exports, "deploy", { enumerable: true, get: function () { return deploy_1.deploy; } });
var release_1 = require("./release");
Object.defineProperty(exports, "release", { enumerable: true, get: function () { return release_1.release; } });
exports.help = "Deploys configuration settings for Firebase Authentication providers.";
exports.detailedHelp = "Firebase Authentication configures identity providers and sign-in methods.\n\n" +
    "Configuration format in firebase.json:\n" +
    "{\n" +
    '  "auth": {\n' +
    '    "providers": {\n' +
    '      "anonymous": true,\n' +
    '      "emailPassword": true,\n' +
    '      "googleSignIn": {\n' +
    '        "authorizedRedirectUris": [\n' +
    '          "https://my-app.firebaseapp.com/__/auth/handler"\n' +
    "        ],\n" +
    '        "supportEmail": "support@example.com"\n' +
    "      }\n" +
    "    }\n" +
    "  }\n" +
    "}";
