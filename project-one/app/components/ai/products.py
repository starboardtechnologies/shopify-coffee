from dataclasses import dataclass
from typing import List


@dataclass
class Coffee:
    id: str
    title: str
    category: str
    origin: str
    roast: str
    notes: str
    intensity: int
    price: float


# ==================================================
# JAVA COFFEE CATALOG
# ==================================================
#
# This mirrors the product structure in
# coffeeProducts.ts.
#
# The recommendation model will use:
#
# - category
# - origin
# - roast
# - tasting notes
# - intensity
#
# Price is retained for future filtering.
# ==================================================


origins = {
    "Ethiopia": {
        "Light Roast": "Blueberry, jasmine, citrus",
        "Medium Roast": "Peach, honey, cocoa",
        "Dark Roast": "Dark berry, cacao, brown sugar",
    },

    "Colombia": {
        "Light Roast": "Red berry, orange, cane sugar",
        "Medium Roast": "Brown sugar, orange, cocoa",
        "Dark Roast": "Dark chocolate, cherry, caramel",
    },

    "Guatemala": {
        "Light Roast": "Honey, apple, milk chocolate",
        "Medium Roast": "Caramel, plum, cocoa",
        "Dark Roast": "Dark chocolate, raisin, toasted almond",
    },

    "Indonesia": {
        "Light Roast": "Citrus, herbs, brown sugar",
        "Medium Roast": "Cedar, cocoa, molasses",
        "Dark Roast": "Earthy spice, dark chocolate, cedar",
    },

    "Italy": {
        "Light Roast": "Citrus, almond, cocoa",
        "Medium Roast": "Caramel, hazelnut, milk chocolate",
        "Dark Roast": "Dark chocolate, molasses, roasted hazelnut",
    },

    "Costa Rica": {
        "Light Roast": "Orange, honey, vanilla",
        "Medium Roast": "Caramel, citrus, almond",
        "Dark Roast": "Cocoa, brown sugar, toasted walnut",
    },

    "Brazil": {
        "Light Roast": "Honey, citrus, almond",
        "Medium Roast": "Milk chocolate, hazelnut, brown sugar",
        "Dark Roast": "Dark cocoa, walnut, molasses",
    },

    "Kenya": {
        "Light Roast": "Blackcurrant, grapefruit, honey",
        "Medium Roast": "Berry, citrus, caramel",
        "Dark Roast": "Blackcurrant, cocoa, dark caramel",
    },

    "Blend": {
        "Light Roast": "Citrus, honey, toasted grain",
        "Medium Roast": "Chocolate, caramel, toasted almond",
        "Dark Roast": "Dark chocolate, molasses, walnut",
    },
}


categories = [
    "Espresso",
    "Single Origin",
    "Blend",
]


roasts = [
    "Light Roast",
    "Medium Roast",
    "Dark Roast",
]


prices = {
    "Espresso": {
        "Light Roast": 19.00,
        "Medium Roast": 20.00,
        "Dark Roast": 21.00,
    },

    "Single Origin": {
        "Light Roast": 17.00,
        "Medium Roast": 19.00,
        "Dark Roast": 21.00,
    },

    "Blend": {
        "Light Roast": 15.00,
        "Medium Roast": 16.00,
        "Dark Roast": 18.00,
    },
}


def create_title(
    category: str,
    origin: str,
    roast: str,
) -> str:

    roast_name = roast.replace(
        " Roast",
        "",
    )

    if category == "Espresso":

        if origin == "Italy":
            return f"Italian {roast_name} Espresso"

        return f"{origin} {roast_name} Espresso"


    if category == "Blend":

        if origin == "Blend":
            return f"Java {roast_name} Blend"

        return f"{origin} {roast_name} Blend"


    return f"{origin} {roast_name}"


def create_id(
    origin_index: int,
    category_index: int,
    roast_index: int,
) -> str:

    return str(
        origin_index * 9
        + category_index * 3
        + roast_index
        + 1
    )


def roast_intensity(
    roast: str,
) -> int:

    if roast == "Light Roast":
        return 2

    if roast == "Medium Roast":
        return 3

    return 5


# ==================================================
# BUILD CATALOG
# ==================================================

def build_catalog() -> List[Coffee]:

    catalog: List[Coffee] = []

    origin_names = list(
        origins.keys()
    )

    for origin_index, origin in enumerate(
        origin_names
    ):

        for category_index, category in enumerate(
            categories
        ):

            for roast_index, roast in enumerate(
                roasts
            ):

                notes = origins[
                    origin
                ][roast]

                coffee = Coffee(

                    id=create_id(
                        origin_index,
                        category_index,
                        roast_index,
                    ),

                    title=create_title(
                        category,
                        origin,
                        roast,
                    ),

                    category=category,

                    origin=origin,

                    roast=roast,

                    notes=notes,

                    intensity=roast_intensity(
                        roast
                    ),

                    price=prices[
                        category
                    ][roast],

                )

                catalog.append(coffee)

    return catalog


COFFEE_CATALOG = build_catalog()