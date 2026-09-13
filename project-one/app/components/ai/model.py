import re
from typing import Dict, List, Tuple

import torch
import torch.nn as nn

from products import COFFEE_CATALOG, Coffee


# ==================================================
# JAVA COFFEE AI
# ==================================================
#
# PyTorch recommendation model.
#
# The model converts each coffee into a numerical
# feature vector and compares that vector against
# a user's requested preferences.
#
# This is a content-based recommendation system.
# ==================================================


# ==================================================
# FEATURE VOCABULARY
# ==================================================

ROASTS = [
    "Light Roast",
    "Medium Roast",
    "Dark Roast",
]

CATEGORIES = [
    "Espresso",
    "Single Origin",
    "Blend",
]

ORIGINS = [
    "Ethiopia",
    "Colombia",
    "Guatemala",
    "Indonesia",
    "Italy",
    "Costa Rica",
    "Brazil",
    "Kenya",
    "Blend",
]


# Flavor words extracted from the catalog.
#
# These become searchable semantic features for
# the first version of the recommendation system.
FLAVOR_WORDS = [
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
    "milk chocolate",
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
    "herbs",
    "earthy",
    "toasted",
    "grain",
]


# ==================================================
# FEATURE SIZE
# ==================================================

FEATURE_SIZE = (
    len(ROASTS)
    + len(CATEGORIES)
    + len(ORIGINS)
    + len(FLAVOR_WORDS)
    + 1
)


# ==================================================
# TEXT NORMALIZATION
# ==================================================

def normalize_text(text: str) -> str:

    return re.sub(
        r"[^a-z0-9 ]",
        " ",
        text.lower(),
    )


# ==================================================
# COFFEE → FEATURE VECTOR
# ==================================================

def coffee_to_vector(
    coffee: Coffee,
) -> torch.Tensor:

    features: List[float] = []


    # --------------------------------------------------
    # Roast
    # --------------------------------------------------

    for roast in ROASTS:

        features.append(
            1.0
            if coffee.roast == roast
            else 0.0
        )


    # --------------------------------------------------
    # Category
    # --------------------------------------------------

    for category in CATEGORIES:

        features.append(
            1.0
            if coffee.category == category
            else 0.0
        )


    # --------------------------------------------------
    # Origin
    # --------------------------------------------------

    for origin in ORIGINS:

        features.append(
            1.0
            if coffee.origin == origin
            else 0.0
        )


    # --------------------------------------------------
    # Flavor notes
    # --------------------------------------------------

    notes = normalize_text(
        coffee.notes
    )

    for flavor in FLAVOR_WORDS:

        flavor_normalized = normalize_text(
            flavor
        )

        features.append(
            1.0
            if flavor_normalized in notes
            else 0.0
        )


    # --------------------------------------------------
    # Intensity
    #
    # Normalize 1–5 onto approximately 0–1.
    # --------------------------------------------------

    features.append(
        coffee.intensity / 5.0
    )


    return torch.tensor(
        features,
        dtype=torch.float32,
    )


# ==================================================
# CATALOG MATRIX
# ==================================================

CATALOG_MATRIX = torch.stack(
    [
        coffee_to_vector(coffee)
        for coffee in COFFEE_CATALOG
    ]
)


# ==================================================
# USER PREFERENCE PARSER
# ==================================================

ROAST_KEYWORDS: Dict[str, str] = {

    "light": "Light Roast",
    "bright": "Light Roast",
    "fruity": "Light Roast",

    "medium": "Medium Roast",
    "balanced": "Medium Roast",

    "dark": "Dark Roast",
    "bold": "Dark Roast",
    "strong": "Dark Roast",
}


CATEGORY_KEYWORDS: Dict[str, str] = {

    "espresso": "Espresso",
    "single origin": "Single Origin",
    "single-origin": "Single Origin",
    "blend": "Blend",
}


ORIGIN_KEYWORDS: Dict[str, str] = {

    origin.lower(): origin
    for origin in ORIGINS
}


