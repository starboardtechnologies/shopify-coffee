// app/root.tsx

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type {Route} from './+types/root';

import {CartProvider} from '~/components/cart/CartContext';


/*
 * ==================================================
 * Root Loader
 * ==================================================
 *
 * The portfolio storefront uses local demo data and
 * does not require a Shopify Storefront API connection.
 * ==================================================
 */

export async function loader({
  request: _request,
}: Route.LoaderArgs) {

  return {};

}


/*
 * ==================================================
 * Layout
 * ==================================================
 *
 * Provides the HTML document shell used by the
 * React Router application.
 * ==================================================
 */

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <head>

        <meta charSet="utf-8" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />

        <Meta />

        <Links />

      </head>


      <body>

        {children}

        <ScrollRestoration />

        <Scripts />

      </body>

    </html>

  );

}


/*
 * ==================================================
 * Root Application
 * ==================================================
 *
 * Uses the local cart provider. Shopify Analytics is
 * intentionally not initialized because this portfolio
 * deployment does not have a Shopify store connection.
 * ==================================================
 */

export default function App() {

  return (

    <CartProvider>

      <Outlet />

    </CartProvider>

  );

}


/*
 * ==================================================
 * Error Boundary
 * ==================================================
 *
 * Displays a simple fallback instead of a blank page
 * when an unexpected application error occurs.
 * ==================================================
 */

export function ErrorBoundary({
  error,
}: Route.ErrorBoundaryProps) {

  let message =
    'Something went wrong.';


  if (
    error &&
    typeof error === 'object' &&
    'message' in error
  ) {

    message =
      String(error.message);

  }


  return (

    <main className="error-page">

      <div className="error-page-content">

        <h1>
          Java Coffee
        </h1>


        <h2>
          {message}
        </h2>


        <p>
          An unexpected application error occurred.
        </p>

      </div>

    </main>

  );

}