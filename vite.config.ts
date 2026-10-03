/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';

/**
 * Dev-only reverse proxy. It mirrors the nginx config used in Docker so the
 * app always talks to `/api/<source>` and API keys never reach the browser.
 */
function apiProxy(env: Record<string, string>): Record<string, ProxyOptions> {
  const withQueryKey = (path: string, key: string) =>
    `${path}${path.includes('?') ? '&' : '?'}api-key=${encodeURIComponent(key)}`;

  return {
    '/api/newsapi': {
      target: 'https://newsapi.org',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/newsapi/, ''),
      headers: { 'X-Api-Key': env.NEWSAPI_KEY ?? '' },
    },
    '/api/guardian': {
      target: 'https://content.guardianapis.com',
      changeOrigin: true,
      rewrite: (path) =>
        withQueryKey(path.replace(/^\/api\/guardian/, ''), env.GUARDIAN_API_KEY ?? ''),
    },
    '/api/nyt': {
      target: 'https://api.nytimes.com',
      changeOrigin: true,
      rewrite: (path) => withQueryKey(path.replace(/^\/api\/nyt/, ''), env.NYT_API_KEY ?? ''),
    },
  };
}

export default defineConfig(({ mode }) => {
  // Empty prefix: load NEWSAPI_KEY etc. without exposing them via import.meta.env.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { proxy: apiProxy(env) },
    preview: { proxy: apiProxy(env) },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  };
});
