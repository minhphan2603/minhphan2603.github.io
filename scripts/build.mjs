import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, "site");
const output = join(root, "public");

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

console.log("Portfolio built in public/");
