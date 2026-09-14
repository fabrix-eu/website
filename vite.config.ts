import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const target = loadEnv(mode, process.cwd(), '').VITE_DIRECTUS_URL || 'https://back.fabrixproject.eu';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5174,
      // Directus is reached through this proxy in dev, never straight from the
      // browser: CORS on back.fabrixproject.eu then never depends on the dev port.
      proxy: {
        '/cms': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cms/, ''),
        },
      },
    },
  };
});
