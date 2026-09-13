import type {Route} from "./+types/($locale).cart";
import {Link} from "react-router";

import {useCart} from "~/components/cart/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price.replace("$", "")) *
        item.quantity,
    0,
  );

  const itemCount = cartItems.reduce(
    (sum, item) =>
      sum + item.quantity,
    0,
  );

  return (
    <main className="cart-page">

      <section className="cart-container">

        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <header className="cart-header">

          <span className="cart-eyebrow">
            JAVA
          </span>

          <h1>
            Your Cart
          </h1>

          {cartItems.length > 0 && (
            <p>
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}
            </p>
          )}

        </header>


        {/* --------------------------------
            EMPTY CART
        -------------------------------- */}

        {cartItems.length === 0 ? (

          <div className="cart-empty">

            <div className="cart-empty-icon">
              ☕
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Discover something exceptional
              for your next cup.
            </p>

            <Link
              to="/collections"
              className="cart-shop-button"
            >
              Shop Coffee
            </Link>

          </div>

        ) : (

          <>

            {/* --------------------------------
                CART ITEMS
            -------------------------------- */}

            <div className="cart-items">

              {cartItems.map((item) => (

                <article
                  key={item.id}
                  className="cart-item"
                >

                  <div className="cart-item-image">

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                  </div>


                  <div className="cart-item-info">

                    <div className="cart-item-main">

                      <h2>
                        {item.title}
                      </h2>

                      <p className="cart-item-price">
                        {item.price}
                      </p>

                    </div>


                    <div className="cart-item-bottom">

                      <div className="product-quantity">

                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.title}`}
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                            )
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.title}`}
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                            )
                          }
                        >
                          +
                        </button>

                      </div>


                      <p className="cart-item-total">

                        $
                        {(
                          Number(
                            item.price.replace(
                              "$",
                              "",
                            ),
                          ) *
                          item.quantity
                        ).toFixed(2)}

                      </p>

                    </div>


                    <button
                      className="remove-item"
                      type="button"
                      onClick={() =>
                        removeFromCart(
                          item.id,
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                </article>

              ))}

            </div>


            {/* --------------------------------
                SUMMARY
            -------------------------------- */}

            <div className="cart-summary">

              <div className="cart-summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ${total.toFixed(2)}
                </strong>

              </div>


              <p className="cart-summary-note">
                Shipping and taxes calculated
                at checkout.
              </p>


              {/* --------------------------------
                  DEMO CHECKOUT
              -------------------------------- */}

              <Link
                to="/checkout"
                className="checkout-button"
              >
                Checkout
              </Link>


              <Link
                to="/collections"
                className="continue-shopping"
              >
                ← Continue Shopping
              </Link>

            </div>

          </>

        )}

      </section>

    </main>
  );
}