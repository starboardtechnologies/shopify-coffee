import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {Product} from "~/types/product";


interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (
    product: Product,
    quantity?: number
  ) => void;

  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;
}
 
const CartContext =
  createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [cartItems, setCartItems] = useState<CartItem[]>(() => {

  if (typeof window === "undefined") {
    return [];
  }


  const savedCart =
    localStorage.getItem("roast-revel-cart");


  return savedCart
    ? (JSON.parse(savedCart) as CartItem[])
    : [];

});

useEffect(() => {

  localStorage.setItem(
    "roast-revel-cart",
    JSON.stringify(cartItems)
  );

}, [cartItems]);

useEffect(() => {
  try {
    const savedCart = localStorage.getItem("coffee-cart");

    if (savedCart) {
      const parsed = JSON.parse(savedCart) as CartItem[];
      setCartItems(parsed);
    }
  } catch (error) {
    console.error("Failed to load cart:", error);
    localStorage.removeItem("coffee-cart");
  }
}, []);

  const [
    checkoutUrl,
    setCheckoutUrl
  ] = useState<string | null>(null);



  function addToCart(
  product: Product,
  quantity = 1
) {

  setCartItems((current) => {

    const existing =
      current.find(
        (item) =>
          item.id === product.id
      );


    if (existing) {

      return current.map(
        (item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
              }
            : item
      );

    }


    return [
  ...current,
  {
    ...product,
    quantity,
  },
];

  });

}

  function increaseQuantity(id: string) {
  setCartItems((current) =>
    current.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    )
  );
}


function decreaseQuantity(id: string) {
  setCartItems((current) =>
    current
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
}



  function removeFromCart(
    id:string
  ) {

    setCartItems(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    );

  }




  return (

    <CartContext.Provider
      value={{
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  }}

    >

      {children}

    </CartContext.Provider>

  );

}




export function useCart(){

  const context =
    useContext(CartContext);


  if(!context){

    throw new Error(
      "useCart must be used inside CartProvider"
    );

  }


  return context;

}