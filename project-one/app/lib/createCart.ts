import {CREATE_CART_MUTATION} from "~/graphql/cart";


export async function createShopifyCart(
  storefront: any,
  lines: any[],
) {

  const response =
    await storefront.mutate(
      CREATE_CART_MUTATION,
      {
        variables: {
          input: {
            lines,
          },
        },
      },
    );


  return response.cartCreate.cart;

}