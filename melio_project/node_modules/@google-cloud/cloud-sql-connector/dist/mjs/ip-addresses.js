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
import { CloudSQLConnectorError } from './errors.js';
export var IpAddressTypes;
(function (IpAddressTypes) {
    IpAddressTypes["PUBLIC"] = "PUBLIC";
    IpAddressTypes["PRIVATE"] = "PRIVATE";
    IpAddressTypes["PSC"] = "PSC";
    IpAddressTypes["SQL_DATA"] = "SQL_DATA";
})(IpAddressTypes || (IpAddressTypes = {}));
const getPublicIpAddress = (ipAddresses) => {
    if (!ipAddresses.public) {
        throw new CloudSQLConnectorError({
            message: 'Cannot connect to instance, public Ip address not found',
            code: 'ENOPUBLICSQLADMINIPADDRESS',
        });
    }
    return ipAddresses.public;
};
const getPrivateIpAddress = (ipAddresses) => {
    if (!ipAddresses.private) {
        throw new CloudSQLConnectorError({
            message: 'Cannot connect to instance, private Ip address not found',
            code: 'ENOPRIVATESQLADMINIPADDRESS',
        });
    }
    return ipAddresses.private;
};
const getPSCIpAddress = (ipAddresses) => {
    if (!ipAddresses.psc) {
        throw new CloudSQLConnectorError({
            message: 'Cannot connect to instance, PSC address not found',
            code: 'ENOPSCSQLADMINIPADDRESS',
        });
    }
    return ipAddresses.psc;
};
export function selectIpAddress(ipAddresses, type) {
    switch (type) {
        case IpAddressTypes.PUBLIC:
            return getPublicIpAddress(ipAddresses);
        case IpAddressTypes.PRIVATE:
            return getPrivateIpAddress(ipAddresses);
        case IpAddressTypes.PSC:
            return getPSCIpAddress(ipAddresses);
        case IpAddressTypes.SQL_DATA:
            if (ipAddresses.private) {
                return getPrivateIpAddress(ipAddresses);
            }
            if (ipAddresses.psc) {
                return getPSCIpAddress(ipAddresses);
            }
            if (ipAddresses.public) {
                return getPublicIpAddress(ipAddresses);
            }
            return '';
        default:
            throw new CloudSQLConnectorError({
                message: 'Cannot connect to instance, it has no supported IP addresses',
                code: 'ENOSQLADMINIPADDRESS',
            });
    }
}
//# sourceMappingURL=ip-addresses.js.map