import { access, readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptsDirectory, "..");
const source = join(root, "site");
const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "assets/minh-phan-cv.pdf",
  "assets/profile.jpg",
];

const failures = [];
const fail = (message) => failures.push(message);

for (const relativePath of requiredFiles) {
  try {
    await access(join(source, relativePath));
  } catch {
    fail(`Missing required source file: site/${relativePath}`);
  }
}

const html = await readFile(join(source, "index.html"), "utf8");
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

if (duplicateIds.length) {
  fail(`Duplicate HTML id values: ${[...new Set(duplicateIds)].join(", ")}`);
}

for (const element of ["header", "main", "h1", "footer"]) {
  if (!new RegExp(`<${element}(?:\\s|>)`).test(html)) {
    fail(`Missing semantic <${element}> element`);
  }
}

const localReferences = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
  .map((match) => match[1].split(/[?#]/)[0])
  .filter((value) => value && !/^(?:https?:|mailto:|data:|#)/.test(value));

for (const reference of new Set(localReferences)) {
  try {
    await access(join(source, reference));
  } catch {
    fail(`Broken local reference in index.html: ${reference}`);
  }
}

const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!jsonLd) {
  fail("Missing JSON-LD metadata");
} else {
  try {
    JSON.parse(jsonLd[1]);
  } catch (error) {
    fail(`Invalid JSON-LD metadata: ${error.message}`);
  }
}

const blankLinks = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(
  (match) => match[0],
);
if (blankLinks.some((link) => !/rel="[^"]*noreferrer[^"]*"/.test(link))) {
  fail('Every target="_blank" link must include rel="noreferrer"');
}

for (const [relativePath, minimumBytes] of [
  ["assets/minh-phan-cv.pdf", 10_000],
  ["assets/profile.jpg", 10_000],
]) {
  const file = await stat(join(source, relativePath));
  if (file.size < minimumBytes) {
    fail(`Asset appears incomplete: site/${relativePath}`);
  }
}

for (const script of ["site/script.js", "scripts/build.mjs", "scripts/clean.mjs", "scripts/serve.mjs"]) {
  try {
    execFileSync(process.execPath, ["--check", join(root, script)], { stdio: "pipe" });
  } catch (error) {
    fail(`JavaScript syntax check failed: ${script}\n${error.stderr?.toString() || error.message}`);
  }
}

if (failures.length) {
  console.error(`Repository checks failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Repository checks passed (${requiredFiles.length} source files, ${ids.length} unique HTML ids)`);
