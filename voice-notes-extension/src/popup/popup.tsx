import { useState } from "react";
import { useSpeechRecognition } from "../hooks/speech-recognition";

const Popup = () => {
  const [transcript, setTranscript] = useState("");
  console.log("Transcript updated:", transcript);

  const { start, stop } = useSpeechRecognition((text) => {
    setTranscript((prev) => prev + " " + text);
  });

  return (
    <div>
      <h1>Voice Notes Extension</h1>
      <p>Click the button below to start recording your voice note.</p>
      <button onClick={start}>Start Recording</button>
      <button onClick={stop}>Stop Recording</button>

      <h2>Transcript:</h2>
      <p>{transcript}</p>

      <h2>Summary:</h2>
    </div>
  );
};

export default Popup;
