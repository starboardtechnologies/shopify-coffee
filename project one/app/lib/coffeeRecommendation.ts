import type {Product} from "~/types/product";

type CoffeePreferences = {
  roast?: string;
  flavor?: string;
  intensity?: string;
  origin?: string;
  category?: string;
};

type ScoredCoffee = {
  product: Product;
  score: number;
  reasons: string[];
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

/*
 * ==================================================
 * FLAVOR KEYWORDS
 * ==================================================
 */

const flavorKeywords: Record<
  string,
  string[]
> = {
  chocolate: [
    "chocolate",
    "cocoa",
    "cacao",
    "dark chocolate",
    "milk chocolate",
  ],

  fruity: [
    "berry",
    "blueberry",
    "cherry",
    "peach",
    "apple",
    "grapefruit",
    "blackcurrant",
    "fruit",
  ],

  nutty: [
    "almond",
    "hazelnut",
    "walnut",
    "nutty",
  ],

  sweet: [
    "honey",
    "caramel",
    "brown sugar",
    "molasses",
    "cane sugar",
    "sweet",
  ],

  citrusy: [
    "citrus",
    "orange",
    "grapefruit",
    "lemon",
  ],
};

/*
 * ==================================================
 * ROAST SCORE
 * ==================================================
 */

function roastScore(
  productRoast: string,
  preference?: string,
) {
  if (!preference) {
    return 0;
  }

  const product =
    normalize(productRoast);

  const wanted =
    normalize(preference);

  if (
    wanted.includes("dark") &&
    product.includes("dark")
  ) {
    return 30;
  }

  if (
    wanted.includes("medium") &&
    product.includes("medium")
  ) {
    return 30;
  }

  if (
    wanted.includes("light") &&
    product.includes("light")
  ) {
    return 30;
  }

  return 0;
}

/*
 * ==================================================
 * INTENSITY SCORE
 * ==================================================
 */

function intensityScore(
  intensity: number,
  preference?: string,
) {
  if (!preference) {
    return 0;
  }

  const wanted =
    normalize(preference);

  if (wanted === "mild") {
    return intensity <= 2 ? 20 : 0;
  }

  if (wanted === "balanced") {
    return intensity === 3 ? 20 : 0;
  }

  if (wanted === "strong") {
    return intensity >= 4 ? 20 : 0;
  }

  return 0;
}

/*
 * ==================================================
 * FLAVOR SCORE
 * ==================================================
 */

function flavorScore(
  notes: string,
  preference?: string,
) {
  if (!preference) {
    return {
      score: 0,
      matched: [],
    };
  }

  const wanted =
    normalize(preference);

  const keywords =
    flavorKeywords[wanted] ?? [];

  const normalizedNotes =
    normalize(notes);

  const matched =
    keywords.filter((keyword) =>
      normalizedNotes.includes(
        keyword,
      ),
    );

  return {
    score: Math.min(
      matched.length * 15,
      30,
    ),
    matched,
  };
}

/*
 * ==================================================
 * ORIGIN SCORE
 * ==================================================
 */

function originScore(
  productOrigin: string,
  preference?: string,
) {
  if (!preference) {
    return 0;
  }

  const wanted =
    normalize(preference);

  if (
    wanted === "no preference"
  ) {
    return 0;
  }

  return normalize(
    productOrigin,
  ) === wanted
    ? 15
    : 0;
}

/*
 * ==================================================
 * CATEGORY SCORE
 * ==================================================
 */

function categoryScore(
  productCategory: string,
  preference?: string,
) {
  if (!preference) {
    return 0;
  }

  return normalize(
    productCategory,
  ) === normalize(preference)
    ? 10
    : 0;
}

/*
 * ==================================================
 * SCORE ONE COFFEE
 * ==================================================
 */

export function scoreCoffee(
  product: Product,
  preferences: CoffeePreferences,
): ScoredCoffee {
  const reasons: string[] = [];

  let score = 0;

  /*
   * Roast
   */

  const roastPoints =
    roastScore(
      product.roast,
      preferences.roast,
    );

  score += roastPoints;

  if (roastPoints > 0) {
    reasons.push(
      `${product.roast}`,
    );
  }

  /*
   * Intensity
   */

  const intensityPoints =
    intensityScore(
      product.intensity,
      preferences.intensity,
    );

  score += intensityPoints;

  if (intensityPoints > 0) {
    reasons.push(
      "matches your preferred intensity",
    );
  }

  /*
   * Flavor
   */

  const flavor =
    flavorScore(
      product.notes,
      preferences.flavor,
    );

  score += flavor.score;

  if (flavor.matched.length > 0) {
    reasons.push(
      `notes of ${flavor.matched.join(", ")}`,
    );
  }

  /*
   * Origin
   */

  const originPoints =
    originScore(
      product.origin,
      preferences.origin,
    );

  score += originPoints;

  if (originPoints > 0) {
    reasons.push(
      `from ${product.origin}`,
    );
  }

  /*
   * Category
   */

  const categoryPoints =
    categoryScore(
      product.category,
      preferences.category,
    );

  score += categoryPoints;

  return {
    product,
    score,
    reasons,
  };
}

/*
 * ==================================================
 * RECOMMEND COFFEES
 * ==================================================
 */

export function recommendCoffees(
  products: Product[],
  preferences: CoffeePreferences,
) {
  return products
    .map((product) =>
      scoreCoffee(
        product,
        preferences,
      ),
    )
    .sort(
      (a, b) =>
        b.score - a.score,
    );
}