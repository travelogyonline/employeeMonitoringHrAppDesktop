// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    electron([
      {
        // Main Process
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
      // **ADD THIS BLOCK FOR THE PRELOAD SCRIPT**
      {
        // Preload Script (Renderer-side Node API setup)
        entry: 'src/electron/preload.js', // <-- Use your preload path
        onstart: () => { }, // No need to start this script
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              output: {
                // Keep the original name for the preload script
                entryFileNames: 'preload.js',
              },
            },
          },
        },
      }
    ]),
    viteStaticCopy({
      targets: [
        {
          // The path to your icon source file
          src: 'src/electron/icon.png',
          // The destination folder inside your overall Vite output root (which is where
          // dist-electron will be created)
          dest: 'dist-electron'
        }
      ]
    }),
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
})