"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObjectUploadMultipartRequest = parseObjectUploadMultipartRequest;
exports.parseFormDataMultipartRequest = parseFormDataMultipartRequest;
const LINE_SEPARATOR = `\r\n`;
const LINE_SEPARATOR_BUFFER = Buffer.from(LINE_SEPARATOR);
function splitBufferByDelimiter(buffer, delimiter, maxResults = -1) {
    let offset = 0;
    let nextDelimiterIndex = buffer.indexOf(delimiter, offset);
    const bufferParts = [];
    while (nextDelimiterIndex !== -1) {
        if (maxResults === 0) {
            return bufferParts;
        }
        else if (maxResults === 1) {
            bufferParts.push(Buffer.from(buffer.slice(offset)));
            return bufferParts;
        }
        bufferParts.push(Buffer.from(buffer.slice(offset, nextDelimiterIndex)));
        offset = nextDelimiterIndex + delimiter.length;
        nextDelimiterIndex = buffer.indexOf(delimiter, offset);
        maxResults -= 1;
    }
    bufferParts.push(Buffer.from(buffer.slice(offset)));
    return bufferParts;
}
function splitMultipartIntoParts(boundaryId, body) {
    const cleanBoundaryId = boundaryId.replace(/^["'](.+(?=["']$))["']$/, "$1");
    const boundaryString = `--${cleanBoundaryId}`;
    const bodyParts = splitBufferByDelimiter(body, boundaryString).map((buf) => {
        return Buffer.from(buf.slice(2));
    });
    if (bodyParts.length < 2) {
        return [];
    }
    return bodyParts.slice(1, bodyParts.length - 1);
}
function parseMultipartRequestBody(boundaryId, body) {
    const rawParts = splitMultipartIntoParts(boundaryId, body);
    const parsedParts = [];
    for (const bodyPart of rawParts) {
        parsedParts.push(parseMultipartRequestBodyPart(bodyPart));
    }
    return parsedParts;
}
function parseMultipartRequestBodyPart(bodyPart) {
    const sections = splitBufferByDelimiter(bodyPart, LINE_SEPARATOR, 3);
    const contentTypeRaw = sections[0].toString().toLowerCase();
    if (!contentTypeRaw.startsWith("content-type: ")) {
        throw new Error(`Failed to parse multipart request body part. Missing content type.`);
    }
    const dataRaw = Buffer.from(sections[2]).slice(0, sections[2].byteLength - LINE_SEPARATOR.length);
    return { contentTypeRaw, dataRaw };
}
function parseObjectUploadMultipartRequest(contentTypeHeader, body) {
    if (!contentTypeHeader.startsWith("multipart/related")) {
        throw new Error(`Bad content type. ${contentTypeHeader}`);
    }
    const boundaryId = contentTypeHeader.split("boundary=")[1];
    if (!boundaryId) {
        throw new Error(`Bad content type. ${contentTypeHeader}`);
    }
    const parsedBody = parseMultipartRequestBody(boundaryId, body);
    if (parsedBody.length !== 2) {
        throw new Error(`Unexpected number of parts in request body`);
    }
    return {
        metadataRaw: parsedBody[0].dataRaw.toString(),
        dataRaw: Buffer.from(parsedBody[1].dataRaw),
    };
}
function parseMultipartFormDataBody(boundaryId, body) {
    const rawParts = splitMultipartIntoParts(boundaryId, body);
    const parsedParts = [];
    for (const bodyPart of rawParts) {
        parsedParts.push(parseMultipartFormDataBodyPart(bodyPart));
    }
    return parsedParts;
}
function parseMultipartFormDataBodyPart(part) {
    const doubleCRLF = `${LINE_SEPARATOR}${LINE_SEPARATOR}`;
    const sections = splitBufferByDelimiter(part, doubleCRLF, 2);
    if (sections.length < 2) {
        throw new Error("Failed to parse multipart part: Missing header-body separator.");
    }
    const headerBuffer = sections[0];
    const bodyBuffer = sections[1];
    if (bodyBuffer.byteLength < LINE_SEPARATOR_BUFFER.byteLength ||
        !bodyBuffer
            .slice(bodyBuffer.byteLength - LINE_SEPARATOR_BUFFER.byteLength)
            .equals(LINE_SEPARATOR_BUFFER)) {
        throw new Error("Failed to parse multipart part: Missing trailing line separator.");
    }
    const dataRaw = bodyBuffer.slice(0, bodyBuffer.byteLength - LINE_SEPARATOR_BUFFER.byteLength);
    const headers = headerBuffer.toString().split(LINE_SEPARATOR);
    let name = "";
    let filename;
    let contentType;
    for (const h of headers) {
        const lowerH = h.toLowerCase();
        if (lowerH.startsWith("content-disposition:")) {
            name = extractParam(h, "name") ?? name;
            filename = extractParam(h, "filename") ?? filename;
        }
        else if (lowerH.startsWith("content-type:")) {
            contentType = h.substring("content-type:".length).trim();
        }
    }
    if (!name) {
        throw new Error("Failed to parse multipart form-data. Missing 'name' in Content-Disposition header.");
    }
    if (filename) {
        return {
            type: "file",
            name,
            filename,
            contentType: contentType || "application/octet-stream",
            data: dataRaw,
        };
    }
    else {
        return {
            type: "field",
            name,
            value: dataRaw.toString(),
        };
    }
}
function extractParam(header, param) {
    const match = header.match(new RegExp(`\\b${param}=["']?([^"';]+)["']?`, "i"));
    return match ? match[1] : undefined;
}
function parseFormDataMultipartRequest(contentTypeHeader, body) {
    if (!contentTypeHeader.startsWith("multipart/form-data")) {
        throw new Error(`Bad content type. ${contentTypeHeader}`);
    }
    const boundaryId = contentTypeHeader.split("boundary=")[1]?.split(";")[0]?.trim();
    if (!boundaryId) {
        throw new Error(`Bad content type. ${contentTypeHeader}`);
    }
    return parseMultipartFormDataBody(boundaryId, body);
}
