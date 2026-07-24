import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (command === 'build' && mode === 'production' && !env.VITE_API_URL) {
    throw new Error('VITE_API_URL must be set for a production frontend build');
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
    },
    // Railway runs `vite preview` without a desktop session. Explicitly
    // disable browser launching there so it does not attempt `xdg-open`.
    preview: {
      open: false,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});
