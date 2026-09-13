import {
  handleRequest as vercelHandleRequest,
} from '@vercel/react-router/entry.server';

import {
  createContentSecurityPolicy,
} from '@shopify/hydrogen';

import type {
  AppLoadContext,
  EntryContext,
} from 'react-router';

/*
 * ==================================================
 * Vercel SSR Entry
 * ==================================================
 *
 * Handles React Router SSR through Vercel's
 * React Router adapter.
 *
 * The deployed portfolio does not require the
 * Shopify checkout domain for initial rendering,
 * so CSP generation does not depend on Hydrogen
 * environment context being available here.
 * ==================================================
 */

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context?: AppLoadContext,
): Promise<Response> {

  const {
    nonce,
    header,
  } =
    createContentSecurityPolicy();

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

  response.headers.set(
    'Content-Security-Policy',
    header,
  );

  return response;
}