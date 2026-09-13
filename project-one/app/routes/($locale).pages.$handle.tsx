import {useLoaderData} from 'react-router';

import type {Route} from './+types/($locale).pages.$handle';

import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte.
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render the initial page state.
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/*
 * Load data necessary for rendering content above the fold.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other critical queries here so they load in parallel.
  ]);

  if (!page) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {
    handle: params.handle,
    data: page,
  });

  return {
    page,
  };
}

/*
 * Load data for content below the fold.
 * Keep this non-blocking so it does not delay the initial page render.
 */
function loadDeferredData({
  context,
}: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const {page} =
    useLoaderData<typeof loader>();

  return (
    <div className="page">
      <header>
        <h1>
          {page.title}
        </h1>
      </header>

      <main
        dangerouslySetInnerHTML={{
          __html: page.body,
        }}
      />
    </div>
  );
}

/*
 * Shopify page query.
 */
const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;