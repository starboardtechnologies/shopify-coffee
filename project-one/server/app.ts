import * as serverBuildModule from 'virtual:react-router/server-build';

import type {
  ServerBuild,
} from 'react-router';

import {
  createRequestHandler,
  storefrontRedirect,
} from '@shopify/hydrogen';

import {
  createHydrogenRouterContext,
} from '../app/lib/context';

/*
 * ==================================================
 * Vercel / Node Hydrogen Server Entry
 * ==================================================
 *
 * Creates the Hydrogen context before React Router
 * executes route loaders.
 * ==================================================
 */

interface ServerEnv {
  SESSION_SECRET: string;

  PUBLIC_STORE_DOMAIN?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PUBLIC_CHECKOUT_DOMAIN?: string;

  [key: string]: string | undefined;
}


/*
 * React Router exposes the generated server build
 * as named exports from its virtual module.
 *
 * Treat the generated module as the ServerBuild
 * expected by createRequestHandler().
 */

const serverBuild =
  serverBuildModule as unknown as ServerBuild;


/*
 * ==================================================
 * Request Handler
 * ==================================================
 */

export default async function handleRequest(
  request: Request,
): Promise<Response> {

  const env =
    process.env as unknown as ServerEnv;


  if (!env.SESSION_SECRET) {

    throw new Error(
      'SESSION_SECRET environment variable is not set',
    );

  }


  const cache =
    await caches.open(
      'hydrogen',
    );


  const waitUntil =
    (
      globalThis as typeof globalThis & {
        waitUntil?: (
          promise: Promise<unknown>,
        ) => void;
      }
    ).waitUntil ??
    (() => undefined);


  /*
   * Create Hydrogen context before React Router
   * executes route loaders.
   */

  const hydrogenContext =
    await createHydrogenRouterContext(
      request,
      env as never,
      cache,
      waitUntil,
    );


  /*
   * Pass Hydrogen context into React Router.
   */

  const handleHydrogenRequest =
    createRequestHandler({

      build:
        serverBuild,

      mode:
        process.env.NODE_ENV ??
        'production',

      getLoadContext:
        () =>
          hydrogenContext,

    });


  const response =
    await handleHydrogenRequest(
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
   * Handle Hydrogen storefront redirects.
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

}