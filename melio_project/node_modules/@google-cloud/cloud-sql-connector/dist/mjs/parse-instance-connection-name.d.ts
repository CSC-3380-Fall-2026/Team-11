import { InstanceConnectionInfo } from './instance-connection-info.js';
export declare const INSTANCE_DNS_NAME_PATTERN: RegExp;
export interface DNSFetcher {
    resolveConnectSettings(region: string, dnsName: string): Promise<string>;
}
export declare function parseInstanceDNSName(dnsName: string): {
    instanceLabel: string;
    projectLabel: string;
    region: string;
    suffix: string;
    ok: boolean;
};
export declare function isSameInstance(a: InstanceConnectionInfo, b: InstanceConnectionInfo): boolean;
export declare function resolveInstanceName(instanceConnectionName?: string, domainName?: string, fetcher?: DNSFetcher): Promise<InstanceConnectionInfo>;
export declare function isValidDomainName(name: string): boolean;
export declare function isInstanceDNSName(name: string): boolean;
export declare function isInstanceConnectionName(name: string): boolean;
export declare function resolveDomainName(name: string, fetcher?: DNSFetcher): Promise<InstanceConnectionInfo>;
export declare function parseInstanceConnectionName(instanceConnectionName: string | undefined): InstanceConnectionInfo;
//# sourceMappingURL=parse-instance-connection-name.d.ts.map