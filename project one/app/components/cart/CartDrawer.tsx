import {Link} from "react-router";
import {useCart} from "~/components/cart/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {

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


  return (
    <>

      {/* --------------------------------
          Overlay
      -------------------------------- */}

      {open && (
        <div
          className="cart-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}


      {/* --------------------------------
          Drawer
      -------------------------------- */}

      <aside
        className={`cart-drawer ${
          open ? "open" : ""
        }`}
        aria-label="Shopping cart"
      >

        {/* --------------------------------
            Header
        -------------------------------- */}

        <div className="cart-drawer-header">

          <div>

            <span className="cart-drawer-label">
              JAVA
            </span>

            <h2>
              Your Cart
            </h2>

          </div>


          <button
            type="button"
            className="drawer-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>

        </div>


        {/* --------------------------------
            Empty Cart
        -------------------------------- */}

        {cartItems.length === 0 ? (

          <div className="cart-empty">

            <p>
              Your cart is empty.
            </p>

            <button
              type="button"
              className="cart-empty-link"
              onClick={onClose}
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <>

            {/* --------------------------------
                Items
            -------------------------------- */}

            <div className="drawer-items">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="drawer-item"
                >

                  {/* Image */}

                  <div className="drawer-item-image">

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                  </div>


                  {/* Information */}

                  <div className="drawer-item-info">

                    <h3>
                      {item.title}
                    </h3>


                    <p className="drawer-item-price">
                      {item.price}
                    </p>


                    {/* Quantity */}

                    <div className="quantity-controls">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        aria-label={`Decrease quantity of ${item.title}`}
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
                        aria-label={`Increase quantity of ${item.title}`}
                      >
                        +
                      </button>

                    </div>


                    {/* Remove */}

                    <button
                      type="button"
                      className="remove-item"
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


            {/* --------------------------------
                Footer
            -------------------------------- */}

            <div className="drawer-footer">

              <div className="drawer-total">

                <span>
                  Subtotal
                </span>

                <strong>
                  ${total.toFixed(2)}
                </strong>

              </div>


              <p className="drawer-note">
                Shipping and taxes calculated at checkout.
              </p>


              <Link
                to="/cart"
                className="checkout-button"
                onClick={onClose}
              >
                Checkout
              </Link>


              <Link
                to="/cart"
                className="view-cart"
                onClick={onClose}
              >
                View Cart
              </Link>

            </div>

          </>

        )}

      </aside>

    </>
  );
}