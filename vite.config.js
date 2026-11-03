import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  server: { port: 3000, open: false },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/mathjs')) return 'mathjs';
          if (id.includes('node_modules/katex')) return 'katex';
          if (id.includes('node_modules/fflate')) return 'fflate';
        }
      }
    }
  },
  test: { globals: true, environment: 'node' }
});