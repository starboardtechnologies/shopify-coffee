import {useState} from "react";
import type {Route} from "./+types/($locale).collections._index";

import {coffeeProducts} from "~/data/coffeeProducts";
import ProductCard from "~/components/products/ProductCard";
import FilterBar from "~/components/products/FilterBar";

export async function loader({context}: Route.LoaderArgs) {
  return {
    products: coffeeProducts,
  };
}

export default function CollectionsPage({
  loaderData,
}: Route.ComponentProps) {

  const [search, setSearch] = useState("");


  const [roast, setRoast] = useState("All");
  const [origin, setOrigin] = useState("All");
  const [sort, setSort] = useState("featured");
  

  const filteredProducts =
  loaderData.products

    .filter((product) =>
      product.title
        .toLowerCase()
        .includes(search.toLowerCase())
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
    )

    .slice();

  if (sort === "low") {
    filteredProducts.sort(
      (a, b) =>
        Number(a.price.replace("$", "")) -
        Number(b.price.replace("$", ""))
    );
  }

  if (sort === "high") {
    filteredProducts.sort(
      (a, b) =>
        Number(b.price.replace("$", "")) -
        Number(a.price.replace("$", ""))
    );
  }

  return (
    <main className="collections-page">

  <section className="collections-hero">
    ...
  </section>


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
    roast={roast}
    origin={origin}
    sort={sort}
    onRoastChange={setRoast}
    onOriginChange={setOrigin}
    onSortChange={setSort}
  />


  <section className="collections-grid">

    {filteredProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
      />
    ))}

  </section>

</main>
  );
}