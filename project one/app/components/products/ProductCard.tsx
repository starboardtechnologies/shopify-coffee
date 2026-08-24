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

          <h3>
            {product.title}
          </h3>

          <p>
            {product.price}
          </p>

        </div>

      </Link>

    </article>
  );
}