import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
