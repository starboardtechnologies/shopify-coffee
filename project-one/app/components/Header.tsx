import {Link} from "react-router";
import {useState} from "react";

import {useCart} from "~/components/cart/CartContext";
import CartDrawer from "~/components/cart/CartDrawer";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  const {cartItems} = useCart();

  const itemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <>
      <header className="site-header">
        <nav className="navbar">

          <Link
            to="/"
            className="brand"
          >
            Java
          </Link>

          <div className="nav-links">

            <Link to="/collections">
              Shop
            </Link>

            <Link to="/story">
              Story
            </Link>

            <Link to="/subscribe">
              Subscribe
            </Link>

            <button
              className="cart-link"
              type="button"
              onClick={() => setCartOpen(true)}
            >
              Cart
              {itemCount > 0 && ` (${itemCount})`}
            </button>

          </div>

        </nav>
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}