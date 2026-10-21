// Serves the production build like `docusaurus serve`, logging every request.
// Usage: npm run build && npm run serve:logged  (PORT defaults to 3000)
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import handler from 'serve-handler';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'build');
const baseUrl = '/TradeSim/';
const port = Number(process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  const start = performance.now();
  res.on('finish', () => {
    const ms = (performance.now() - start).toFixed(1);
    const size = res.getHeader('content-length') ?? '-';
    console.log(`${new Date().toISOString()} [docs] ${req.method} ${req.url} -> ${res.statusCode} ${size}B ${ms}ms`);
  });

  if (!req.url.startsWith(baseUrl)) {
    res.writeHead(302, {Location: baseUrl});
    res.end();
    return;
  }
  // The build is generated for baseUrl, but its files live at the build root
  req.url = req.url.slice(baseUrl.length - 1) || '/';
  return handler(req, res, {
    public: root,
    cleanUrls: true,
    trailingSlash: false,
    headers: [
      {source: 'assets/**', headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]},
    ],
  });
});

server.listen(port, () => console.log(`Docs (production build) at http://localhost:${port}${baseUrl}`));
