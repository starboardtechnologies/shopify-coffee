import type {ActionFunctionArgs} from "react-router";

import {coffeeProducts} from "~/data/coffeeProducts";


type AIRequest = {
  query?: string;
};


type Recommendation = {
  id: string;
  title: string;
  handle: string;
  category: string;
  origin: string;
  roast: string;
  notes: string;
  intensity: number;
  price: string;
  image: string;
  description?: string;
  score: number;
};


function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
}


function scoreCoffee(
  product: (typeof coffeeProducts)[number],
  query: string,
) {

  const text = normalize(query);

  let score = 0;


  /*
   * ================================================
   * ROAST
   * ================================================
   */

  if (
    (
      text.includes("light") ||
      text.includes("bright")
    ) &&
    product.roast === "Light Roast"
  ) {
    score += 5;
  }


  if (
    (
      text.includes("medium") ||
      text.includes("balanced")
    ) &&
    product.roast === "Medium Roast"
  ) {
    score += 5;
  }


  if (
    (
      text.includes("dark") ||
      text.includes("bold") ||
      text.includes("strong")
    ) &&
    product.roast === "Dark Roast"
  ) {
    score += 5;
  }


  /*
   * ================================================
   * CATEGORY
   * ================================================
   */

  if (
    text.includes("espresso") &&
    product.category === "Espresso"
  ) {
    score += 6;
  }


  if (
    text.includes("blend") &&
    product.category === "Blend"
  ) {
    score += 6;
  }


  if (
    (
      text.includes("single origin") ||
      text.includes("single-origin")
    ) &&
    product.category === "Single Origin"
  ) {
    score += 6;
  }


  /*
   * ================================================
   * ORIGIN
   * ================================================
   */

  const origin =
    normalize(product.origin);


  if (
    text.includes(origin)
  ) {
    score += 7;
  }


  /*
   * ================================================
   * FLAVOR NOTES
   * ================================================
   */

  const notes =
    normalize(product.notes);


  const flavorWords = [

    "blueberry",

    "jasmine",

    "citrus",

    "peach",

    "honey",

    "cocoa",

    "berry",

    "orange",

    "sugar",

    "chocolate",

    "cherry",

    "caramel",

    "apple",

    "plum",

    "raisin",

    "almond",

    "cedar",

    "molasses",

    "spice",

    "hazelnut",

    "vanilla",

    "walnut",

    "blackcurrant",

    "grapefruit",

    "earthy",

    "herbs",

    "toasted",

    "grain",

  ];


  for (
    const flavor of flavorWords
  ) {

    if (
      text.includes(flavor) &&
      notes.includes(flavor)
    ) {

      score += 4;

    }

  }


  /*
   * ================================================
   * INTENSITY
   * ================================================
   */

  if (
    (
      text.includes("mild") ||
      text.includes("delicate") ||
      text.includes("light")
    ) &&
    product.intensity <= 2
  ) {

    score += 4;

  }


  if (
    (
      text.includes("balanced") ||
      text.includes("smooth")
    ) &&
    product.intensity === 3
  ) {

    score += 4;

  }


  if (
    (
      text.includes("strong") ||
      text.includes("bold") ||
      text.includes("intense")
    ) &&
    product.intensity >= 5
  ) {

    score += 5;

  }


  /*
   * ================================================
   * FRUITY
   * ================================================
   */

  if (
    (
      text.includes("fruity") ||
      text.includes("fruit")
    ) &&
    (
      notes.includes("berry") ||
      notes.includes("blueberry") ||
      notes.includes("cherry") ||
      notes.includes("peach") ||
      notes.includes("apple") ||
      notes.includes("plum") ||
      notes.includes("blackcurrant")
    )
  ) {

    score += 5;

  }


  /*
   * ================================================
   * CHOCOLATE
   * ================================================
   */

  if (
    (
      text.includes("chocolate") ||
      text.includes("chocolatey") ||
      text.includes("cocoa")
    ) &&
    (
      notes.includes("chocolate") ||
      notes.includes("cocoa")
    )
  ) {

    score += 5;

  }


  /*
   * ================================================
   * CARAMEL
   * ================================================
   */

  if (
    text.includes("caramel") &&
    notes.includes("caramel")
  ) {

    score += 5;

  }


  return score;
}


/*
 * ==================================================
 * ACTION
 * ==================================================
 */

export async function action({
  request,
}: ActionFunctionArgs) {

  if (
    request.method !== "POST"
  ) {

    return new Response(
      JSON.stringify({
        error:
          "Method not allowed",
      }),
      {
        status: 405,

        headers: {
          "Content-Type":
            "application/json",
        },
      },
    );

  }


  try {

    /*
     * ==============================================
     * READ REQUEST
     * ==============================================
     */

    const body =
      (await request.json()) as AIRequest;


    const query =
      typeof body.query === "string"
        ? body.query.trim()
        : "";


    if (!query) {

      return new Response(
        JSON.stringify({
          error:
            "Query is required.",
        }),
        {
          status: 400,

          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );

    }


    /*
     * ==============================================
     * SCORE THE ENTIRE CATALOG
     * ==============================================
     */

    const recommendations =
      coffeeProducts

        .map(
          (product) => ({

            product,

            score:
              scoreCoffee(
                product,
                query,
              ),

          }),
        )

        .sort(
          (a, b) =>
            b.score - a.score,
        )

        .slice(0, 3);


    /*
     * ==============================================
     * FORMAT RESPONSE
     * ==============================================
     */

    const results: Recommendation[] =
      recommendations.map(
        ({
          product,
          score,
        }) => ({

          id:
            product.id,

          title:
            product.title,

          handle:
            product.handle,

          category:
            product.category,

          origin:
            product.origin,

          roast:
            product.roast,

          notes:
            product.notes,

          intensity:
            product.intensity,

          price:
            product.price,

          image:
            product.image,

          description:
            product.description,

          score,

        }),
      );


    /*
     * ==============================================
     * GENERATE RESPONSE TEXT
     * ==============================================
     */

    let answer =
      "Here are a few coffees you might like:";


    if (
      results.length > 0 &&
      results[0].score > 0
    ) {

      answer =
        `Based on what you're looking for, I'd start with ${results[0].title}. ` +
        `${results[0].roast} with notes of ${results[0].notes.toLowerCase()}.`;

    }


    /*
     * ==============================================
     * RETURN
     * ==============================================
     */

    return new Response(
      JSON.stringify({

        answer,

        query,

        recommendations:
          results,

      }),
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/json",
        },
      },
    );

  } catch (error) {

    console.error(
      "Coffee AI error:",
      error,
    );


    return new Response(
      JSON.stringify({
        error:
          "Unable to process your coffee request.",
      }),
      {
        status: 500,

        headers: {
          "Content-Type":
            "application/json",
        },
      },
    );

  }

}