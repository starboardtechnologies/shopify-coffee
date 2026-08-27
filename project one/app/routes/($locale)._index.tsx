import type {Route} from "./+types/($locale)._index";

import Hero from "~/components/home/Hero";
import FeaturedCollections from "~/components/home/FeaturedCollections";
import Story from "~/components/home/Story";
import CoffeeCategories from "~/components/home/CoffeeCategories";

export async function loader() {
  return {};
}

export default function Homepage() {
  return (
    <main>
      <Hero />

      <FeaturedCollections />

      <Story />

      <CoffeeCategories />
    </main>
  );
}