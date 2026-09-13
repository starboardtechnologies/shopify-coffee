import type {Product} from "~/types/product";

/*
 * ==================================================
 * JAVA DEMO COFFEE CATALOG
 * ==================================================
 *
 * 3 Categories
 * 3 Roast Levels
 * 9 Origins
 *
 * 3 × 3 × 9 = 81 products
 *
 * Every possible filter combination exists.
 * ==================================================
 */


const origins = [
  {
    name: "Ethiopia",
    notes: {
      "Light Roast": "Blueberry, jasmine, citrus",
      "Medium Roast": "Peach, honey, cocoa",
      "Dark Roast": "Dark berry, cacao, brown sugar",
    },
  },

  {
    name: "Colombia",
    notes: {
      "Light Roast": "Red berry, orange, cane sugar",
      "Medium Roast": "Brown sugar, orange, cocoa",
      "Dark Roast": "Dark chocolate, cherry, caramel",
    },
  },

  {
    name: "Guatemala",
    notes: {
      "Light Roast": "Honey, apple, milk chocolate",
      "Medium Roast": "Caramel, plum, cocoa",
      "Dark Roast": "Dark chocolate, raisin, toasted almond",
    },
  },

  {
    name: "Indonesia",
    notes: {
      "Light Roast": "Citrus, herbs, brown sugar",
      "Medium Roast": "Cedar, cocoa, molasses",
      "Dark Roast": "Earthy spice, dark chocolate, cedar",
    },
  },

  {
    name: "Italy",
    notes: {
      "Light Roast": "Citrus, almond, cocoa",
      "Medium Roast": "Caramel, hazelnut, milk chocolate",
      "Dark Roast": "Dark chocolate, molasses, roasted hazelnut",
    },
  },

  {
    name: "Costa Rica",
    notes: {
      "Light Roast": "Orange, honey, vanilla",
      "Medium Roast": "Caramel, citrus, almond",
      "Dark Roast": "Cocoa, brown sugar, toasted walnut",
    },
  },

  {
    name: "Brazil",
    notes: {
      "Light Roast": "Honey, citrus, almond",
      "Medium Roast": "Milk chocolate, hazelnut, brown sugar",
      "Dark Roast": "Dark cocoa, walnut, molasses",
    },
  },

  {
    name: "Kenya",
    notes: {
      "Light Roast": "Blackcurrant, grapefruit, honey",
      "Medium Roast": "Berry, citrus, caramel",
      "Dark Roast": "Blackcurrant, cocoa, dark caramel",
    },
  },

  {
    name: "Blend",
    notes: {
      "Light Roast": "Citrus, honey, toasted grain",
      "Medium Roast": "Chocolate, caramel, toasted almond",
      "Dark Roast": "Dark chocolate, molasses, walnut",
    },
  },
] as const;


/*
 * ==================================================
 * ROAST INFORMATION
 * ==================================================
 */

const roastInfo = {
  "Light Roast": {
    intensity: 2,
    prefix: "Bright",
  },

  "Medium Roast": {
    intensity: 3,
    prefix: "Balanced",
  },

  "Dark Roast": {
    intensity: 5,
    prefix: "Bold",
  },
} as const;


/*
 * ==================================================
 * CATEGORY INFORMATION
 * ==================================================
 */

const categories = [
  "Espresso",
  "Single Origin",
  "Blend",
] as const;

const roasts = [
  "Light Roast",
  "Medium Roast",
  "Dark Roast",
] as const;


/*
 * ==================================================
 * IMAGE BY CATEGORY
 * ==================================================
 */

const categoryImages = {
  Espresso: "/images/espresso-collection.jpg",
  "Single Origin": "/images/singleorigin-collection.jpg",
  Blend: "/images/blend-collection.jpg",
} as const;


/*
 * ==================================================
 * PRICE BY CATEGORY / ROAST
 * ==================================================
 */

