import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

export default defineConfig({
  plugins: [react()],
  root: join(__dirname, 'renderer'),
  base: './',
  build: {
    outDir: join(__dirname, 'renderer', 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: '127.0.0.1',
    // Proxy AI provider API calls to bypass CORS in browser dev mode
    proxy: {
      '/api/ai/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai\/anthropic/, ''),
      },
      '/api/ai/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai\/openai/, ''),
      },
      '/api/ai/google': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai\/google/, ''),
      },
      '/api/ai/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai\/groq/, ''),
      },
      '/api/ai/openrouter': {
        target: 'https://openrouter.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai\/openrouter/, ''),
      },
    },
  },
  preview: {
    port: 4175,
    host: '127.0.0.1',
    // Note: vite preview doesn't support proxy — use `npm run serve` for AI chat in browser
  },
});
