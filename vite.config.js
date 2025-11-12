import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    electron([
      {
        entry: 'src/electron/main.js',
        vite: {
          build: {
            outDir: 'dist-electron', 
            rollupOptions: {
              output: {
                entryFileNames: 'main.js',
              },
            },
          },
        },
        onstart(options) {
          options.startup();
        },
      },
    ]),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: 'dist-react'
  },
  base: './',
  // server: {
  //   port: 4000,
  //   strictPort: true 
  // }
})
