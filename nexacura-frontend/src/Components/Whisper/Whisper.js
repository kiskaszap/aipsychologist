import React, { useState, useEffect } from "react";
import axios from "axios";
import authenticationContext from "../../context/authenticationContext";

function Whisper() {
  const { dispatch } = React.useContext(authenticationContext);

  const [result, setResult] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          let chunks = []; // Move `chunks` inside useEffect

          newMediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            // Create FormData to send the audio blob
            const formData = new FormData();
            formData.append("audio", audioBlob, "audio.webm");

            try {
              // Use axios to send the FormData
              const response = await axios({
                method: "post",
                url: "http://localhost:3000/speechToText",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              });
              setResult(response.data);
              setLoading(false);
              dispatch({
                type: "AVATAR_ANSWER",
                payload: response.data.message,
              });
            } catch (error) {
              console.error(error);
            }

            chunks = []; // Reset chunks after blob creation and FormData submission
          };

          setMediaRecorder(newMediaRecorder);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
  }, [result]);
  if (!loading) {
    console.log(result);
  }
  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <button
      className={`w-full ${
        recording
          ? "bg-red-500 hover:bg-red-500"
          : "bg-green-500 hover:bg-green-500"
      }   text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
      onClick={recording ? stopRecording : startRecording}
    >
      {recording ? "Stop Recording" : "Start Recording"}
    </button>
  );
}

export default Whisper;
