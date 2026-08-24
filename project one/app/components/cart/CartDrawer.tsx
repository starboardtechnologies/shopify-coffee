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
    0
  );


  return (
    <>

      {open && (
        <div
          className="cart-overlay"
          onClick={onClose}
        />
      )}



      <aside
        className={`cart-drawer ${
          open ? "open" : ""
        }`}
      >


        <div className="cart-drawer-header">

          <h2>
            Your Cart
          </h2>


          <button
            className="drawer-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>



        {cartItems.length === 0 ? (

          <p>
            Your cart is empty.
          </p>


        ) : (

          <>


            <div className="drawer-items">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="drawer-item"
                >

                  <img
                    src={item.image}
                    alt={item.title}
                  />



                  <div>

                    <h3>
                      {item.title}
                    </h3>


                    <div className="product-quantity">

  <button
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
    onClick={() =>
      increaseQuantity(item.id)
    }
  >
    +
  </button>

</div>


<p>
  {item.price} × {item.quantity}
</p>


<button
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




            <div className="drawer-footer">


              <h3>
                Total ${total.toFixed(2)}
              </h3>



              <Link
                to="/cart"
                className="view-cart"
                onClick={onClose}
              >
                View Cart
              </Link>



              <Link
                to="/cart"
                className="checkout-button"
                onClick={onClose}
              >
                Checkout
              </Link>


            </div>


          </>

        )}


      </aside>


    </>
  );
}