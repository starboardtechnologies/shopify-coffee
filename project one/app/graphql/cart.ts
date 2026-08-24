export const CREATE_CART_MUTATION = `#graphql
  mutation cartCreate(
    $lines: [CartLineInput!]
  ) {

    cartCreate(
      input: {
        lines: $lines
      }
    ) {

      cart {

        id

        checkoutUrl

        totalQuantity

      }


      userErrors {

        field

        message

      }

    }

  }
`;