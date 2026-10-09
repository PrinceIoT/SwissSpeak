import json
from pathlib import Path


DATA_DIR = (
    Path(__file__).resolve()
    .parents[2]
    / "data"
    / "bern"
)


def load_phrases():

    with open(
        DATA_DIR / "phrases.json",
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def retrieve(
    query: str,
    limit: int = 8
):

    phrases = load_phrases()

    query_words = set(
        query.lower().split()
    )

    scored = []

    for phrase in phrases:

        text = " ".join([
            phrase["dialect_phrase"],
            phrase["standard_german"],
            phrase["english"],
            phrase["context"]
        ]).lower()

        score = sum(
            word in text
            for word in query_words
        )

        if score:
            scored.append(
                (score, phrase)
            )

    scored.sort(
        key=lambda item: item[0],
        reverse=True
    )

    if scored:

        return [
            item[1]
            for item in scored[:limit]
        ]

    return phrases[:limit]