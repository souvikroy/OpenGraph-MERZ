import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const site = (env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '')

  return {
  plugins: [
    react(),
    {
      name: 'og-absolute-image',
      transformIndexHtml(html) {
        if (!site) return html
        const abs = `${site}/logo.png`
        return html
          .replace(/(<meta property="og:image" content=")([^"]*)(")/, `$1${abs}$3`)
          .replace(/(<meta name="twitter:image" content=")([^"]*)(")/, `$1${abs}$3`)
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          utils: ['date-fns', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  }
})
