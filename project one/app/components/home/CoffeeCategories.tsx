import {Link} from "react-router";

import {coffeeProducts} from "~/data/coffeeProducts";

import ProductCard from "~/components/products/ProductCard";

export default function CoffeeCategories() {

  const espressoProducts =
    coffeeProducts
      .filter(
        (product) =>
          product.category === "Espresso",
      )
      .slice(0, 3);

  const singleOriginProducts =
    coffeeProducts
      .filter(
        (product) =>
          product.category === "Single Origin",
      )
      .slice(0, 3);

  const blendProducts =
    coffeeProducts
      .filter(
        (product) =>
          product.category === "Blend",
      )
      .slice(0, 3);


  return (
    <section className="java-home-categories">

      {/* ==========================================
          ESPRESSO
      ========================================== */}

      <section className="java-home-category">

        <header className="java-home-category-header">

          <div>

            <span className="java-home-category-label">
              ESPRESSO
            </span>

            <h2>
              Rich &amp; Bold
            </h2>

            <p>
              Concentrated coffees crafted
              for espresso.
            </p>

          </div>

          <Link
            to="/collections/espresso"
            className="java-home-category-link"
          >
            View Espresso →
          </Link>

        </header>


        <div className="java-home-product-grid">

          {espressoProducts.map(
            (product) => (
              <div
                className="java-home-product"
                key={product.id}
              >
                <ProductCard
                  product={product}
                />
              </div>
            ),
          )}

        </div>

      </section>


      {/* ==========================================
          SINGLE ORIGIN
      ========================================== */}

      <section className="java-home-category">

        <header className="java-home-category-header">

          <div>

            <span className="java-home-category-label">
              SINGLE ORIGIN
            </span>

            <h2>
              From Around the World
            </h2>

            <p>
              Distinct coffees shaped by
              where they're grown.
            </p>

          </div>

          <Link
            to="/collections/single-origin"
            className="java-home-category-link"
          >
            View Single Origin →
          </Link>

        </header>


        <div className="java-home-product-grid">

          {singleOriginProducts.map(
            (product) => (
              <div
                className="java-home-product"
                key={product.id}
              >
                <ProductCard
                  product={product}
                />
              </div>
            ),
          )}

        </div>

      </section>


      {/* ==========================================
          BLENDS
      ========================================== */}

      <section className="java-home-category">

        <header className="java-home-category-header">

          <div>

            <span className="java-home-category-label">
              BLENDS
            </span>

            <h2>
              Crafted for Balance
            </h2>

            <p>
              Carefully developed coffees
              for everyday drinking.
            </p>

          </div>

          <Link
            to="/collections/blend"
            className="java-home-category-link"
          >
            View Blends →
          </Link>

        </header>


        <div className="java-home-product-grid">

          {blendProducts.map(
            (product) => (
              <div
                className="java-home-product"
                key={product.id}
              >
                <ProductCard
                  product={product}
                />
              </div>
            ),
          )}

        </div>

      </section>

    </section>
  );
}