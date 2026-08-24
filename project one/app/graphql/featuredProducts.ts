export const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts(
    $country: CountryCode
    $language: LanguageCode
  )
  @inContext(country: $country, language: $language) {

    products(
      first: 4
      query: "coffee OR espresso OR roast OR blend"
    ) {
      nodes {
        id
        title
        handle

        featuredImage {
          url
          altText
        }

        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;