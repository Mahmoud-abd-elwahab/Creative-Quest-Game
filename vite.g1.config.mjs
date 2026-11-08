import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// This is a SECOND ENTRYPOINT. Never replace the published root index.html
// or deploy this prototype as production before QA + Game Director signoff.
export default defineConfig({
  root: resolve(projectRoot, 'dev/g1'),
  base: '/Creative-Quest-Game/g1/',
  publicDir: false,
  build: {
    outDir: resolve(projectRoot, 'dist/g1'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        boot: resolve(projectRoot, 'dev/g1/index.html'),
        play: resolve(projectRoot, 'dev/g1/play.html')
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true
  }
});
