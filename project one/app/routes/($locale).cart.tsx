import type {Route} from "./+types/($locale).cart";
import {Form, useActionData} from "react-router";

import {useCart} from "~/components/cart/CartContext";
import {CREATE_CART_MUTATION} from "~/graphql/cart";

export async function action({
  request,
  context,
}: Route.ActionArgs) {
  const formData = await request.formData();

  const lines = JSON.parse(
    formData.get("lines") as string
  );

  const result = await context.storefront.mutate(
    CREATE_CART_MUTATION,
    {
      variables: {
        lines,
      },
    },
  );

  return {
    checkoutUrl:
      result.cartCreate.cart.checkoutUrl,
  };
}

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const actionData =
    useActionData<typeof action>();

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price.replace("$", "")) *
        item.quantity,
    0,
  );

  return (
    <main className="cart-page">
      <section className="cart-container">
        <h1>
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p>
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <div className="cart-item-info">
                    <h2>
                      {item.title}
                    </h2>

                    <div className="product-quantity">

  <button
    type="button"
    onClick={() =>
      decreaseQuantity(item.id)
    }
  >
    −
  </button>


  <span>
    {item.quantity}
  </span>


  <button
    type="button"
    onClick={() =>
      increaseQuantity(item.id)
    }
  >
    +
  </button>

</div>

                    <p>
  $
  {(
    Number(item.price.replace("$", "")) *
    item.quantity
  ).toFixed(2)}
</p>

                    <button
  className="remove-item"
  type="button"
  onClick={() =>
    removeFromCart(item.id)
  }
>
  Remove
</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>
                Total: ${total.toFixed(2)}
              </h2>

              <Form method="post">
                <input
                  type="hidden"
                  name="lines"
                  value={JSON.stringify(
                    cartItems.map((item) => ({
                      merchandiseId: item.merchandiseId,
                      quantity: item.quantity,
                    })),
                  )}
                />

                <button
                  className="checkout-button"
                  type="submit"
                >
                  Checkout
                </button>
              </Form>

              {actionData?.checkoutUrl && (
                <a
                  href={actionData.checkoutUrl}
                  className="checkout-link"
                >
                  Continue to Checkout
                </a>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}