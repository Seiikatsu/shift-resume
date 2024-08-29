import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * TODO: start is currently not working as we are importing modules from within the project!
 */
export default defineConfig({
  publicDir: false,
  build: {
    target: 'esnext',
    ssr: './src/express/server.ts',
    outDir: './build',
    emptyOutDir: false,
    ssrEmitAssets: false,
    rollupOptions: {
      // this will ignore the ./server/index.js import!
      external: [/\/server\/.*/],
    },
  },
  plugins: [tsconfigPaths()],
});
