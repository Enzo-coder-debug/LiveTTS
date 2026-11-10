import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const release = process.argv.includes("--release");
const errors = [];
const warnings = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) errors.push(message);
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function localized(value, label) {
  check(value && typeof value.en === "string" && value.en.trim() && typeof value.zh === "string" && value.zh.trim(), `${label} needs English and Chinese text`);
}

function publicUrl(value, label, allowMail = false) {
  if (!value) return;
  try {
    const url = new URL(value);
    check(url.protocol === "https:" || (allowMail && url.protocol === "mailto:"), `${label} must use HTTPS${allowMail ? " or mailto" : ""}`);
    check(!url.username && !url.password, `${label} must not embed credentials`);
    check(!/(^|\.)joyspace\.jd\.com$/i.test(url.hostname), `${label} must not expose internal document links`);
    check(!/[?&](token|key|api_key|signature|x-amz-signature)=/i.test(value), `${label} contains a potentially sensitive or expiring query parameter`);
  } catch {
    check(false, `${label} is not a valid public URL`);
  }
}

function mediaPath(value, label) {
  check(typeof value === "string", `${label} source must be a string`);
  if (!value || typeof value !== "string") return;
  if (/^https:/i.test(value)) {
    publicUrl(value, label);
    return;
  }
  check(!/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith("/"), `${label} must be a relative asset or public HTTPS URL`);
  const resolved = path.resolve(root, value);
  const audioRoot = path.join(root, "assets", "audio") + path.sep;
  check(resolved.startsWith(audioRoot), `${label} must remain within assets/audio`);
  check(fs.existsSync(resolved) && fs.statSync(resolved).isFile(), `${label} file does not exist: ${value}`);
  check(/\.(wav|mp3|ogg|m4a|flac)$/i.test(value), `${label} has an unsupported audio extension`);
}

const context = vm.createContext({ window: {} });
try {
  vm.runInContext(read("site.config.js"), context, { timeout: 1000 });
  vm.runInContext(read("data.js"), context, { timeout: 1000 });
} catch (error) {
  console.error(`Configuration could not be read: ${error.message}`);
  process.exit(1);
}

const config = context.window.LIVETTS_SITE;
const data = context.window.LIVETTS_DATA;
check(config && data && Array.isArray(data.categories) && Array.isArray(data.samples) && Array.isArray(data.evaluations), "Missing site data");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
check(["en", "zh"].includes(config.defaultLanguage), "Invalid default language");
if (config.copy !== undefined) {
  check(config.copy && typeof config.copy === 'object' && !Array.isArray(config.copy), 'Custom site copy must be an object');
  for (const [language, fields] of Object.entries(config.copy || {})) {
    check(['zh', 'en'].includes(language) && fields && typeof fields === 'object' && !Array.isArray(fields), 'Invalid custom copy language');
    for (const value of Object.values(fields || {})) check(typeof value === 'string', 'Custom copy must contain text');
  }
}
for (const key of ["spaceUrl", "repositoryUrl", "technicalReportUrl", "contactUrl"]) {
  check(typeof config[key] === "string", `${key} must be a string`);
  publicUrl(config[key], key, key === "contactUrl");
}

