import type {Route} from "./+types/($locale).products.$handle";
import type {Product} from "~/types/product";

import {useState} from "react";
import {useCart} from "~/components/cart/CartContext";

import {coffeeProducts} from "~/data/coffeeProducts";
import {PRODUCT_QUERY} from "~/graphql/product";


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

  variants: {
    nodes: {
      id: string;
    }[];
  };
};


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
       * Find matching demo product.
       *
       * This lets the Shopify product use the same
       * Product structure as the rest of the site.
       */

      const demoProduct =
        coffeeProducts.find(
          (item) =>
            item.handle === shopifyProduct.handle,
        );


      /*
       * If a matching demo product exists,
       * preserve its coffee-specific information.
       */

      if (demoProduct) {

        const product: Product = {

          ...demoProduct,

          id: shopifyProduct.id,

          merchandiseId:
            shopifyProduct.variants.nodes[0]?.id ??
            demoProduct.merchandiseId,

          title:
            shopifyProduct.title,

          handle:
            shopifyProduct.handle,

          image:
            shopifyProduct.featuredImage?.url ??
            demoProduct.image,

          price:
            `$${shopifyProduct.priceRange.minVariantPrice.amount}`,

          description:
            shopifyProduct.description ??
            demoProduct.notes,

        };


        return {
          product,
        };

      }


      /*
       * --------------------------------------------------
       * Shopify product without matching demo data
       * --------------------------------------------------
       *
       * Give it sensible Java defaults so it still
       * conforms to Product.
       */

      const product: Product = {

        id: shopifyProduct.id,

        merchandiseId:
          shopifyProduct.variants.nodes[0]?.id ?? "",

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
          `$${shopifyProduct.priceRange.minVariantPrice.amount}`,

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


/*
 * --------------------------------------------------
 * Product Page
 * --------------------------------------------------
 */

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
              <span>Origin</span>
              <strong>
                {product.origin}
              </strong>
            </div>

            <div>
              <span>Weight</span>
              <strong>
                {product.weight}
              </strong>
            </div>

            <div>
              <span>Grind</span>
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
  disabled={!product.merchandiseId}
  onClick={() => {

    if (!product.merchandiseId) {
      return;
    }

    addToCart(
      product,
      quantity,
    );

  }}
>
  {product.merchandiseId
    ? "Add to Cart"
    : "Unavailable"}
</button>

        </div>

      </div>

    </main>

  );
}