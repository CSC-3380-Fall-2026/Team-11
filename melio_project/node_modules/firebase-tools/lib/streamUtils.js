"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToStream = stringToStream;
exports.streamToString = streamToString;
const stream_1 = require("stream");
function stringToStream(text) {
    if (!text) {
        return undefined;
    }
    const s = new stream_1.Readable();
    s.push(text);
    s.push(null);
    return s;
}
function streamToString(s) {
    if (!s) {
        return Promise.resolve("");
    }
    return new Promise((resolve, reject) => {
        let b = "";
        s.on("error", reject);
        s.on("data", (d) => {
            b += d.toString();
        });
        s.once("end", () => resolve(b));
    });
}
