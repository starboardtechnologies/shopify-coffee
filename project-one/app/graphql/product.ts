export const PRODUCT_QUERY = `#graphql
  query Product(
    $handle: String!
  ) {

    product(
      handle: $handle
    ) {

      id

      title

      handle

      description

      featuredImage {
        url
        altText
      }

      priceRange {
        minVariantPrice {
          amount
        }
      }

      selectedOrFirstAvailableVariant {
        id

        availableForSale

        price {
          amount
          currencyCode
        }
      }

    }

  }
`;