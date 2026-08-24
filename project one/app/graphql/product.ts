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


      variants(
        first: 1
      ) {

        nodes {

          id

        }

      }

    }

  }
`;