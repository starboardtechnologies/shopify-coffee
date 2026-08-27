import ProductCard from "~/components/products/ProductCard";
import type {Product} from "~/types/product";

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  eyebrow?: string;
  description?: string;
  showHeading?: boolean;
}

export default function FeaturedProducts({
  products,
  title = "Featured Roasts",
  eyebrow = "OUR COFFEE",
  description =
    "Discover handcrafted coffees roasted in small batches.",
  showHeading = true,
}: FeaturedProductsProps) {

  /*
   * The component now displays exactly the
   * products passed into it.
   *
   * This is important because the homepage
   * category sections already select the
   * products we want to display.
   */

  return (
    <section className="featured-products">

      {showHeading && (

        <div className="section-heading">

          <span>
            {eyebrow}
          </span>

          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>

        </div>

      )}


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