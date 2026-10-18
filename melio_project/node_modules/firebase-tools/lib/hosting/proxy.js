"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyRequestHandler = proxyRequestHandler;
exports.errorRequestHandler = errorRequestHandler;
const lodash_1 = require("lodash");
const stream_1 = require("stream");
const url_1 = require("url");
const apiv2_1 = require("../apiv2");
const error_1 = require("../error");
const logger_1 = require("../logger");
const REQUIRED_VARY_VALUES = ["Accept-Encoding", "Authorization", "Cookie"];
function makeVary(vary = "") {
    if (!vary) {
        return "Accept-Encoding, Authorization, Cookie";
    }
    const varies = vary.split(/, ?/).map((v) => {
        return v
            .split("-")
            .map((part) => (0, lodash_1.capitalize)(part))
            .join("-");
    });
    REQUIRED_VARY_VALUES.forEach((requiredVary) => {
        if (!(0, lodash_1.includes)(varies, requiredVary)) {
            varies.push(requiredVary);
        }
    });
    return varies.join(", ");
}
function proxyRequestHandler(url, rewriteIdentifier, options = {}) {
    return async (req, res, next) => {
        logger_1.logger.info(`[hosting] Rewriting ${req.url} to ${url} for ${rewriteIdentifier}`);
        const cookie = req.headers.cookie || "";
        const sessionCookie = cookie.split(/; ?/).find((c) => {
            return c.trim().startsWith("__session=");
        });
        const u = new url_1.URL(url + req.url);
        const c = new apiv2_1.Client({ urlPrefix: u.origin, auth: false });
        let body;
        let passThrough;
        if (req.method && !["GET", "HEAD"].includes(req.method)) {
            const rawBody = req.rawBody;
            if (rawBody !== undefined) {
                body = rawBody;
            }
            else {
                passThrough = new stream_1.PassThrough();
                req.pipe(passThrough);
                body = passThrough;
            }
        }
        const headers = new Headers({
            "X-Forwarded-Host": req.headers.host || "",
            "X-Original-Url": req.url || "",
            Pragma: "no-cache",
            "Cache-Control": "no-cache, no-store",
            Cookie: sessionCookie || "",
        });
        const headersToSkip = new Set(["host"]);
        if (Buffer.isBuffer(body)) {
            headersToSkip.add("content-length");
            headersToSkip.add("transfer-encoding");
        }
        for (const key of Object.keys(req.headers)) {
            if (headersToSkip.has(key)) {
                continue;
            }
            const value = req.headers[key];
            if (value === undefined) {
                headers.delete(key);
            }
            else if (Array.isArray(value)) {
                headers.delete(key);
                for (const v of value) {
                    headers.append(key, v);
                }
            }
            else {
                headers.set(key, value);
            }
        }
        let proxyRes;
        try {
            proxyRes = await c.request({
                method: (req.method || "GET"),
                path: u.pathname,
                queryParams: u.searchParams,
                headers,
                resolveOnHTTPError: true,
                responseType: "stream",
                redirect: "manual",
                body,
                timeout: 60000,
                compress: false,
            });
        }
        catch (err) {
            logger_1.logger.error("[PROXY ERROR]", err);
            const isAbortError = err instanceof error_1.FirebaseError && err.original?.name.includes("AbortError");
            const isTimeoutError = err instanceof error_1.FirebaseError &&
                (err.original?.code === "ETIMEDOUT" ||
                    err.original?.cause?.code === "ETIMEDOUT");
            const isSocketTimeoutError = err instanceof error_1.FirebaseError &&
                (err.original?.code === "ESOCKETTIMEDOUT" ||
                    err.original?.cause?.code === "ESOCKETTIMEDOUT");
            if (isAbortError || isTimeoutError || isSocketTimeoutError) {
                res.statusCode = 504;
                return res.end("Timed out waiting for function to respond.\n");
            }
            res.statusCode = 500;
            return res.end(`An internal error occurred while proxying for ${rewriteIdentifier}\n`);
        }
        finally {
            if (passThrough) {
                passThrough.resume();
            }
        }
        const resHeaders = {};
        for (const [key, value] of proxyRes.response.headers.entries()) {
            resHeaders[key.toLowerCase()] = value;
        }
        if (proxyRes.status === 404) {
            const cascade = resHeaders["x-cascade"];
            if (options.forceCascade ||
                (typeof cascade === "string" && cascade.toUpperCase() === "PASS")) {
                return next();
            }
        }
        if (!resHeaders["cache-control"]) {
            resHeaders["cache-control"] = "private";
        }
        const cc = resHeaders["cache-control"];
        if (typeof cc === "string" && !cc.includes("private")) {
            delete resHeaders["set-cookie"];
        }
        const vary = resHeaders["vary"];
        resHeaders["vary"] = makeVary(typeof vary === "string" ? vary : null);
        const location = resHeaders["location"];
        if (typeof location === "string" && location) {
            try {
                const locationURL = new url_1.URL(location);
                if (locationURL.origin === u.origin) {
                    const unborkedLocation = location.replace(locationURL.origin, "");
                    resHeaders["location"] = unborkedLocation;
                }
            }
            catch (e) {
                logger_1.logger.debug(`[hosting] had trouble parsing location header, but this may be okay: "${location}"`);
            }
        }
        for (const key of Object.keys(resHeaders)) {
            const value = resHeaders[key];
            if (key === "set-cookie") {
                if (typeof proxyRes.response.headers.getSetCookie === "function") {
                    res.setHeader(key, proxyRes.response.headers.getSetCookie());
                }
                else {
                    res.setHeader(key, value);
                }
            }
            else {
                res.setHeader(key, value);
            }
        }
        res.statusCode = proxyRes.status;
        proxyRes.body.pipe(res);
    };
}
function errorRequestHandler(error) {
    return (req, res) => {
        res.statusCode = 500;
        const out = `A problem occurred while trying to handle a proxied rewrite: ${error}`;
        logger_1.logger.error(out);
        res.end(out);
    };
}
