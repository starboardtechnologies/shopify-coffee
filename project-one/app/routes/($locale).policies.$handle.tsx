import type {Route} from "./+types/($locale).products.$handle";
import type {Product} from "~/types/product";

import {useState} from "react";
import {useCart} from "~/components/cart/CartContext";

import {coffeeProducts} from "~/data/coffeeProducts";
import {PRODUCT_QUERY} from "~/graphql/product";


/* ==================================================
   Shopify Product Type
================================================== */

type ShopifyProduct = {
  id: string;

  title: string;

  handle: string;

  description?: string;

  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;

  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };

  selectedOrFirstAvailableVariant?: {
    id: string;

    availableForSale: boolean;

    price: {
      amount: string;
      currencyCode: string;
    };
  } | null;
};


/* ==================================================
   Loader
================================================== */

export async function loader({
  params,
  context,
}: Route.LoaderArgs) {

  const {storefront} = context;


  /*
   * --------------------------------------------------
   * Try Shopify first
   * --------------------------------------------------
   */

  try {

    const data = await storefront.query(
      PRODUCT_QUERY,
      {
        variables: {
          handle: params.handle,
        },
      },
    );


    if (data.product) {

      const shopifyProduct =
        data.product as ShopifyProduct;


      /*
       * Find matching Java demo product.
       *
       * This gives Shopify products the same
       * coffee-specific information used throughout
       * the demo site.
       */

      const demoProduct =
        coffeeProducts.find(
          (item) =>
            item.handle === shopifyProduct.handle,
        );


      /*
       * ------------------------------------------------
       * Matching Java product
       * ------------------------------------------------
       */

      if (demoProduct) {

        const variant =
          shopifyProduct.selectedOrFirstAvailableVariant;


        const product: Product = {

          ...demoProduct,

          /*
           * Use the real Shopify product ID.
           */

          id:
            shopifyProduct.id,


          /*
           * Use the real Shopify variant ID.
           *
           * This is what Shopify needs when creating
           * the cart.
           */

          merchandiseId:
            variant?.id ??
            demoProduct.merchandiseId,


          title:
            shopifyProduct.title,


          handle:
            shopifyProduct.handle,


          image:
            shopifyProduct.featuredImage?.url ??
            demoProduct.image,


          /*
           * Prefer the actual selected variant price.
           */

          price:
            variant
              ? `$${variant.price.amount}`
              : `$${shopifyProduct.priceRange.minVariantPrice.amount}`,


          description:
            shopifyProduct.description ??
            demoProduct.notes,

        };


        return {
          product,
        };

      }


      /*
       * ------------------------------------------------
       * Shopify product without Java demo data
       * ------------------------------------------------
       *
       * Give it sensible defaults so it still conforms
       * to the Product type.
       */

      const variant =
        shopifyProduct.selectedOrFirstAvailableVariant;


      const product: Product = {

        id:
          shopifyProduct.id,


        merchandiseId:
          variant?.id ?? "",


        handle:
          shopifyProduct.handle,


        title:
          shopifyProduct.title,


        category:
          "Single Origin",


        image:
          shopifyProduct.featuredImage?.url ??
          "/images/blend-collection.jpg",


        price:
          variant
            ? `$${variant.price.amount}`
            : `$${shopifyProduct.priceRange.minVariantPrice.amount}`,


        origin:
          "Java",


        roast:
          "Medium Roast",


        notes:
          "Chocolate, caramel, toasted almond",


        weight:
          "12 oz",


        grind:
          "Whole Bean",


        intensity:
          3,


        featured:
          false,


        description:
          shopifyProduct.description ?? "",

      };


      return {
        product,
      };

    }

  } catch (error) {

    console.log(
      "Shopify product unavailable. Using demo product.",
      error,
    );

  }


  /*
   * --------------------------------------------------
   * Demo Product Fallback
   * --------------------------------------------------
   */

  const demoProduct =
    coffeeProducts.find(
      (item) =>
        item.handle === params.handle,
    );


  if (!demoProduct) {

    throw new Response(
      "Product Not Found",
      {
        status: 404,
      },
    );

  }


  const product: Product = {

    ...demoProduct,

    description:
      demoProduct.notes ?? "",

  };


  return {
    product,
  };

}


/* ==================================================
   Product Page
================================================== */

export default function ProductPage({
  loaderData,
}: Route.ComponentProps) {

  const product =
    loaderData.product;


  const {addToCart} =
    useCart();


  const [quantity, setQuantity] =
    useState(1);


  return (

    <main className="product-page">

      <div className="product-detail">


        {/* --------------------------------
            IMAGE
        -------------------------------- */}

        <div className="product-detail-image">

          <img
            src={product.image}
            alt={product.title}
          />

        </div>


        {/* --------------------------------
            INFORMATION
        -------------------------------- */}

        <div className="product-detail-info">


          <span className="product-card-roast">
            {product.roast}
          </span>


          <h1>
            {product.title}
          </h1>


          <p className="product-price">
            {product.price}
          </p>


          <p className="product-description">

            {product.description ||
              "Carefully roasted specialty coffee sourced from exceptional growing regions."}

          </p>


          {/* --------------------------------
              Coffee Details
          -------------------------------- */}

          <div className="product-meta">

            <div>

              <span>
                Origin
              </span>

              <strong>
                {product.origin}
              </strong>

            </div>


            <div>

              <span>
                Weight
              </span>

              <strong>
                {product.weight}
              </strong>

            </div>


            <div>

              <span>
                Grind
              </span>

              <strong>
                {product.grind}
              </strong>

            </div>

          </div>


          {/* --------------------------------
              Quantity
          -------------------------------- */}

          <div className="product-quantity">

            <button
              type="button"
              onClick={() =>
                setQuantity((q) =>
                  Math.max(1, q - 1),
                )
              }
              aria-label="Decrease quantity"
            >
              −
            </button>


            <span>
              {quantity}
            </span>


            <button
              type="button"
              onClick={() =>
                setQuantity((q) => q + 1)
              }
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>


          {/* --------------------------------
              Add To Cart
          -------------------------------- */}

          <button
            type="button"
            className="add-to-cart"
            disabled={
              product.merchandiseId === ""
            }
            onClick={() => {

              addToCart(
                product,
                quantity,
              );

            }}
          >
            {product.merchandiseId === ""
              ? "Unavailable"
              : "Add to Cart"}
          </button>


        </div>

      </div>

    </main>

  );
}