const prices = {
  Espresso: {
    "Light Roast": "$19.00",
    "Medium Roast": "$20.00",
    "Dark Roast": "$21.00",
  },

  "Single Origin": {
    "Light Roast": "$17.00",
    "Medium Roast": "$19.00",
    "Dark Roast": "$21.00",
  },

  Blend: {
    "Light Roast": "$15.00",
    "Medium Roast": "$16.00",
    "Dark Roast": "$18.00",
  },
} as const;


/*
 * ==================================================
 * PRODUCT DESCRIPTION
 * ==================================================
 */

function createDescription(
  category: string,
  origin: string,
  roast: string,
  notes: string,
) {
  if (category === "Espresso") {
    return `${roast} espresso from ${origin} with notes of ${notes.toLowerCase()}. Developed for a rich, balanced extraction with excellent body and a lingering finish.`;
  }

  if (category === "Blend") {
    return `A carefully developed ${roast.toLowerCase()} blend featuring coffee from ${origin}. Expect a balanced cup with notes of ${notes.toLowerCase()} and a smooth, satisfying finish.`;
  }

  return `A ${roast.toLowerCase()} single-origin coffee from ${origin}, carefully roasted to highlight its distinctive character. Expect notes of ${notes.toLowerCase()} with a clean and expressive finish.`;
}


/*
 * ==================================================
 * PRODUCT NAME
 * ==================================================
 */

function createTitle(
  category: string,
  origin: string,
  roast: string,
) {

  if (category === "Espresso") {

    if (origin === "Italy") {
      return `Italian ${roast.replace(
        " Roast",
        "",
      )} Espresso`;
    }

    return `${origin} ${roast.replace(
      " Roast",
      "",
    )} Espresso`;
  }


  if (category === "Blend") {

    if (origin === "Blend") {
      return `Java ${roast.replace(
        " Roast",
        "",
      )} Blend`;
    }

    return `${origin} ${roast.replace(
      " Roast",
      "",
    )} Blend`;
  }


  return `${origin} ${roast.replace(
    " Roast",
    "",
  )}`;
}


/*
 * ==================================================
 * HANDLE
 * ==================================================
 */

function createHandle(
  category: string,
  origin: string,
  roast: string,
) {

  return [
    origin,
    roast.replace(" Roast", ""),
    category,
  ]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}


/*
 * ==================================================
 * CREATE COMPLETE CATALOG
 * ==================================================
 */

export const coffeeProducts: Product[] =
  origins.flatMap(
    (origin, originIndex) =>
      categories.flatMap(
        (category, categoryIndex) =>
          roasts.map(
            (roast, roastIndex) => {

              const notes =
                origin.notes[roast];

              const title =
                createTitle(
                  category,
                  origin.name,
                  roast,
                );

              const handle =
                createHandle(
                  category,
                  origin.name,
                  roast,
                );

              const intensity =
                roastInfo[roast].intensity;

              const description =
                createDescription(
                  category,
                  origin.name,
                  roast,
                  notes,
                );

              const id =
                String(
                  originIndex * 9 +
                  categoryIndex * 3 +
                  roastIndex +
                  1,
                );

              return {

                id,

                merchandiseId:
                  `java-${handle}`,

                handle,

                title,

                category,

                image:
                  categoryImages[
                    category
                  ],

                price:
                  prices[
                    category
                  ][roast],

                origin:
                  origin.name,

                roast,

                notes,

                weight:
                  "12 oz",

                grind:
                  "Whole Bean",

                intensity,

                /*
                 * Mark a useful selection of
                 * products as featured.
                 *
                 * This gives the homepage
                 * something to display while
                 * still allowing the collection
                 * page to show everything.
                 */
                featured:
                  roast === "Medium Roast" ||
                  (
                    category === "Espresso" &&
                    roast === "Dark Roast"
                  ),

                description,

              };

            },
          ),
      ),
  );