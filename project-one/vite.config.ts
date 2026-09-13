// vite.config.ts

import {fileURLToPath} from 'node:url';

import {defineConfig} from 'vite';

import {hydrogen} from '@shopify/hydrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig(
  ({isSsrBuild}) => ({

    plugins: [
      tailwindcss(),
      hydrogen(),
      reactRouter(),
    ],


    resolve: {

      alias: {

        // Hydrogen app alias.
        '~': fileURLToPath(
          new URL(
            './app',
            import.meta.url,
          ),
        ),

      },

      tsconfigPaths: true,

    },


    build: {

      // Use the custom Hydrogen server
      // as the SSR entrypoint.
      rollupOptions:
        isSsrBuild
          ? {
              input:
                './server/app.ts',
            }
          : undefined,

      // Prevent assets from being
      // inlined as base64.
      assetsInlineLimit: 0,

    },


    ssr: {

      optimizeDeps: {

        include: [
          'react-router > set-cookie-parser',
          'react-router > cookie',
          'react-router',
        ],

      },

    },


    server: {

      allowedHosts: [
        '.tryhydrogen.dev',
      ],

    },

  }),
);