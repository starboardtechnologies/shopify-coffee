import type {LoaderFunctionArgs} from "react-router";

import Header from "~/components/Header";
import CoffeeAssistant from "~/components/ai/CoffeeAssistant";

export async function loader({
  params,
  context,
}: LoaderFunctionArgs) {
  const {language, country} =
    context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !==
      `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we are
    // still at the default locale, the locale param
    // must be invalid.
    throw new Response(null, {
      status: 404,
    });
  }

  return null;
}

/*
 * ==================================================
 * STOREFRONT LAYOUT
 * ==================================================
 *
 * Header and Coffee Assistant are mounted here so
 * they appear throughout the storefront.
 * ==================================================
 */

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main>
        {children}
      </main>

      <CoffeeAssistant />
    </>
  );
}