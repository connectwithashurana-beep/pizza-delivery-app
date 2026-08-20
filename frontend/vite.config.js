import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  root: rootDir,
  preview: { port: 4173 },
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  esbuild: {
    legalComments: 'none',
  },
  server: {
    port: 5173,
    // Keep Vite's file access confined to the frontend project. This avoids
    // Windows build-time directory probing from escaping into restricted
    // parent paths when the workspace is nested inside Downloads.
    fs: {
      strict: true,
      allow: [rootDir],
    },
  },
})
