export type Learner = {
  learner_id: string;
  native_language: string;
  canton: string;
  dialect: string;
  level: string;
  goal: string;
};

export type Lesson = {
  id: string;
  name: string;
  description: string;
  objectives: string[];
};

export type TutorResponse = {
  reply: string;
  translation?: string | null;
  correction?: string | null;
  explanation?: string | null;
  learning_point?: string | null;
  should_retry: boolean;
  difficulty: number;
  feedback?: string | null;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};