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
  },
});
