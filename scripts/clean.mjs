import { rm } from "node:fs/promises";
import { join } from "node:path";

await rm(join(process.cwd(), "public"), { force: true, recursive: true });
console.log("Removed generated public/ output");
