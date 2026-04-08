import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 5175,
    strictPort: false,
    proxy: {
      // Same path as production Vercel function — avoids browser CORS to USCCB in dev
      "/api/usccb-rss": {
        target: "https://www.usccb.org",
        changeOrigin: true,
        rewrite: () => "/bible/readings/rss/index.cfm",
        secure: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['@supabase/supabase-js', '@supabase/gotrue-js'],
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
})
