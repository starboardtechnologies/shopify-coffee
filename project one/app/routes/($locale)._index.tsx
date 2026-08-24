import type {Route} from "./+types/($locale)._index";

import Hero from "~/components/home/Hero";
import FeaturedCollections from "~/components/home/FeaturedCollections";
import Story from "~/components/home/Story";
import FeaturedProducts from "~/components/home/FeaturedProducts";

import {coffeeProducts} from "~/data/coffeeProducts";

export async function loader() {
  return {};
}

export default function Homepage() {

  return (
    <main>
      <Hero />

      <FeaturedCollections />

      <Story />

      <FeaturedProducts
        products={coffeeProducts}
      />

    </main>
  );
}