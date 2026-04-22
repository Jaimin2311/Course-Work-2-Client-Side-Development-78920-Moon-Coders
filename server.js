// creating server with node.js to serve static files and handle routing for the Next.js app if it is present. 
// This allows us to serve our static HTML, CSS, and JS files while also supporting Next.js features if the next module is available. 
const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DEV = process.env.NODE_ENV !== "production";
const ROUTES = {
  "/": path.join(ROOT, "htmls", "index.html"),
  "/contact": path.join(ROOT, "htmls", "index.html"),
  "/checkout": path.join(ROOT, "htmls", "index.html")
};

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function safeRequireNext() {
  try {
    return require("next");
  } catch (error) {
    return null;
  }
}

const nextModule = safeRequireNext();
const nextApp = nextModule ? nextModule({ dev: DEV }) : null;
const nextHandler = nextApp ? nextApp.getRequestHandler() : null;

function isInsideRoot(filePath) {
  const resolved = path.resolve(filePath);
  return resolved.startsWith(path.resolve(ROOT));
}

function sendFile(res, filePath) {
  if (!filePath || !isInsideRoot(filePath)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream"
    });
    res.end(file);
  });
}

function resolveStaticFile(urlPath) {
  const cleanPath = urlPath.replace(/^\/+/, "");
  const targetPath = path.join(ROOT, cleanPath);
  if (!isInsideRoot(targetPath)) {
    return null;
  }
  return targetPath;
}

const ready = nextApp ? nextApp.prepare() : Promise.resolve();

ready.then(() => {
  http
    .createServer((req, res) => {
      const requestUrl = new URL(req.url, `http://${req.headers.host}`);
      const pathname = requestUrl.pathname;

      if (ROUTES[pathname]) {
        sendFile(res, ROUTES[pathname]);
        return;
      }

      if (pathname === "/index.html") {
        sendFile(res, ROUTES["/"]);
        return;
      }

      if (
        pathname.startsWith("/css/") ||
        pathname.startsWith("/js/") ||
        pathname.startsWith("/assests/") ||
        pathname.startsWith("/htmls/")
      ) {
        const staticFile = resolveStaticFile(pathname);
        sendFile(res, staticFile);
        return;
      }

      if (nextHandler) {
        nextHandler(req, res);
        return;
      }

      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Page not found");
    })
    .listen(PORT, () => {
      const modeLabel = nextModule ? "Next-enabled" : "Static";
      console.log(`${modeLabel} Zilk server running on http://localhost:${PORT}`);
    });
});
