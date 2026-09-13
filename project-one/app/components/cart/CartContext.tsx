import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {Product} from "~/types/product";

/* ==================================================
   Cart Types
================================================== */

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (
    product: Product,
    quantity?: number,
  ) => void;

  removeFromCart: (
    id: string,
  ) => void;

  increaseQuantity: (
    id: string,
  ) => void;

  decreaseQuantity: (
    id: string,
  ) => void;

  clearCart: () => void;
}

/* ==================================================
   Storage
================================================== */

const CART_STORAGE_KEY =
  "java-cart-v2";

/* ==================================================
   Context
================================================== */

const CartContext =
  createContext<CartContextType | null>(
    null,
  );

/* ==================================================
   Provider
================================================== */

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cartItems, setCartItems] =
    useState<CartItem[]>(() => {
      if (
        typeof window === "undefined"
      ) {
        return [];
      }

      try {
        const savedCart =
          localStorage.getItem(
            CART_STORAGE_KEY,
          );

        if (!savedCart) {
          return [];
        }

        const parsedCart =
          JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
          return [];
        }

        return parsedCart as CartItem[];
      } catch (error) {
        console.error(
          "Failed to load Java cart:",
          error,
        );

        localStorage.removeItem(
          CART_STORAGE_KEY,
        );

        return [];
      }
    });

  /* ==================================================
     Save Cart
  ================================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems),
      );
    } catch (error) {
      console.error(
        "Failed to save Java cart:",
        error,
      );
    }
  }, [cartItems]);

  /* ==================================================
     Add To Cart
  ================================================== */

  function addToCart(
    product: Product,
    quantity = 1,
  ) {
    if (quantity <= 0) {
      return;
    }

    setCartItems((current) => {
      const existing =
        current.find(
          (item) =>
            item.id === product.id,
        );

      if (existing) {
        return current.map((item) => {
          if (
            item.id !== product.id
          ) {
            return item;
          }

          const updatedItem: CartItem = {
            id: item.id,
            merchandiseId:
              item.merchandiseId,
            handle: item.handle,
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price,
            origin: item.origin,
            roast: item.roast,
            notes: item.notes,
            weight: item.weight,
            grind: item.grind,
            intensity: item.intensity,
            featured: item.featured,
            description:
              item.description,
            quantity:
              item.quantity + quantity,
          };

          return updatedItem;
        });
      }

      const newItem: CartItem = {
        id: product.id,
        merchandiseId:
          product.merchandiseId,
        handle: product.handle,
        title: product.title,
        category: product.category,
        image: product.image,
        price: product.price,
        origin: product.origin,
        roast: product.roast,
        notes: product.notes,
        weight: product.weight,
        grind: product.grind,
        intensity: product.intensity,
        featured: product.featured,
        description:
          product.description,
        quantity,
      };

      return [
        ...current,
        newItem,
      ];
    });
  }

  /* ==================================================
     Increase Quantity
  ================================================== */

  function increaseQuantity(
    id: string,
  ) {
    setCartItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updatedItem: CartItem = {
          id: item.id,
          merchandiseId:
            item.merchandiseId,
          handle: item.handle,
          title: item.title,
          category: item.category,
          image: item.image,
          price: item.price,
          origin: item.origin,
          roast: item.roast,
          notes: item.notes,
          weight: item.weight,
          grind: item.grind,
          intensity: item.intensity,
          featured: item.featured,
          description:
            item.description,
          quantity:
            item.quantity + 1,
        };

        return updatedItem;
      }),
    );
  }

  /* ==================================================
     Decrease Quantity
  ================================================== */

  function decreaseQuantity(
    id: string,
  ) {
    setCartItems((current) =>
      current
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const updatedItem: CartItem = {
            id: item.id,
            merchandiseId:
              item.merchandiseId,
            handle: item.handle,
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price,
            origin: item.origin,
            roast: item.roast,
            notes: item.notes,
            weight: item.weight,
            grind: item.grind,
            intensity: item.intensity,
            featured: item.featured,
            description:
              item.description,
            quantity:
              item.quantity - 1,
          };

          return updatedItem;
        })
        .filter(
          (item) =>
            item.quantity > 0,
        ),
    );
  }

  /* ==================================================
     Remove From Cart
  ================================================== */

  function removeFromCart(
    id: string,
  ) {
    setCartItems((current) =>
      current.filter(
        (item) =>
          item.id !== id,
      ),
    );
  }

  /* ==================================================
     Clear Cart
  ================================================== */

  function clearCart() {
    setCartItems([]);
  }

  /* ==================================================
     Provider
  ================================================== */

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ==================================================
   Hook
================================================== */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}