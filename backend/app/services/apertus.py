import json
import re

from openai import OpenAI

from app.config import settings


class ApertusClient:

    def __init__(self):

        if not settings.apertus_api_key:
            raise RuntimeError(
                "APERTUS_API_KEY is not configured."
            )

        if not settings.apertus_base_url:
            raise RuntimeError(
                "APERTUS_BASE_URL is not configured."
            )

        self.client = OpenAI(
            api_key=settings.apertus_api_key,
            base_url=settings.apertus_base_url,
        )

    def chat(
        self,
        system_prompt: str,
        user_message: str,
        history: list[dict] | None = None
    ) -> str:

        messages = [
            {
                "role": "system",
                "content": system_prompt
            }
        ]

        for item in history or []:

            if item.get("role") in {
                "user",
                "assistant"
            }:

                messages.append({
                    "role": item["role"],
                    "content": item["content"]
                })

        messages.append({
            "role": "user",
            "content": user_message
        })

        response = self.client.chat.completions.create(
            model=settings.apertus_model,
            messages=messages,
            temperature=0.7,
            top_p=0.9,
            max_tokens=500,
        )

        return (
            response
            .choices[0]
            .message
            .content
            or ""
        )

    @staticmethod
    def parse_json(text: str) -> dict:

        text = text.strip()

        # Remove markdown fences if the model adds them.
        text = re.sub(
            r"^```(?:json)?\s*",
            "",
            text,
            flags=re.IGNORECASE
        )

        text = re.sub(
            r"\s*```$",
            "",
            text
        )

        try:
            return json.loads(text)

        except json.JSONDecodeError:
            pass

        # Fallback: find JSON object.
        start = text.find("{")
        end = text.rfind("}")

        if start >= 0 and end > start:

            try:
                return json.loads(
                    text[start:end + 1]
                )

            except json.JSONDecodeError:
                pass

        raise ValueError(
            "Apertus did not return valid JSON."
        )