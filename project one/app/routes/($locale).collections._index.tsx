import {useState} from "react";
import type {Route} from "./+types/($locale).collections._index";

import {coffeeProducts} from "~/data/coffeeProducts";
import ProductCard from "~/components/products/ProductCard";
import FilterBar from "~/components/products/FilterBar";


export async function loader({
  context,
}: Route.LoaderArgs) {

  return {
    products: coffeeProducts,
  };

}


export default function CollectionsPage({
  loaderData,
}: Route.ComponentProps) {

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [roast, setRoast] =
    useState("All");

  const [origin, setOrigin] =
    useState("All");

  const [sort, setSort] =
    useState("featured");


  /*
   * ==================================================
   * FILTER PRODUCTS
   * ==================================================
   */

  let filteredProducts =
    loaderData.products

      .filter((product) =>
        product.title
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          )
      )

      .filter((product) =>
        category === "All"
          ? true
          : product.category === category
      )

      .filter((product) =>
        roast === "All"
          ? true
          : product.roast === roast
      )

      .filter((product) =>
        origin === "All"
          ? true
          : product.origin === origin
      );


  /*
   * ==================================================
   * SORT
   * ==================================================
   */

  if (sort === "featured") {

    filteredProducts =
      filteredProducts
        .filter(
          (product) =>
            product.featured
        );

  }


  if (sort === "low") {

    filteredProducts =
      [...filteredProducts].sort(
        (a, b) =>
          Number(
            a.price.replace("$", ""),
          ) -
          Number(
            b.price.replace("$", ""),
          ),
      );

  }


  if (sort === "high") {

    filteredProducts =
      [...filteredProducts].sort(
        (a, b) =>
          Number(
            b.price.replace("$", ""),
          ) -
          Number(
            a.price.replace("$", ""),
          ),
      );

  }


  /*
   * ==================================================
   * RESULTS COUNT
   * ==================================================
   */

  const resultCount =
    filteredProducts.length;


  return (

    <main className="collections-page">


      {/* ==============================================
          HEADER
      ============================================== */}

      <section className="collections-hero">

        <span>
          JAVA
        </span>

        <h1>
          Coffee Collection
        </h1>

        <p>
          Discover handcrafted specialty
          coffees sourced from exceptional
          farms around the world.
        </p>

      </section>


      {/* ==============================================
          CONTROLS
      ============================================== */}

      <div className="collections-controls">

        <input
          className="product-search"
          type="search"
          placeholder="Search coffees..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <FilterBar
          category={category}
          roast={roast}
          origin={origin}
          sort={sort}

          onCategoryChange={
            setCategory
          }

          onRoastChange={
            setRoast
          }

          onOriginChange={
            setOrigin
          }

          onSortChange={
            setSort
          }
        />

      </div>


      {/* ==============================================
          RESULTS
      ============================================== */}

      <div className="collection-results-header">

        <span>
          {resultCount}{" "}
          {resultCount === 1
            ? "coffee"
            : "coffees"}
        </span>

      </div>


      {/* ==============================================
          PRODUCT GRID
      ============================================== */}

      <section className="product-grid">

        {filteredProducts.length > 0 ? (

          filteredProducts.map(
            (product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ),
          )

        ) : (

          <div className="no-products">

            <h2>
              No coffees found
            </h2>

            <p>
              Try adjusting your filters
              or search for another coffee.
            </p>

          </div>

        )}

      </section>

    </main>

  );

}