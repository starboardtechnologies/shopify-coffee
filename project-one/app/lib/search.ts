type PredictiveSearchItems = {
  articles: unknown[];
  collections: unknown[];
  products: unknown[];
  pages: unknown[];
  queries: unknown[];
};

type ResultWithItems<
  Type extends 'predictive' | 'regular',
  Items,
> = {
  type: Type;
  term: string;
  error?: string;
  result: {
    total: number;
    items: Items;
  };
};

export type RegularSearchReturn =
  ResultWithItems<
    'regular',
    unknown
  >;

export type PredictiveSearchReturn =
  ResultWithItems<
    'predictive',
    PredictiveSearchItems
  >;


/*
 * ==================================================
 * Empty Predictive Search Result
 * ==================================================
 *
 * Provides the empty search state used when
 * resetting predictive search results.
 * ==================================================
 */

export function getEmptyPredictiveSearchResult():
  PredictiveSearchReturn['result'] {

  return {
    total: 0,

    items: {
      articles: [],
      collections: [],
      products: [],
      pages: [],
      queries: [],
    },
  };
}


interface UrlWithTrackingParams {
  /** The base URL to which the tracking parameters will be appended. */
  baseUrl: string;

  /** The trackingParams returned by the Storefront API. */
  trackingParams?: string | null;

  /** Any additional query parameters to be appended to the URL. */
  params?: Record<string, string>;

  /** The search term to be appended to the URL. */
  term: string;
}


/*
 * ==================================================
 * Search URL
 * ==================================================
 *
 * Adds the search term, optional parameters, and
 * Shopify tracking parameters to a URL.
 * ==================================================
 */

export function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  params: extraParams,
  term,
}: UrlWithTrackingParams) {

  let search =
    new URLSearchParams({
      ...extraParams,
      q: encodeURIComponent(term),
    }).toString();


  if (trackingParams) {
    search =
      `${search}&${trackingParams}`;
  }


  return `${baseUrl}?${search}`;
}