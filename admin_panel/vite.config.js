import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const adminDir = resolve(__dirname, 'admin_r7l');

export default defineConfig({
  root: adminDir,
  base: '/',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(adminDir, 'index.html'),
        '404': resolve(adminDir, '404.html')
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: resolve(adminDir, '**/*'), dest: 'assets' },
        { src: resolve(adminDir, 'favicon.ico'), dest: '.' }
      ]
    })
  ]
});
