import json

from pathlib import Path


DATA_DIR = (
    Path(__file__).resolve()
    .parents[1]
    / "data"
    / "bern"
)


def load_scenarios():

    with open(
        DATA_DIR / "scenarios.json",
        "r",
        encoding="utf-8"
    ) as file:

        return json.load(file)


def get_scenario(scenario_id: str):

    scenarios = load_scenarios()

    for scenario in scenarios:

        if scenario["id"] == scenario_id:
            return scenario

    raise KeyError(
        f"Unknown scenario: {scenario_id}"
    )