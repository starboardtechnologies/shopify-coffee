import {handleRequest as vercelHandleRequest} from '@vercel/react-router/entry.server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {AppLoadContext, EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context?: AppLoadContext,
): Promise<Response> {
  const hydrogenContext =
    context as HydrogenRouterContextProvider | undefined;

  const {nonce, header} = createContentSecurityPolicy({
    shop: {
      checkoutDomain:
        hydrogenContext?.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain:
        hydrogenContext?.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const response = await vercelHandleRequest(
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