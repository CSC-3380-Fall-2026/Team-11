"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartVersionFeatures = void 0;
const fs = require("fs");
const path = require("path");
const MIN_DART_SDK_VERSION = "3.9.0";
const MIN_DART_SDK_VERSION_NATIVE_ASSETS = "3.13.0";
class DartVersionFeatures {
    constructor(languageVersion) {
        this.languageVersion = languageVersion;
    }
    static async detect(sourceDir) {
        return new DartVersionFeatures(await readRootLanguageVersion(sourceDir));
    }
    get isNativeAssetsAvailable() {
        return this.atLeast(3, 13);
    }
    get minDartSdkVersion() {
        return this.isNativeAssetsAvailable ? MIN_DART_SDK_VERSION_NATIVE_ASSETS : MIN_DART_SDK_VERSION;
    }
    atLeast(major, minor) {
        if (!this.languageVersion) {
            return false;
        }
        const [actualMajor, actualMinor] = this.languageVersion;
        return actualMajor > major || (actualMajor === major && actualMinor >= minor);
    }
}
exports.DartVersionFeatures = DartVersionFeatures;
async function readRootLanguageVersion(sourceDir) {
    const packageConfigPath = path.join(sourceDir, ".dart_tool", "package_config.json");
    let raw;
    try {
        raw = await fs.promises.readFile(packageConfigPath, "utf8");
    }
    catch {
        return undefined;
    }
    try {
        const parsed = JSON.parse(raw);
        const root = parsed?.packages?.find((p) => p.rootUri === "../");
        const match = root?.languageVersion ? /^(\d+)\.(\d+)$/.exec(root.languageVersion) : null;
        if (!match) {
            return undefined;
        }
        return [Number(match[1]), Number(match[2])];
    }
    catch {
        return undefined;
    }
}
