import {createHydrogenContext} from '@shopify/hydrogen';

import type {CartApiQueryFragment} from 'storefrontapi.generated';

import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {AppSession} from '~/lib/session';
import {getLocaleFromRequest} from '~/lib/i18n';


const additionalContext = {} as const;

type AdditionalContextType =
  typeof additionalContext;


declare global {
  interface HydrogenAdditionalContext
    extends AdditionalContextType {}

  interface HydrogenCustomCartFragment
    extends CartApiQueryFragment {}
}


/*
 * ==================================================
 * Hydrogen Context
 * ==================================================
 *
 * Creates the Hydrogen context used by React Router
 * loaders and actions.
 *
 * This version removes the Oxygen-specific
 * ExecutionContext dependency.
 * ==================================================
 */

export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  cache: Cache,
  waitUntil: (
    promise: Promise<unknown>,
  ) => void,
) {

  /*
   * SESSION_SECRET is required for the
   * Hydrogen session.
   */

  if (!env?.SESSION_SECRET) {
    throw new Error(
      'SESSION_SECRET environment variable is not set',
    );
  }


  /*
   * Initialize the Hydrogen session.
   */

  const session =
    await AppSession.init(
      request,
      [env.SESSION_SECRET],
    );


  /*
   * Create the Hydrogen application context.
   */

  const hydrogenContext =
    createHydrogenContext(
      {
        env,

        request,

        cache,

        waitUntil,

        session,

        i18n:
          getLocaleFromRequest(
            request,
          ),

        cart: {
          queryFragment:
            CART_QUERY_FRAGMENT,
        },
      },

      additionalContext,
    );


  return hydrogenContext;
}