const categoryIds = new Set();
for (const category of data.categories) {
  check(/^[a-z0-9-]+$/.test(category.id) && !categoryIds.has(category.id), `Invalid or duplicate category ${category.id}`);
  localized(category, `Category ${category.id}`);
  categoryIds.add(category.id);
}
const sampleIds = new Set();
let missingMedia = 0;
let missingReferences = 0;
let missingOutputs = 0;
for (const sample of data.samples) {
  check(/^[a-z0-9-]+$/.test(sample.id) && !sampleIds.has(sample.id), `Invalid or duplicate sample ${sample.id}`);
  sampleIds.add(sample.id);
  check(categoryIds.has(sample.category), `Unknown category for ${sample.id}`);
  localized(sample.title, `${sample.id} title`);
  localized(sample.description, `${sample.id} description`);
  check(Array.isArray(sample.tags) && sample.tags.every((tag) => typeof tag === "string"), `${sample.id} tags are invalid`);
  check(sample.reference && typeof sample.reference.transcript === "string", `${sample.id} reference transcript must be a string`);
  localized(sample.reference?.label, `${sample.id} reference label`);
  mediaPath(sample.reference?.src, `${sample.id} reference`);
  if (!sample.reference?.src) { missingMedia += 1; missingReferences += 1; }
  check(Array.isArray(sample.outputs) && sample.outputs.length > 0, `${sample.id} has no output entries`);
  for (const [index, output] of (sample.outputs || []).entries()) {
    const label = `${sample.id} output ${index + 1}`;
    check(output.enabled === undefined || typeof output.enabled === 'boolean', `${label} visibility must be boolean`);
    localized(output.label, label);
    check(typeof output.text === "string" && output.text.trim(), `${label} needs a transcript`);
    check(typeof output.language === "string", `${label} needs a language tag`);
    check(typeof output.model === "string" && typeof output.settings === "string", `${label} metadata must use strings`);
    check(typeof output.illustrative === "boolean", `${label} needs an explicit illustrative flag`);
    mediaPath(output.src, label);
    if (!output.src) { missingMedia += 1; missingOutputs += 1; }
    if (output.src) {
      check(output.model.trim() && output.settings.trim(), `${label} needs model version and synthesis settings before adding audio`);
      check(output.illustrative === false, `${label} must replace the illustrative text with the actual transcript`);
    }
  }
}
for (const category of categoryIds) check(data.samples.some((sample) => sample.category === category), `Empty sample category ${category}`);

const evaluationIds = new Set();
for (const evaluation of data.evaluations) {
  check(/^[a-z0-9-]+$/.test(evaluation.id) && !evaluationIds.has(evaluation.id), `Invalid or duplicate evaluation ${evaluation.id}`);
  evaluationIds.add(evaluation.id);
  for (const field of ["label", "title", "metric", "method", "caveat"]) localized(evaluation[field], `${evaluation.id} ${field}`);
  check(Boolean(evaluation.model && evaluation.baseline), `${evaluation.id} must identify both model versions`);
  check(evaluation.headline.length === 2 && evaluation.headline.every(Number.isFinite), `${evaluation.id} needs two finite headline values`);
  check(evaluation.rows.length > 0, `${evaluation.id} needs dimension rows`);
  for (const row of evaluation.rows) {
    localized(row, `${evaluation.id} dimension`);
    check(row.values.length === 2 && row.values.every((value) => Number.isFinite(value) && value >= 0 && value <= 1), `${evaluation.id} chart values must be within 0–1`);
  }
}

