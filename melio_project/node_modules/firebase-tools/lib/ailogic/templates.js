"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PROMPTS_DIR = exports.PROMPT_FILE_EXT = void 0;
exports.validatePromptFile = validatePromptFile;
exports.readPromptDirectory = readPromptDirectory;
exports.planTemplateDeploy = planTemplateDeploy;
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const error_1 = require("../error");
const fsutils = require("../fsutils");
const ailogic_1 = require("../gcp/ailogic");
exports.PROMPT_FILE_EXT = ".prompt";
exports.DEFAULT_PROMPTS_DIR = "prompts";
const FRONTMATTER_OPEN = /^---[^\S\r\n]*(\r?\n|$)/;
const FRONTMATTER_CLOSE = /(^|\r?\n)---[^\S\r\n]*(\r?\n|$)/;
function validatePromptFile(content) {
    if (!content.trim()) {
        return "File is empty.";
    }
    if (!FRONTMATTER_OPEN.test(content)) {
        return null;
    }
    const rest = content.replace(FRONTMATTER_OPEN, "");
    const close = FRONTMATTER_CLOSE.exec(rest);
    if (!close) {
        return "Frontmatter block is not closed (missing terminating '---').";
    }
    const frontmatter = rest.slice(0, close.index);
    try {
        const parsed = yaml.load(frontmatter);
        if (parsed !== undefined &&
            parsed !== null &&
            (typeof parsed !== "object" || Array.isArray(parsed))) {
            return "Frontmatter must be a YAML mapping.";
        }
    }
    catch (err) {
        return `Invalid YAML in frontmatter: ${(0, error_1.getError)(err).message}`;
    }
    return null;
}
function readPromptDirectory(dir) {
    const templates = new Map();
    const sourceOfId = new Map();
    const errors = [];
    const walk = (rel) => {
        for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
            const file = rel ? `${rel}/${entry.name}` : entry.name;
            const hasPromptExt = entry.name.toLowerCase().endsWith(exports.PROMPT_FILE_EXT);
            if (entry.isDirectory()) {
                if (hasPromptExt) {
                    errors.push({ file, error: "Not a file." });
                }
                else {
                    walk(file);
                }
                continue;
            }
            if (!hasPromptExt) {
                continue;
            }
            const templateId = file.slice(0, -exports.PROMPT_FILE_EXT.length).replace(/\//g, ".");
            if (!ailogic_1.TEMPLATE_ID_REGEX.test(templateId)) {
                errors.push({
                    file,
                    error: "File path does not form a valid template id (letters, digits, '.', '_', and '-' only).",
                });
                continue;
            }
            if (templates.has(templateId)) {
                errors.push({
                    file,
                    error: `Duplicate template id '${templateId}' (also from ${sourceOfId.get(templateId)}).`,
                });
                continue;
            }
            const content = fsutils.readFile(path.join(dir, file));
            const validationError = validatePromptFile(content);
            if (validationError) {
                errors.push({ file, error: validationError });
            }
            else {
                templates.set(templateId, content);
                sourceOfId.set(templateId, file);
            }
        }
    };
    walk("");
    return { templates, errors };
}
function planTemplateDeploy(local, remote, prune) {
    const remoteById = new Map(remote.map((t) => [(0, ailogic_1.templateIdFromName)(t.name), t]));
    const plan = {
        creates: [],
        updates: [],
        unchanged: [],
        deletes: [],
        lockedViolations: [],
    };
    for (const [id, content] of local) {
        const existing = remoteById.get(id);
        if (!existing) {
            plan.creates.push(id);
        }
        else if (existing.templateString === content) {
            plan.unchanged.push(id);
        }
        else if (existing.locked) {
            plan.lockedViolations.push(id);
        }
        else {
            plan.updates.push(id);
        }
    }
    if (prune) {
        for (const [id, remoteTemplate] of remoteById) {
            if (!local.has(id)) {
                (remoteTemplate.locked ? plan.lockedViolations : plan.deletes).push(id);
            }
        }
    }
    return plan;
}
