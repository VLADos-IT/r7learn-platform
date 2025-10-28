import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const r7lDir = resolve(__dirname, 'r7l');

export default defineConfig({
  root: r7lDir,
  base: '/',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(r7lDir, 'index.html'),
        auth: resolve(r7lDir, 'auth.html'),
        profile: resolve(r7lDir, 'profile.html'),
        viewer: resolve(r7lDir, 'viewer.html'),
        test: resolve(r7lDir, 'test.html'),
        '404': resolve(r7lDir, '404.html'),
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: resolve(r7lDir, 'assets/**/*'), dest: 'assets' },
        { src: resolve(r7lDir, 'favicon.ico'), dest: '.' },
        { src: resolve(r7lDir, 'build_version.json'), dest: '.' },
        { src: resolve(r7lDir, 'header.html'), dest: '.' },
        { src: resolve(r7lDir, 'footer.html'), dest: '.' }
      ]
    })
  ]
});
