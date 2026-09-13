import {
  handleRequest as vercelHandleRequest,
} from '@vercel/react-router/entry.server';

import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';

import type {
  AppLoadContext,
  EntryContext,
} from 'react-router';


/*
 * ==================================================
 * Vercel Server Entry
 * ==================================================
 *
 * Uses Vercel's React Router request handler for
 * server-side rendering.
 * ==================================================
 */

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context?: AppLoadContext,
): Promise<Response> {

  const hydrogenContext =
    context as
      | HydrogenRouterContextProvider
      | undefined;


  /*
   * Create the Content Security Policy used
   * by Hydrogen for storefront requests.
   */

  const {
    nonce,
    header,
  } =
    createContentSecurityPolicy({
      shop: {
        checkoutDomain:
          hydrogenContext?.env
            .PUBLIC_CHECKOUT_DOMAIN,

        storeDomain:
          hydrogenContext?.env
            .PUBLIC_STORE_DOMAIN,
      },
    });


  /*
   * Let Vercel handle React Router SSR.
   */

  const response =
    await vercelHandleRequest(
      request,
      responseStatusCode,
      responseHeaders,
      reactRouterContext,
      context,
      {
        nonce,
      },
    );


  /*
   * Attach Hydrogen's CSP header.
   */

  response.headers.set(
    'Content-Security-Policy',
    header,
  );


  return response;
}