"use strict";
// Copyright 2023 Google LLC
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSTANCE_DNS_NAME_PATTERN = void 0;
exports.parseInstanceDNSName = parseInstanceDNSName;
exports.isSameInstance = isSameInstance;
exports.resolveInstanceName = resolveInstanceName;
exports.isValidDomainName = isValidDomainName;
exports.isInstanceDNSName = isInstanceDNSName;
exports.isInstanceConnectionName = isInstanceConnectionName;
exports.resolveDomainName = resolveDomainName;
exports.parseInstanceConnectionName = parseInstanceConnectionName;
const errors_1 = require("./errors");
const dns_lookup_1 = require("./dns-lookup");
exports.INSTANCE_DNS_NAME_PATTERN = /^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])\.(sql|sql-psa|sql-psc)\.goog\.?$/;
function parseInstanceDNSName(dnsName) {
    const name = dnsName.toLowerCase();
    const match = name.match(exports.INSTANCE_DNS_NAME_PATTERN);
    if (!match) {
        return {
            instanceLabel: '',
            projectLabel: '',
            region: '',
            suffix: '',
            ok: false,
        };
    }
    const instanceLabel = match[1];
    const projectLabel = match[2];
    const region = match[3];
    const suffix = match[4] + '.goog';
    if (region === 'global') {
        return {
            instanceLabel: '',
            projectLabel: '',
            region: '',
            suffix: '',
            ok: false,
        };
    }
    return { instanceLabel, projectLabel, region, suffix, ok: true };
}
function isSameInstance(a, b) {
    return (a.instanceId === b.instanceId &&
        a.regionId === b.regionId &&
        a.projectId === b.projectId &&
        a.domainName === b.domainName);
}
async function resolveInstanceName(instanceConnectionName, domainName, fetcher) {
    let resolvedDomain = domainName;
    if (!resolvedDomain &&
        instanceConnectionName &&
        isValidDomainName(instanceConnectionName)) {
        resolvedDomain = instanceConnectionName;
    }
    if (!instanceConnectionName && !resolvedDomain) {
        throw new errors_1.CloudSQLConnectorError({
            message: 'Missing instance connection name, expected: "PROJECT:REGION:INSTANCE" or a valid domain name.',
            code: 'ENOCONNECTIONNAME',
        });
    }
    else if (instanceConnectionName &&
        isInstanceConnectionName(instanceConnectionName)) {
        return parseInstanceConnectionName(instanceConnectionName);
    }
    else if (resolvedDomain && isValidDomainName(resolvedDomain)) {
        return await resolveDomainName(resolvedDomain, fetcher);
    }
    else {
        throw new errors_1.CloudSQLConnectorError({
            message: 'Malformed Instance connection name, expected an instance connection name in the form "PROJECT:REGION:INSTANCE" or a valid domain name',
            code: 'EBADCONNECTIONNAME',
        });
    }
}
const connectionNameRegex = /^(?<projectId>[^:]+(:[^:]+)?):(?<regionId>[^:]+):(?<instanceId>[^:]+)$/;
// The domain name pattern in accordance with RFC 1035, RFC 1123 and RFC 2181.
// From Go Connector:
const domainNameRegex = /^(?:[_a-z0-9](?:[_a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?)?$/;
function isValidDomainName(name) {
    const matches = String(name).match(domainNameRegex);
    return Boolean(matches);
}
function isInstanceDNSName(name) {
    const lower = name.toLowerCase();
    const match = lower.match(exports.INSTANCE_DNS_NAME_PATTERN);
    if (!match) {
        return false;
    }
    const region = match[3];
    return region !== 'global';
}
function isInstanceConnectionName(name) {
    const matches = String(name).match(connectionNameRegex);
    return Boolean(matches);
}
async function resolveDomainName(name, fetcher) {
    let current = name;
    let txtErr;
    for (let depth = 0; depth < 10; depth++) {
        const dnsInfo = parseInstanceDNSName(current);
        if (dnsInfo.ok) {
            if (!fetcher) {
                throw new errors_1.CloudSQLConnectorError({
                    message: 'DNS resolver SQL Admin API client is not initialized',
                    code: 'EDNSRESOLVERNOTINITIALIZED',
                });
            }
            const resolvedName = await fetcher.resolveConnectSettings(dnsInfo.region, current);
            const info = parseInstanceConnectionName(resolvedName);
            info.domainName = name;
            return info;
        }
        try {
            const records = await (0, dns_lookup_1.resolveTxtRecord)(current);
            for (const record of records) {
                if (isInstanceConnectionName(record)) {
                    const info = parseInstanceConnectionName(record);
                    info.domainName = name;
                    return info;
                }
            }
            txtErr = new errors_1.CloudSQLConnectorError({
                message: `No valid TXT records found for ${current}`,
                code: 'ENOPPSCVALIDTXT',
            });
        }
        catch (e) {
            txtErr = e;
        }
        try {
            let cnameVal = await (0, dns_lookup_1.resolveCnameRecord)(current);
            if (cnameVal.endsWith('.')) {
                cnameVal = cnameVal.slice(0, -1);
            }
            if (cnameVal === current) {
                throw new Error('CNAME record loop detected or record not found');
            }
            if (!isValidDomainName(cnameVal)) {
                throw new Error(`Invalid format for CNAME record: ${cnameVal}`);
            }
            current = cnameVal;
        }
        catch (cnameErr) {
            throw new errors_1.CloudSQLConnectorError({
                message: `No DNS record found for ${name}, lookup of ${current}. Lookup TXT error: ${txtErr === null || txtErr === void 0 ? void 0 : txtErr.message} Lookup CNAME error: ${cnameErr.message}`,
                code: 'EDOMAINNAMELOOKUPFAILED',
                errors: [txtErr, cnameErr],
            });
        }
    }
    throw new errors_1.CloudSQLConnectorError({
        message: `CNAME lookup limit exceeded (max 10) for ${name}`,
        code: 'ECNAMELOOPLIMITEXCEEDED',
    });
}
function parseInstanceConnectionName(instanceConnectionName) {
    if (!instanceConnectionName) {
        throw new errors_1.CloudSQLConnectorError({
            message: 'Missing instance connection name, expected: "PROJECT:REGION:INSTANCE"',
            code: 'ENOCONNECTIONNAME',
        });
    }
    const matches = String(instanceConnectionName).match(connectionNameRegex);
    if (!matches || !matches.groups) {
        throw new errors_1.CloudSQLConnectorError({
            message: 'Malformed instance connection name provided: expected format ' +
                `of "PROJECT:REGION:INSTANCE", got ${instanceConnectionName}`,
            code: 'EBADCONNECTIONNAME',
        });
    }
    return {
        projectId: matches.groups.projectId,
        regionId: matches.groups.regionId,
        instanceId: matches.groups.instanceId,
        domainName: undefined,
    };
}
//# sourceMappingURL=parse-instance-connection-name.js.map