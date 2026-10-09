type RecognitionResult = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};


type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;

  onresult:
    | ((event: RecognitionResult) => void)
    | null;

  onerror:
    | ((event: unknown) => void)
    | null;

  onend:
    | (() => void)
    | null;

  start: () => void;
  stop: () => void;
};


declare global {

  interface Window {

    SpeechRecognition?:
      new () => Recognition;

    webkitSpeechRecognition?:
      new () => Recognition;
  }
}


export function speak(
  text: string
) {

  if (
    !("speechSynthesis" in window)
  ) {
    return;
  }


  window.speechSynthesis.cancel();


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang = "de-CH";
  utterance.rate = 0.9;


  window.speechSynthesis.speak(
    utterance
  );
}


export function startListening(
  onText: (text: string) => void,
  onEnd: () => void,
  onError: (message: string) => void
) {

  const Recognition =
    window.SpeechRecognition ??
    window.webkitSpeechRecognition;


  if (!Recognition) {

    onError(
      "Speech recognition is not available in this browser."
    );

    return () => {};
  }


  const recognition =
    new Recognition();


  recognition.lang = "de-CH";

  recognition.continuous = false;

  recognition.interimResults = false;


  recognition.onresult =
    (event) => {

      const text =
        event.results[0][0]
          .transcript;

      onText(text);
    };


  recognition.onerror =
    () => {

      onError(
        "Speech recognition failed. You can type instead."
      );
    };


  recognition.onend = onEnd;


  recognition.start();


  return () => {
    recognition.stop();
  };
}