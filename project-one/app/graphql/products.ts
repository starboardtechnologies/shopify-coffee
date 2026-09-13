export const PRODUCTS_QUERY = `#graphql
  query Products(
    $first: Int!
  ) {

    products(
      first: $first
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


        variants(
          first: 1
        ) {

          nodes {

            id

          }

        }

      }

    }

  }
`;