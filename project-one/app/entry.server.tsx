import {
  handleRequest as vercelHandleRequest,
} from '@vercel/react-router/entry.server';

import type {
  AppLoadContext,
  EntryContext,
} from 'react-router';

/*
 * ==================================================
 * Vercel SSR Entry
 * ==================================================
 *
 * Vercel handles the React Router document response.
 * Hydrogen request context is created by the server
 * adapter before this handler is reached.
 * ==================================================
 */

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context?: AppLoadContext,
): Promise<Response> {

  return vercelHandleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    reactRouterContext,
    context,
  );
}