def parse_preferences(
    query: str,
) -> Dict[str, object]:

    text = normalize_text(
        query
    )

    preferences: Dict[str, object] = {}


    # --------------------------------------------------
    # Roast
    # --------------------------------------------------

    for keyword, roast in ROAST_KEYWORDS.items():

        if keyword in text:

            preferences["roast"] = roast

            break


    # --------------------------------------------------
    # Category
    # --------------------------------------------------

    for keyword, category in CATEGORY_KEYWORDS.items():

        if keyword in text:

            preferences["category"] = category

            break


    # --------------------------------------------------
    # Origin
    # --------------------------------------------------

    for keyword, origin in ORIGIN_KEYWORDS.items():

        if keyword in text:

            preferences["origin"] = origin

            break


    # --------------------------------------------------
    # Flavor
    # --------------------------------------------------

    matching_flavors: List[str] = []

    for flavor in FLAVOR_WORDS:

        if normalize_text(flavor) in text:

            matching_flavors.append(
                flavor
            )


    if matching_flavors:

        preferences["flavors"] = (
            matching_flavors
        )


    # --------------------------------------------------
    # Intensity
    # --------------------------------------------------

    if any(
        word in text
        for word in [
            "weak",
            "mild",
            "light",
            "delicate",
        ]
    ):

        preferences["intensity"] = 2


    elif any(
        word in text
        for word in [
            "strong",
            "bold",
            "intense",
        ]
    ):

        preferences["intensity"] = 5


    elif any(
        word in text
        for word in [
            "medium",
            "balanced",
        ]
    ):

        preferences["intensity"] = 3


    return preferences


# ==================================================
# PREFERENCE VECTOR
# ==================================================

def preference_to_vector(
    preferences: Dict[str, object],
) -> torch.Tensor:

    vector = torch.zeros(
        FEATURE_SIZE,
        dtype=torch.float32,
    )


    # --------------------------------------------------
    # Roast
    # --------------------------------------------------

    roast = preferences.get(
        "roast"
    )

    if isinstance(roast, str):

        if roast in ROASTS:

            index = ROASTS.index(
                roast
            )

            vector[index] = 1.0


    # --------------------------------------------------
    # Category
    # --------------------------------------------------

    category = preferences.get(
        "category"
    )

    if isinstance(category, str):

        offset = len(ROASTS)

        if category in CATEGORIES:

            index = CATEGORIES.index(
                category
            )

            vector[
                offset + index
            ] = 1.0


    # --------------------------------------------------
    # Origin
    # --------------------------------------------------

    origin = preferences.get(
        "origin"
    )

    if isinstance(origin, str):

        offset = (
            len(ROASTS)
            + len(CATEGORIES)
        )

        if origin in ORIGINS:

            index = ORIGINS.index(
                origin
            )

            vector[
                offset + index
            ] = 1.0


    # --------------------------------------------------
    # Flavors
    # --------------------------------------------------

    flavors = preferences.get(
        "flavors"
    )

    if isinstance(flavors, list):

        offset = (
            len(ROASTS)
            + len(CATEGORIES)
            + len(ORIGINS)
        )

        for flavor in flavors:

            if flavor in FLAVOR_WORDS:

                index = FLAVOR_WORDS.index(
                    flavor
                )

                vector[
                    offset + index
                ] = 1.0


    # --------------------------------------------------
    # Intensity
    # --------------------------------------------------

    intensity = preferences.get(
        "intensity"
    )

    if isinstance(intensity, int):

        vector[-1] = (
            intensity / 5.0
        )


    return vector


# ==================================================
# PYTORCH SCORING MODEL
# ==================================================

class CoffeeRecommendationModel(
    nn.Module
):

    def __init__(
        self,
        input_size: int,
    ):

        super().__init__()


        self.encoder = nn.Sequential(

            nn.Linear(
                input_size,
                32,
            ),

            nn.ReLU(),

            nn.Linear(
                32,
                16,
            ),

        )


    def forward(
        self,
        features: torch.Tensor,
    ) -> torch.Tensor:

        return self.encoder(
            features
        )


# ==================================================
# MODEL
# ==================================================

model = CoffeeRecommendationModel(
    FEATURE_SIZE
)


# ==================================================
# RECOMMEND
# ==================================================

def recommend(
    query: str,
    limit: int = 3,
) -> List[Tuple[Coffee, float]]:

    preferences = parse_preferences(
        query
    )

    preference_vector =
        preference_to_vector(
            preferences
        )


    with torch.no_grad():

        user_embedding = model(
            preference_vector
        )

        coffee_embeddings = model(
            CATALOG_MATRIX
        )


        user_embedding = (
            user_embedding
            / user_embedding.norm()
        )

        coffee_embeddings = (
            coffee_embeddings
            /
            coffee_embeddings.norm(
                dim=1,
                keepdim=True,
            )
        )


        scores = (
            coffee_embeddings
            @ user_embedding
        )


    top_scores, top_indices = torch.topk(
        scores,
        k=min(
            limit,
            len(COFFEE_CATALOG),
        ),
    )


    results = []


    for score, index in zip(
        top_scores,
        top_indices,
    ):

        coffee = COFFEE_CATALOG[
            index.item()
        ]

        results.append(
            (
                coffee,
                float(score.item()),
            )
        )


    return results