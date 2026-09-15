import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type {Route} from "./+types/root";

import {
  useNonce,
} from "@shopify/hydrogen";

import {CartProvider} from "~/components/cart/CartContext";

import "~/styles/app.css";

/*
 * ==================================================
 * Root Loader
 * ==================================================
 */

export async function loader({
  request: _request,
}: Route.LoaderArgs) {
  return {};
}

/*
 * ==================================================
 * Root Document Layout
 * ==================================================
 *
 * Hydrogen creates a CSP nonce in entry.server.tsx.
 * useNonce() retrieves that same nonce through the
 * Hydrogen NonceProvider.
 *
 * React Router's Scripts and ScrollRestoration
 * generate inline scripts, so they must receive the
 * same nonce for Oxygen's CSP to allow them to run.
 * ==================================================
 */

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = useNonce();

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

        <ScrollRestoration
          nonce={nonce}
        />

        <Scripts
          nonce={nonce}
        />
      </body>
    </html>
  );
}

/*
 * ==================================================
 * Application Root
 * ==================================================
 *
 * CartProvider wraps the storefront so cart state
 * and interactions are available throughout the app.
 * ==================================================
 */

export default function App() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
}