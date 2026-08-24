import ProductCard from "~/components/products/ProductCard";
import type {Product} from "~/types/product";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({
  products,
}: FeaturedProductsProps) {
  return (
    <section className="featured-products">

      <div className="section-heading">
        <span>OUR COFFEE</span>

        <h2>
          Featured Roasts
        </h2>

        <p>
          Discover handcrafted coffees roasted in small batches.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}