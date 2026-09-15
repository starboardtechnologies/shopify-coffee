import {HydratedRouter} from "react-router/dom";

import {
  startTransition,
  StrictMode,
} from "react";

import {hydrateRoot} from "react-dom/client";

/*
 * ==================================================
 * Client Hydration
 * ==================================================
 *
 * Hydrates the server-rendered Hydrogen storefront
 * so React interactions work on the client.
 *
 * Hydrogen handles the server-side CSP nonce in
 * entry.server.tsx. The client entry does not need
 * to create or provide another NonceProvider.
 * ==================================================
 */

startTransition(() => {

  hydrateRoot(
    document,

    <StrictMode>

      <HydratedRouter />

    </StrictMode>,
  );

});