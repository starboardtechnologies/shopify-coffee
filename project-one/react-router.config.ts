import type {Config} from "@react-router/dev/config";

import {hydrogenPreset} from "@shopify/hydrogen/react-router-preset";

/*
 * Hydrogen React Router configuration.
 *
 * The Hydrogen preset provides the routing and build configuration
 * expected by Shopify Oxygen.
 */

export default {
  presets: [hydrogenPreset()],
} satisfies Config;