"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailedHelp = exports.help = exports.release = exports.deploy = exports.prepare = void 0;
const prepare_1 = require("./prepare");
exports.prepare = prepare_1.default;
const deploy_1 = require("./deploy");
exports.deploy = deploy_1.default;
const release_1 = require("./release");
exports.release = release_1.default;
exports.help = "Deploys Data Connect services, schemas, and connectors. Supports filtering:\n" +
    "  --only dataconnect:serviceId\n" +
    "  --only dataconnect:serviceId:connectorId\n" +
    "  --only dataconnect:serviceId:schema";
exports.detailedHelp = "Firebase Data Connect deploys services, GraphQL schemas, and connectors.\n\n" +
    "Single service configuration in firebase.json:\n" +
    "{\n" +
    '  "dataconnect": {\n' +
    '    "source": "dataconnect"\n' +
    "  }\n" +
    "}\n\n" +
    "Multiple services configuration:\n" +
    "{\n" +
    '  "dataconnect": [\n' +
    '    { "source": "dataconnect-service-1" },\n' +
    '    { "source": "dataconnect-service-2" }\n' +
    "  ]\n" +
    "}";
