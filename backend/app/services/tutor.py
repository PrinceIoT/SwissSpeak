from app.data import get_scenario
from app.prompts import tutor_system_prompt
from app.services.apertus import ApertusClient
from app.services.knowledge import retrieve


def run_tutor(
    learner,
    message,
    scenario_id,
    conversation
):

    scenario = get_scenario(
        scenario_id
    )

    knowledge = retrieve(
        message
    )

    client = ApertusClient()

    prompt = tutor_system_prompt(
        learner,
        scenario,
        knowledge
    )

    raw = client.chat(
        system_prompt=prompt,
        user_message=message,
        history=conversation
    )

    try:

        result = client.parse_json(
            raw
        )

    except ValueError:

        result = {
            "reply": raw,
            "translation": None,
            "correction": None,
            "explanation": None,
            "learning_point": None,
            "should_retry": False,
            "difficulty": 1,
            "feedback": None
        }

    return result