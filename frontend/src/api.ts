import type {
  Learner,
  Lesson,
  TutorResponse,
  ChatMessage
} from "./types";


const API_BASE =
  import.meta.env.VITE_API_BASE ??
  "http://localhost:8000/api";


async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {})
      },
      ...options
    }
  );


  if (!response.ok) {

    const text =
      await response.text();

    throw new Error(
      text ||
      `Request failed: ${response.status}`
    );
  }


  return response.json();
}


export async function getLessons() {

  const data =
    await request<{
      lessons: Lesson[]
    }>("/lessons");

  return data.lessons;
}


export async function tutorChat(
  learner: Learner,
  message: string,
  scenarioId: string,
  conversation: ChatMessage[]
) {

  return request<TutorResponse>(
    "/tutor/chat",
    {
      method: "POST",

      body: JSON.stringify({
        learner,
        message,
        scenario_id: scenarioId,
        conversation
      })
    }
  );
}