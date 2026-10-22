"use strict";
// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlDataClient = void 0;
const net = __importStar(require("node:net"));
const grpc = __importStar(require("@grpc/grpc-js"));
const sql_1 = require("@google-cloud/sql");
const errors_1 = require("./errors");
class SqlDataClient {
    constructor(opts) {
        var _a, _b;
        this.activeSockets = new Set();
        this.instanceConnectionName = opts.instanceConnectionName;
        this.auth = opts.auth;
        this.endpoint = opts.endpoint || 'sqladmin.googleapis.com';
        this.streamTimeout = opts.streamTimeout || 2 * 60 * 60 * 1000; // 2 hours
        this.keepAliveTimeMs = (_a = opts.keepAliveTimeMs) !== null && _a !== void 0 ? _a : 30 * 1000; // 30 seconds
        this.keepAliveTimeoutMs = (_b = opts.keepAliveTimeoutMs) !== null && _b !== void 0 ? _b : 10 * 1000; // 10 seconds
        this.channelCredentials = opts.channelCredentials;
        this.getDirectSocket = opts.getDirectSocket;
        this.onUnsupported = opts.onUnsupported;
        this.onResourceExhausted = opts.onResourceExhausted;
        this.onSuccess = opts.onSuccess;
        const parts = this.instanceConnectionName.split(':');
        if (parts.length !== 3) {
            throw new errors_1.CloudSQLConnectorError({
                message: `Invalid instance connection name: ${this.instanceConnectionName}`,
                code: 'EBADINSTANCECONNECTIONNAME',
            });
        }
        this.projectId = parts[0];
        this.regionId = parts[1];
        this.instanceId = parts[2];
    }
    getClient() {
        if (this.client) {
            return this.client;
        }
        let servicePath = this.endpoint.replace(/^https?:\/\//, '');
        let port = 443;
        if (servicePath.includes(':')) {
            const parts = servicePath.split(':');
            servicePath = parts[0];
            port = parseInt(parts[1], 10);
        }
        const clientOptions = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            auth: this.auth,
            servicePath,
            sslCreds: this.channelCredentials,
            port,
            'grpc.keepalive_time_ms': this.keepAliveTimeMs,
            'grpc.keepalive_timeout_ms': this.keepAliveTimeoutMs,
            'grpc.keepalive_permit_without_calls': 1,
        };
        this.client = new sql_1.v1beta4.SqlDataServiceClient(clientOptions);
        return this.client;
    }
    async start() {
        if (this.port !== undefined) {
            return this.port;
        }
        return new Promise((resolvePromise, rejectPromise) => {
            this.server = net.createServer(async (socket) => {
                try {
                    await this.handleConnection(socket);
                }
                catch (err) {
                    socket.destroy(err);
                }
            });
            this.server.on('error', err => {
                rejectPromise(err);
            });
            this.server.listen(0, '127.0.0.1', () => {
                var _a;
                const addr = (_a = this.server) === null || _a === void 0 ? void 0 : _a.address();
                this.port = addr.port;
                resolvePromise(this.port);
            });
        });
    }
    async close() {
        for (const socket of this.activeSockets) {
            socket.destroy();
        }
        this.activeSockets.clear();
        if (this.client) {
            try {
                await this.client.close();
            }
            catch (_a) {
                // ignore
            }
            this.client = undefined;
        }
        if (this.server) {
            return new Promise(resolvePromise => {
                var _a;
                (_a = this.server) === null || _a === void 0 ? void 0 : _a.close(() => {
                    resolvePromise();
                });
            });
        }
    }
    async handleConnection(socket) {
        this.activeSockets.add(socket);
        socket.once('close', () => {
            this.activeSockets.delete(socket);
        });
        let isFallback = false;
        let isEstablished = false;
        let isClosed = false;
        const clientBuffer = [];
        let directSocket;
        const client = this.getClient();
        const instanceResource = `projects/${this.projectId}/instances/${this.instanceId}`;
        const locationResource = `locations/${this.regionId}`;
        const stream = client.streamSqlData({
            otherArgs: {
                headers: {
                    'x-goog-request-params': `instance_id=${instanceResource}&location_id=${locationResource}`,
                },
                timeout: this.streamTimeout,
            },
        });
        const startSessionMsg = {
            startSession: {
                locationId: locationResource,
                instanceId: instanceResource,
            },
        };
        stream.write(startSessionMsg);
        stream.on('data', (response) => {
            var _a, _b;
            if (isFallback || isClosed) {
                return;
            }
            if (!isEstablished) {
                isEstablished = true;
                clientBuffer.length = 0;
                (_a = this.onSuccess) === null || _a === void 0 ? void 0 : _a.call(this);
            }
            if (response.data && response.data.data) {
                const ok = socket.write(response.data.data);
                if (!ok) {
                    stream.pause();
                }
            }
            if (response.terminateSession) {
                const status = response.terminateSession.status;
                const code = status ? status.code : 'UNKNOWN';
                const msg = status ? status.message : 'Session terminated by server';
                const termErr = new Error(`gRPC Stream terminated by server: Code ${code}, Message: ${msg}`);
                if (status &&
                    (status.code === grpc.status.RESOURCE_EXHAUSTED ||
                        status.code === 'RESOURCE_EXHAUSTED')) {
                    (_b = this.onResourceExhausted) === null || _b === void 0 ? void 0 : _b.call(this, termErr);
                }
                socket.destroy(termErr);
            }
        });
        socket.on('drain', () => {
            if (!isFallback && !isClosed) {
                stream.resume();
            }
        });
        stream.on('drain', () => {
            if (!isFallback && !isClosed) {
                socket.resume();
            }
        });
        stream.on('error', async (err) => {
            var _a, _b;
            if (isFallback || isClosed) {
                return;
            }
            if (err.code === grpc.status.FAILED_PRECONDITION &&
                !isEstablished &&
                this.getDirectSocket) {
                // FAILED_PRECONDITION: Instance does not support SQL_DATA.
                isFallback = true;
                socket.pause();
                (_a = this.onUnsupported) === null || _a === void 0 ? void 0 : _a.call(this);
                try {
                    stream.destroy();
                }
                catch (_c) {
                    // ignore
                }
                try {
                    directSocket = await this.getDirectSocket();
                    while (clientBuffer.length > 0) {
                        const chunk = clientBuffer.shift();
                        if (chunk) {
                            directSocket.write(chunk);
                        }
                    }
                    socket.pipe(directSocket);
                    directSocket.pipe(socket);
                    directSocket.on('error', directErr => {
                        socket.destroy(directErr);
                    });
                    directSocket.on('close', () => {
                        socket.end();
                    });
                    socket.resume();
                }
                catch (directErr) {
                    socket.destroy(directErr);
                }
                return;
            }
            if (err.code === grpc.status.RESOURCE_EXHAUSTED) {
                (_b = this.onResourceExhausted) === null || _b === void 0 ? void 0 : _b.call(this, err);
            }
            socket.destroy(err);
        });
        stream.on('end', () => {
            if (isFallback || isClosed) {
                return;
            }
            socket.end();
        });
        socket.on('data', chunk => {
            if (isFallback) {
                // Handled by pipe(directSocket)
                return;
            }
            if (!isEstablished) {
                clientBuffer.push(chunk);
            }
            const ok = stream.write({
                data: {
                    firstByteOffset: 0,
                    data: chunk,
                },
            });
            if (!ok) {
                socket.pause();
            }
        });
        socket.on('end', () => {
            isClosed = true;
            if (isFallback) {
                // Handled by pipe(directSocket)
                return;
            }
            const terminateSessionMsg = {
                terminateSession: {
                    status: {
                        code: 0,
                        message: 'Client closed connection',
                    },
                },
            };
            stream.write(terminateSessionMsg);
            stream.end();
        });
        socket.on('error', err => {
            isClosed = true;
            if (isFallback) {
                if (directSocket) {
                    directSocket.destroy(err);
                }
            }
            else {
                stream.destroy(err);
            }
        });
    }
}
exports.SqlDataClient = SqlDataClient;
//# sourceMappingURL=sql-data-client.js.map