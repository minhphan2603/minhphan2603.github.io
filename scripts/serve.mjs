import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.cwd(), "public");
const port = Number(process.env.PORT || 8080);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = createServer((request, response) => {
  let requestPath;

  try {
    requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  const relativePath = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const filePath = resolve(root, relativePath);
  const isInsideRoot = filePath === root || filePath.startsWith(`${root}${sep}`);

  if (!isInsideRoot || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Cache-Control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=3600",
    "Content-Type": types[extname(filePath)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
});

server.on("error", (error) => {
  console.error(`Preview server failed: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}`);
});
