import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';
import cypress from 'cypress';

export default defineConfig(() => {
  return {
    plugins: [react(), istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.ts', '.tsx'],
      requireEnv: true,
    }),],
    build: {
      outDir: 'build',
      publicDir: 'public',
      sourcemap: true,
      base: '/',
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
            return;
          }
          warn(warning);
        },
      },
    },
    envPrefix: ['REACT_APP_', 'VITE_'],
  }
});
