import * as serverBuild from 'virtual:react-router/server-build';

import {
  createRequestHandler,
  storefrontRedirect,
} from '@shopify/hydrogen';

import {
  createHydrogenRouterContext,
} from '~/lib/context';


/*
 * ==================================================
 * Vercel / Node Server
 * ==================================================
 *
 * Creates the Hydrogen context without the
 * Oxygen-specific ExecutionContext dependency.
 * ==================================================
 */

export default {

  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {

    try {

      /*
       * Use the standard Web Cache API.
       */

      const cache =
        await caches.open(
          'hydrogen',
        );


      /*
       * Vercel/Node does not provide the
       * Cloudflare ExecutionContext object.
       */

      const waitUntil =
        (
          globalThis as typeof globalThis & {
            waitUntil?: (
              promise: Promise<unknown>,
            ) => void;
          }
        ).waitUntil ??
        (() => undefined);


      const hydrogenContext =
        await createHydrogenRouterContext(
          request,
          env,
          cache,
          waitUntil,
        );


      const handleRequest =
        createRequestHandler({
          build: serverBuild,

          mode:
            process.env.NODE_ENV,

          getLoadContext: () =>
            hydrogenContext,
        });


      const response =
        await handleRequest(
          request,
        );


      /*
       * Commit pending session cookies.
       */

      if (
        hydrogenContext
          .session
          .isPending
      ) {

        response.headers.set(
          'Set-Cookie',

          await hydrogenContext
            .session
            .commit(),
        );

      }


      /*
       * Preserve Hydrogen's storefront
       * redirect behavior.
       */

      if (
        response.status === 404
      ) {

        return storefrontRedirect({
          request,

          response,

          storefront:
            hydrogenContext
              .storefront,
        });

      }


      return response;

    } catch (error) {

      console.error(
        error,
      );


      return new Response(
        'An unexpected error occurred',
        {
          status: 500,
        },
      );

    }

  },

};