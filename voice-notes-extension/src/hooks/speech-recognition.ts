import { useRef, useEffect } from "react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event & { error: string }) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface WindowWithWebkitSpeechRecognition extends Window {
  webkitSpeechRecognition: new () => SpeechRecognitionInstance;
}

export const useSpeechRecognition = (onResult: (text: string) => void) => {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const win = window as unknown as WindowWithWebkitSpeechRecognition;
    if (!win.webkitSpeechRecognition) {
      console.error("webkitSpeechRecognition is not available");
      return;
    }

    const recognition = new win.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-GB";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;
      onResultRef.current(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const start = () => recognitionRef.current?.start();
  const stop = () => recognitionRef.current?.stop();

  return { start, stop };
};
