"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.deploy = exports.prepare = void 0;
const prepare_1 = require("./prepare");
exports.prepare = prepare_1.default;
const deploy_1 = require("./deploy");
exports.deploy = deploy_1.default;
const release_1 = require("./release");
exports.release = release_1.default;
exports.help = "Deploys security rules for Cloud Storage buckets defined in your project's firebase.json.";
exports.detailedHelp = "Cloud Storage deploys security rules to Storage buckets.\n\n" +
    "Single bucket configuration in firebase.json:\n" +
    "{\n" +
    '  "storage": {\n' +
    '    "rules": "storage.rules"\n' +
    "  }\n" +
    "}\n\n" +
    "Multiple buckets configuration (requires bucket name and rules file):\n" +
    "{\n" +
    '  "storage": [\n' +
    '    { "bucket": "my-app-bucket-1", "rules": "storage-1.rules" },\n' +
    '    { "bucket": "my-app-bucket-2", "rules": "storage-2.rules", "target": "my-storage-target" }\n' +
    "  ]\n" +
    "}";
