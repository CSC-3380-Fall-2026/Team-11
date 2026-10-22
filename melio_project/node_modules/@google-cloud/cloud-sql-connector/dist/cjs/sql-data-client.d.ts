import * as net from 'node:net';
import * as grpc from '@grpc/grpc-js';
import { AuthClient, GoogleAuth } from 'google-auth-library';
export interface SqlDataClientOptions {
    instanceConnectionName: string;
    auth: GoogleAuth<AuthClient>;
    endpoint?: string;
    streamTimeout?: number;
    keepAliveTimeMs?: number;
    keepAliveTimeoutMs?: number;
    channelCredentials?: grpc.ChannelCredentials;
    getDirectSocket?: () => Promise<net.Socket> | net.Socket;
    onUnsupported?: () => void;
    onResourceExhausted?: (err: Error) => void;
    onSuccess?: () => void;
}
export declare class SqlDataClient {
    private readonly instanceConnectionName;
    private readonly auth;
    private readonly endpoint;
    private readonly streamTimeout;
    private readonly keepAliveTimeMs;
    private readonly keepAliveTimeoutMs;
    private readonly projectId;
    private readonly regionId;
    private readonly instanceId;
    private readonly channelCredentials?;
    private readonly getDirectSocket?;
    private readonly onUnsupported?;
    private readonly onResourceExhausted?;
    private readonly onSuccess?;
    private readonly activeSockets;
    private server?;
    private client?;
    private port?;
    constructor(opts: SqlDataClientOptions);
    private getClient;
    start(): Promise<number>;
    close(): Promise<void>;
    private handleConnection;
}
//# sourceMappingURL=sql-data-client.d.ts.map