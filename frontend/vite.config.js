import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Logs every request served by `vite` (dev) and `vite preview` with status and timing.
// Disable with VITE_SERVER_LOG=false.
const requestLogger = () => {
  const middleware = (req, res, next) => {
    const start = performance.now()
    // Capture now: the SPA fallback later rewrites req.url to /index.html
    const url = req.url
    // Count bytes actually written (many responses are streamed without Content-Length)
    let bytes = 0
    const count = (fn) => (chunk, ...rest) => {
      if (chunk && typeof chunk !== 'function') bytes += Buffer.byteLength(chunk)
      return fn.call(res, chunk, ...rest)
    }
    res.write = count(res.write)
    res.end = count(res.end)
    res.on('finish', () => {
      const ms = (performance.now() - start).toFixed(1)
      console.log(`${new Date().toISOString()} [vite] ${req.method} ${url} -> ${res.statusCode} ${bytes}B ${ms}ms`)
    })
    next()
  }
  return {
    name: 'request-logger',
    configureServer: (server) => { server.middlewares.use(middleware) },
    configurePreviewServer: (server) => { server.middlewares.use(middleware) },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.VITE_SERVER_LOG !== 'false' && requestLogger(),
  ],
  define: {
    // Vercel sets VERCEL=1 during its builds; its analytics scripts only exist there
    'import.meta.env.VITE_ON_VERCEL': JSON.stringify(Boolean(process.env.VERCEL)),
  },
  build: {
    // ag-grid and the markdown/KaTeX stack are inherently large; they're
    // isolated in the lazily loaded /sim and /ask-ai route chunks.
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      onwarn(warning, warn) {
        // unified/mdast packages ship harmless '' directives
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },
})
