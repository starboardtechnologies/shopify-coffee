import {Outlet} from "react-router";
import type {Route} from "./+types/($locale)";

export async function loader({
  params,
  context,
}: Route.LoaderArgs) {

  const {language, country} =
    context.storefront.i18n;


  return {
    locale: params.locale,
    language,
    country,
  };

}


export default function LocaleLayout() {

  return <Outlet />;

}