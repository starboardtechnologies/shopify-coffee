import {coffeeProducts} from "~/data/coffeeProducts";
import {
  recommendCoffees,
} from "~/lib/coffeeRecommendation";

type RequestBody = {
  query?: unknown;
};

type Preferences = {
  roast: string;
  flavor: string;
  intensity: string;
  origin: string;
};

function extractPreferences(
  query: string,
): Preferences {
  const text =
    query.toLowerCase();

  let roast = "";
  let flavor = "";
  let intensity = "";
  let origin = "";

  /*
   * ROAST
   */

  if (text.includes("dark")) {
    roast = "Dark Roast";
  } else if (
    text.includes("medium")
  ) {
    roast = "Medium Roast";
  } else if (
    text.includes("light")
  ) {
    roast = "Light Roast";
  }

  /*
   * FLAVOR
   */

  if (
    text.includes("chocolate") ||
    text.includes("cocoa") ||
    text.includes("cacao")
  ) {
    flavor = "chocolate";
  } else if (
    text.includes("fruity") ||
    text.includes("fruit") ||
    text.includes("berry")
  ) {
    flavor = "fruity";
  } else if (
    text.includes("nutty") ||
    text.includes("almond") ||
    text.includes("hazelnut")
  ) {
    flavor = "nutty";
  } else if (
    text.includes("sweet") ||
    text.includes("caramel") ||
    text.includes("honey")
  ) {
    flavor = "sweet";
  } else if (
    text.includes("citrus") ||
    text.includes("citrusy") ||
    text.includes("orange")
  ) {
    flavor = "citrusy";
  }

  /*
   * INTENSITY
   */

  if (
    text.includes("strong") ||
    text.includes("bold") ||
    text.includes("intense")
  ) {
    intensity = "Strong";
  } else if (
    text.includes("mild") ||
    text.includes("light-bodied")
  ) {
    intensity = "Mild";
  } else if (
    text.includes("balanced") ||
    text.includes("smooth")
  ) {
    intensity = "Balanced";
  }

  /*
   * ORIGIN
   */

  const origins = [
    "ethiopia",
    "colombia",
    "guatemala",
    "indonesia",
    "italy",
    "costa rica",
    "brazil",
    "kenya",
  ];

  const matchedOrigin =
    origins.find(
      (originName) =>
        text.includes(originName),
    );

  if (matchedOrigin) {
    origin =
      matchedOrigin
        .split(" ")
        .map(
          (word: string) =>
            word.charAt(0).toUpperCase() +
            word.slice(1),
        )
        .join(" ");
  }

  return {
    roast,
    flavor,
    intensity,
    origin,
  };
}

export async function action({
  request,
}: {
  request: Request;
}) {
  /*
   * ==================================================
   * METHOD
   * ==================================================
   */

  if (
    request.method !==
    "POST"
  ) {
    return Response.json(
      {
        error:
          "Method not allowed",
      },
      {
        status: 405,
      },
    );
  }

  try {
    /*
     * ==================================================
     * REQUEST BODY
     * ==================================================
     */

    const body =
      (await request.json()) as RequestBody;

    const query =
      typeof body.query ===
      "string"
        ? body.query.trim()
        : "";

    /*
     * ==================================================
     * EMPTY QUERY
     * ==================================================
     */

    if (!query) {
      return Response.json({
        response:
          "Tell me what kind of coffee you're looking for.",

        recommendation:
          null,
      });
    }

    /*
     * ==================================================
     * PREFERENCES
     * ==================================================
     */

    const preferences =
      extractPreferences(
        query,
      );

    console.log(
      "Coffee query:",
      query,
    );

    console.log(
      "Coffee preferences:",
      preferences,
    );

    /*
     * ==================================================
     * RECOMMENDATIONS
     * ==================================================
     */

    const results =
      recommendCoffees(
        coffeeProducts,
        preferences,
      );

    console.log(
      "Coffee results:",
      results,
    );

    const best =
      results[0];

    /*
     * ==================================================
     * NO MATCH
     * ==================================================
     */

    if (
      !best ||
      best.score === 0
    ) {
      return Response.json({
        response:
          "I couldn't find a strong match yet. Try describing the roast, flavor, intensity, or origin you're looking for.",

        recommendation:
          null,

        preferences,
      });
    }

    /*
     * ==================================================
     * PRODUCT
     * ==================================================
     */

    const product =
      best.product;

    const id =
      String(
        product.id ?? "",
      );

    const handle =
      String(
        product.handle ?? "",
      );

    const title =
      String(
        product.title ?? "",
      );

    const image =
      String(
        product.image ??
          "/images/singleorigin-collection.jpg",
      );

    const price =
      String(
        product.price ?? "",
      );

    const origin =
      String(
        product.origin ?? "",
      );

    const roast =
      String(
        product.roast ?? "",
      );

    const notes =
      String(
        product.notes ?? "",
      );

    const category =
      String(
        product.category ??
          "Coffee",
      );

    const intensity =
      String(
        product.intensity ?? "",
      );

    /*
     * ==================================================
     * REASONS
     * ==================================================
     */

    const reasons =
      Array.isArray(
        best.reasons,
      )
        ? best.reasons
        : [];

    const reasonText =
      reasons.length > 0
        ? ` It matches because it has ${reasons.join(
            ", ",
          )}.`
        : "";

    /*
     * ==================================================
     * FINAL RESPONSE
     * ==================================================
     */

    return Response.json({
      response:
        `I'd recommend ${title}.${reasonText}`,

      recommendation: {
        id,
        handle,
        title,
        image,
        price,
        origin,
        roast,
        notes,
        intensity,
        category,
      },

      score:
        best.score,

      preferences,
    });

  } catch (error) {
    console.error(
      "Coffee assistant error:",
      error,
    );

    return Response.json(
      {
        error:
          "Coffee assistant request failed.",

        recommendation:
          null,
      },
      {
        status: 500,
      },
    );
  }
}