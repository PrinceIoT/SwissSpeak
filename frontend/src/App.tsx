import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getLessons,
  tutorChat
} from "./api";

import {
  speak,
  startListening
} from "./speech";

import type {
  Learner,
  Lesson,
  TutorResponse,
  ChatMessage
} from "./types";


const defaultLearner: Learner = {
  learner_id: "demo",
  native_language: "English",
  canton: "Bern",
  dialect: "Bernese Swiss German",
  level: "beginner",
  goal: "everyday"
};


export default function App() {

  const [
    learner,
    setLearner
  ] = useState<Learner>(
    defaultLearner
  );


  const [
    started,
    setStarted
  ] = useState(false);


  const [
    lessons,
    setLessons
  ] = useState<Lesson[]>([]);


  const [
    scenarioId,
    setScenarioId
  ] = useState("bakery");


  const [
    messages,
    setMessages
  ] = useState<ChatMessage[]>([]);


  const [
    input,
    setInput
  ] = useState("");


  const [
    lastResponse,
    setLastResponse
  ] = useState<TutorResponse | null>(
    null
  );


  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    listening,
    setListening
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {

    getLessons()

      .then(setLessons)

      .catch((error) => {
        setError(error.message);
      });

  }, []);


  const scenario = useMemo(
    () =>
      lessons.find(
        (lesson) =>
          lesson.id === scenarioId
      ),

    [lessons, scenarioId]
  );


  async function sendMessage(
    text = input
  ) {

    const message =
      text.trim();


    if (
      !message ||
      loading
    ) {
      return;
    }


    setLoading(true);
    setError("");
    setInput("");


    const updatedMessages = [
      ...messages,

      {
        role: "user" as const,
        content: message
      }
    ];


    setMessages(
      updatedMessages
    );


    try {

      const result =
        await tutorChat(
          learner,
          message,
          scenarioId,
          messages.slice(-8)
        );


      setLastResponse(
        result
      );


      setMessages(
        current => [
          ...current,

          {
            role: "assistant",
            content: result.reply
          }
        ]
      );


      speak(
        result.reply
      );


    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

    } finally {

      setLoading(false);
    }
  }


  function begin() {

    setStarted(true);

    setMessages([]);

    setLastResponse(null);
  }


  function selectScenario(
    id: string
  ) {

    setScenarioId(id);

    setMessages([]);

    setLastResponse(null);
  }


  function listen() {

    if (listening) {
      return;
    }


    setListening(true);

    setError("");


    startListening(

      text => {

        setInput(text);

        setListening(false);
      },

      () => {

        setListening(false);
      },

      message => {

        setError(message);

        setListening(false);
      }
    );
  }


  if (!started) {

    return (
      <main className="landing">

        <div className="hero">

          <div className="flag">
            🇨🇭
          </div>

          <p className="eyebrow">
            SWISSSPEAK
          </p>

          <h1>
            Learn the language
            people actually speak
            around you.
          </h1>

          <p className="subtitle">
            An AI language coach for
            newcomers learning Swiss-local
            language and dialect through
            real conversations.
          </p>


          <div className="setup">

            <label>
              Where do you live?

              <select
                value={learner.canton}

                onChange={event => {

                  const canton =
                    event.target.value;

                  setLearner({
                    ...learner,

                    canton,

                    dialect:
                      canton === "Bern"
                        ? "Bernese Swiss German"
                        : "Swiss local language"
                  });

                }}
              >

                <option>
                  Bern
                </option>

                <option>
                  Zurich
                </option>

                <option>
                  Basel
                </option>

                <option>
                  Lucerne
                </option>

                <option>
                  St. Gallen
                </option>

                <option>
                  Vaud
                </option>

                <option>
                  Ticino
                </option>

              </select>

            </label>


            <label>
              Your level

              <select
                value={learner.level}

                onChange={event =>
                  setLearner({
                    ...learner,
                    level:
                      event.target.value
                  })
                }
              >

                <option value="beginner">
                  I know almost nothing
                </option>

                <option value="basic">
                  I know basic German
                </option>

                <option value="intermediate">
                  I understand German but
                  struggle with Swiss German
                </option>

              </select>

            </label>


            <button
              className="primary"
              onClick={begin}
            >
              Start learning →
            </button>

          </div>

        </div>

      </main>
    );
  }


  return (
    <main className="app">

      <header className="header">

        <div>

          <strong>
            🇨🇭 SwissSpeak
          </strong>

          <span>
            {learner.dialect}
          </span>

        </div>

      </header>


      <div className="workspace">

        <aside className="sidebar">

          <p className="eyebrow">
            LESSONS
          </p>


          {lessons.map(
            lesson => (

              <button
                key={lesson.id}

                className={
                  lesson.id === scenarioId
                    ? "lesson active"
                    : "lesson"
                }

                onClick={() =>
                  selectScenario(
                    lesson.id
                  )
                }
              >

                <strong>
                  {lesson.name}
                </strong>

                <small>
                  {
                    lesson.objectives
                      .slice(0, 2)
                      .join(" · ")
                  }
                </small>

              </button>

            )
          )}

        </aside>


        <section className="conversation">

          <div className="scenario">

            <div>

              <p className="eyebrow">
                SCENARIO
              </p>

              <h2>
                {scenario?.name}
              </h2>

              <p>
                {scenario?.description}
              </p>

            </div>

          </div>


          <div className="chat">

            {messages.length === 0 && (

              <div className="empty">

                <div>
                  🥐
                </div>

                <h3>
                  Start the conversation.
                </h3>

                <p>
                  Speak or type your answer.
                </p>

              </div>

            )}


            {messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={
                    message.role === "user"
                      ? "message user"
                      : "message assistant"
                  }
                >
                  {message.content}
                </div>

              )
            )}


            {loading && (

              <div className="message assistant">
                Thinking…
              </div>

            )}

          </div>


          {lastResponse && (

            <div className="feedback">

              {lastResponse.translation && (

                <div>
                  <strong>
                    English
                  </strong>

                  <p>
                    {lastResponse.translation}
                  </p>
                </div>

              )}


              {lastResponse.correction && (

                <div>
                  <strong>
                    Correction
                  </strong>

                  <p>
                    {lastResponse.correction}
                  </p>
                </div>

              )}


              {lastResponse.explanation && (

                <div>
                  <strong>
                    Explanation
                  </strong>

                  <p>
                    {lastResponse.explanation}
                  </p>
                </div>

              )}


              {lastResponse.learning_point && (

                <div>
                  <strong>
                    Learning point
                  </strong>

                  <p>
                    {lastResponse.learning_point}
                  </p>
                </div>

              )}

            </div>

          )}


          {error && (

            <div className="error">
              {error}
            </div>

          )}


          <div className="composer">

            <button
              className={
                listening
                  ? "mic recording"
                  : "mic"
              }

              onClick={listen}
            >
              {listening ? "■" : "🎤"}
            </button>


            <input

              value={input}

              onChange={event =>
                setInput(
                  event.target.value
                )
              }

              onKeyDown={event => {

                if (
                  event.key === "Enter"
                ) {
                  sendMessage();
                }

              }}

              placeholder="Speak or type..."
            />


            <button
              className="primary"
              onClick={() =>
                sendMessage()
              }
            >
              Send
            </button>

          </div>

        </section>

      </div>

    </main>
  );
}