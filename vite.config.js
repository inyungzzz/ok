import { defineConfig } from 'vite';

const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  // GitHub Pages project sites are served below /<repository>/.
  base: process.env.VITE_BASE_PATH || '/',
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders },
});