const html = read("index.html");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
check(ids.length === new Set(ids).size, "Duplicate HTML IDs");
for (const [, attribute, target] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
  if (target.startsWith("#")) {
    check(ids.includes(target.slice(1)), `Missing anchor target ${target}`);
  } else if (target.startsWith("./")) {
    check(fs.existsSync(path.join(root, target.split(/[?#]/)[0])), `Missing static resource ${target}`);
  } else {
    check(false, `Use relative static paths: ${attribute}=${target}`);
  }
}
const script = read("assets/app.js");
const pageFields = [...html.matchAll(/data-page-text="([a-z0-9-]+)"/g)].map(match => match[1]);
const blockIds = [...html.matchAll(/data-block-id="([a-z0-9-]+)"/g)].map(match => match[1]);
check(new Set(blockIds).size === blockIds.length, 'Block IDs must be unique');
if (config.hiddenBlocks !== undefined) {
  check(Array.isArray(config.hiddenBlocks), 'Hidden blocks must be an array');
  if (Array.isArray(config.hiddenBlocks)) {
    check(new Set(config.hiddenBlocks).size === config.hiddenBlocks.length, 'Hidden block IDs must be unique');
    for (const key of config.hiddenBlocks) check(typeof key === 'string' && blockIds.includes(key), `Invalid hidden block ${key}`);
  }
}
check(new Set(pageFields).size === pageFields.length, 'Page text fields must be unique');
if (config.pageText !== undefined) {
  check(config.pageText && typeof config.pageText === 'object' && !Array.isArray(config.pageText), 'Page text must be an object');
  for (const [key, value] of Object.entries(config.pageText || {})) {
    check(pageFields.includes(key) && typeof value === 'string' && value.length <= 10000, `Invalid page text field ${key}`);
  }
}
for (const [, id] of script.matchAll(/select\(["']#([a-z-]+)["']\)/g)) check(ids.includes(id), `Script refers to missing ID ${id}`);
for (const [, key] of html.matchAll(/data-i18n="([^"]+)"/g)) {
  const occurrences = script.match(new RegExp(`\\b${key}:`, "g")) || [];
  check(occurrences.length >= 2, `Missing bilingual copy for ${key}`);
}
for (const filename of ["assets/app.js", "site.config.js", "data.js"]) {
  try { new vm.Script(read(filename)); check(true, `${filename} syntax`); }
  catch (error) { check(false, `${filename}: ${error.message}`); }
}
if (config.layout === 'attachment') {
  for (const [, key] of html.matchAll(/data-copy="([^"]+)"/g)) check(typeof config.copy?.zh?.[key] === 'string', `Missing attachment copy field ${key}`);
  for (const id of ['capability', 'matrix', 'eval', 'demo', 'start', 'sample-dialog', 'resource-dialog']) check(ids.includes(id), `Missing attachment section ${id}`);
  check((html.match(/class="eval-card"/g) || []).length === 6, 'Attachment must retain all six evaluation cards');
  check((html.match(/class="scene-row"/g) || []).length === 7, 'Attachment must retain all seven scenario rows');
  check((html.match(/data-demo="/g) || []).length === 8, 'Attachment must retain all eight demo cards');
}

function inspectPublicFile(relative) {
  const absolute = path.join(root, relative);
  const stat = fs.lstatSync(absolute);
  check(!stat.isSymbolicLink(), `Public file must not be a symlink: ${relative}`);
  if (stat.isSymbolicLink()) return;
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(absolute)) if (entry !== '.DS_Store') inspectPublicFile(path.join(relative, entry));
    return;
  }
  check(!path.basename(relative).startsWith(".") || [".nojekyll", ".gitkeep"].includes(path.basename(relative)), `Unexpected hidden public file: ${relative}`);
  check(/\.(html|js|css|md|json|svg|png|jpg|jpeg|webp|wav|mp3|ogg|m4a|flac)$/.test(relative) || relative.endsWith(".nojekyll") || relative.endsWith(".gitkeep"), `Unexpected public file type: ${relative}`);
  if (/\.(html|js|css|md|json|svg)$/.test(relative)) {
    const text = fs.readFileSync(absolute, "utf8");
    check(!/(?:sk-[A-Za-z0-9_-]{16,}|hf_[A-Za-z0-9]{16,}|ghp_[A-Za-z0-9]{16,})/.test(text), `Credential-like value found in ${relative}`);
    check(!/https?:\/\/(?:api)?joyspace\.jd\.com/i.test(text), `Internal document URL found in ${relative}`);
  }
}
for (const entry of ["index.html", "site.config.js", "data.js", "MODEL_CARD.md", "README.md", ".nojekyll", "assets"]) inspectPublicFile(entry);

if (missingReferences) warnings.push(`${missingReferences} original reference recordings are unpublished; empty reference panels are hidden and the limitation is disclosed.`);
if (missingOutputs) warnings.push(`${missingOutputs} output entries have no playable file and are excluded from the audio gallery and counts.`);
if (!config.spaceUrl) warnings.push("Hugging Face Space URL is not configured; the demo button opens setup information.");
if (release) {
  check(missingMedia === 0, "Release requires all listed reference and output audio slots to be filled; remove unready cases first");
  check(Boolean(config.spaceUrl), "Release requires a public HTTPS Space URL");
  for (const sample of data.samples) check(Boolean(sample.reference.transcript.trim()), `${sample.id} reference transcript is required for release`);
}

for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  console.error(`${errors.length} failures across ${checks} checks.`);
  process.exit(1);
}
console.log(`PASS: ${checks} checks; ${data.categories.length} categories, ${data.samples.length} cases, ${data.evaluations.length} evaluation datasets.`);
console.log(release ? "Release structure complete. Media rights and remote availability still require manual review." : "Preview structure valid. This does not mean media or deployment is complete.");
