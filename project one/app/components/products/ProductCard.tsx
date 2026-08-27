import {Link} from "react-router";
import type {Product} from "~/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {

  return (
    <article className="product-card">

      <Link
        to={`/products/${product.handle}`}
        className="product-card-link"
      >

        <div className="product-card-image">

          <img
            src={product.image}
            alt={product.title}
          />

        </div>


        <div className="product-card-info">

          {product.featured && (
            <span className="product-card-featured">
              Featured
            </span>
          )}


          <h3>
            {product.title}
          </h3>


          <p className="product-card-origin">
            {product.origin}
          </p>


          <p className="product-card-roast">
            {product.roast}
          </p>


          <p className="product-card-notes">
            {product.notes}
          </p>


          <div className="product-card-bottom">

            <span className="product-card-price">
              {product.price}
            </span>

            <span className="product-card-view">
              View Coffee →
            </span>

          </div>

        </div>

      </Link>

    </article>
  );
}