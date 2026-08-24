import type {Route} from "./+types/($locale).products.$handle";

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


  try {


    const data =
      await storefront.query(
        PRODUCT_QUERY,
        {
          variables: {
            handle: params.handle,
          },
        },
      );



    if(data.product) {


      const product =
        data.product as ShopifyProduct;



      return {

        product: {

          id:
            product.id,


          merchandiseId:
            product.variants.nodes[0]?.id ?? "",


          title:
            product.title,


          handle:
            product.handle,


          image:
            product.featuredImage?.url ??
            "/images/blend-collection.jpg",


          price:
            `$${product.priceRange.minVariantPrice.amount}`,


          description:
            product.description ?? "",

        },

      };

    }


  } catch(error) {

    console.log(
      "Shopify product unavailable. Using demo product.",
      error,
    );

  }



  const demoProduct =
    coffeeProducts.find(
      (item) =>
        item.handle === params.handle
    );



  if(!demoProduct) {

    throw new Response(
      "Product Not Found",
      {
        status:404,
      }
    );

  }



  return {
  product: {
    ...demoProduct,
    description:
      demoProduct.notes ?? "",
  },
};

}


export default function ProductPage({
  loaderData,
}: Route.ComponentProps) {

  const product = loaderData.product;

  const {addToCart} = useCart();

  const [quantity, setQuantity] = useState(1);


  return (

    <main className="product-page">


      <div className="product-detail">


        <div className="product-detail-image">

          <img
            src={product.image}
            alt={product.title}
          />

        </div>



        <div className="product-detail-info">


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

<div className="product-quantity">

  <button
    onClick={() =>
      setQuantity((q) =>
        Math.max(1, q - 1)
      )
    }
  >
    −
  </button>


  <span>
    {quantity}
  </span>


  <button
    onClick={() =>
      setQuantity((q) => q + 1)
    }
  >
    +
  </button>

</div>

<button
  className="add-to-cart"
  onClick={() => {

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

  }}
>
  Add to Cart
</button>
          
        </div>


      </div>


    </main>

  );

}