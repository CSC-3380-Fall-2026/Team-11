import { Socket } from 'node:net';
import { AuthClient, GoogleAuth } from 'google-auth-library';
import { IpAddressTypes } from './ip-addresses';
import { AuthTypes } from './auth-types';
export declare interface UnixSocketOptions {
    path: string | undefined;
    readableAll?: boolean | undefined;
    writableAll?: boolean | undefined;
}
export declare function cooldownBackoff(base: number, attempt: number): number;
export declare interface ConnectionOptions {
    authType?: AuthTypes;
    ipType?: IpAddressTypes;
    instanceConnectionName?: string;
    domainName?: string;
    failoverPeriod?: number;
    limitRateInterval?: number;
    sqlDataEndpoint?: string;
    sqlDataStreamTimeout?: number;
    sqlDataKeepAliveTimeMs?: number;
    sqlDataKeepAliveTimeoutMs?: number;
    resourceExhaustedCooldownPeriod?: number;
}
export declare interface SocketConnectionOptions extends ConnectionOptions {
    listenOptions: UnixSocketOptions;
}
interface StreamFunction {
    (): Socket;
}
interface PromisedStreamFunction {
    (): Promise<Socket>;
}
export declare interface DriverOptions {
    stream: StreamFunction;
}
export declare interface TediousDriverOptions {
    connector: PromisedStreamFunction;
    encrypt: boolean;
}
export interface SqlDataState {
    allowed: boolean;
    cooldownUntil: number;
    lastErr?: Error;
    backoffCounter: number;
}
export interface ConnectorOptions {
    auth?: GoogleAuth<AuthClient> | AuthClient;
    sqlAdminAPIEndpoint?: string;
    /**
     * The Trusted Partner Cloud (TPC) Domain DNS of the service used to make requests.
     * Defaults to `googleapis.com`.
     */
    universeDomain?: string;
    userAgent?: string;
    sqlDataEndpoint?: string;
    sqlDataStreamTimeout?: number;
    sqlDataKeepAliveTimeMs?: number;
    sqlDataKeepAliveTimeoutMs?: number;
    resourceExhaustedCooldownPeriod?: number;
}
export declare class Connector {
    private readonly instances;
    private readonly sqlAdminFetcher;
    private readonly localProxies;
    private readonly sockets;
    private readonly sqlDataEndpoint?;
    private readonly sqlDataStreamTimeout?;
    private readonly sqlDataKeepAliveTimeMs?;
    private readonly sqlDataKeepAliveTimeoutMs?;
    private readonly resourceExhaustedCooldownPeriod;
    private readonly sqlDataTunnels;
    private readonly sqlDataStates;
    private readonly sqlDataFallbackIpTypes;
    constructor(opts?: ConnectorOptions);
    private getSqlDataState;
    getOptions(opts: ConnectionOptions): Promise<DriverOptions>;
    private getFallbackIpType;
    private createDirectSocket;
    private developerEditionOptions;
    getTediousOptions({ authType, ipType, instanceConnectionName, }: ConnectionOptions): Promise<TediousDriverOptions>;
    startLocalProxy({ authType, ipType, instanceConnectionName, listenOptions, }: SocketConnectionOptions): Promise<void>;
    close(): void;
}
export {};
//# sourceMappingURL=connector.d.ts.map