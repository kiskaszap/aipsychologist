/**
 * The Avatar component in this code snippet sets up a WebRTC connection, creates an avatar
 * synthesizer, and provides functionality to connect, disconnect, speak, and stop speaking using the
 * avatar.
 * @returns The `Avatar` component is being returned. It contains elements for displaying video and
 * audio streams, buttons for connecting, disconnecting, speaking, and stopping the avatar, as well as
 * a `Whisper` component. The component sets up a WebRTC connection, creates an avatar synthesizer, and
 * handles various functions related to speech synthesis and avatar interaction.
 */
// import "./Avatar.css";

//SEGG
import React from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { createAvatarSynthesizer, createWebRTCConnection } from "./Utility";
import { avatarAppConfig } from "./config";
import { useState } from "react";
import { useRef } from "react";
import authenticationContext from "../../context/authenticationContext";
import Whisper from "../Whisper/Whisper";
import Text from "../Text/Text";

export const Avatar = () => {
  const { initial } = React.useContext(authenticationContext);
  console.log(initial);
  const [avatarSynthesizer, setAvatarSynthesizer] = useState(null);
  const myAvatarVideoEleRef = useRef();
  const myAvatarAudioEleRef = useRef();
  const buttonRef = useRef(null);
  const logoutButtonRef = useRef(null);
  const speakRef = useRef(null);

  const [mySpeechText, setMySpeechText] = useState("Hello, I am your Avatar.");

  var iceUrl = avatarAppConfig.iceUrl;
  var iceUsername = avatarAppConfig.iceUsername;
  var iceCredential = avatarAppConfig.iceCredential;

  React.useEffect(() => {
    setMySpeechText(initial.avatarAnswer);
  }, [initial.avatarAnswer]);
  console.log("Printing mySpeechText ", mySpeechText);

  /**
   * The function `handleOnTrack` updates UI elements based on the type of media track received in the
   * event.
   * @param event - The `handleOnTrack` function is designed to handle incoming media tracks in a
   * WebRTC context. When a new track is added to the connection, this function is called with an
   * `event` object containing information about the track.
   */
  const handleOnTrack = (event) => {
    console.log("#### Printing handle onTrack ", event);

    // Update UI elements
    console.log("Printing event.track.kind ", event.track.kind);
    if (event.track.kind === "video") {
      const mediaPlayer = myAvatarVideoEleRef.current;
      mediaPlayer.id = event.track.kind;
      mediaPlayer.srcObject = event.streams[0];
      mediaPlayer.autoplay = true;
      mediaPlayer.playsInline = true;
      mediaPlayer.addEventListener("play", () => {
        window.requestAnimationFrame(() => {});
      });
    } else {
      const audioPlayer = myAvatarAudioEleRef.current;
      audioPlayer.srcObject = event.streams[0];
      audioPlayer.autoplay = true;
      audioPlayer.playsInline = true;
      audioPlayer.muted = true;
    }
  };

  /**
   * The function `stopSpeaking` stops the avatar from speaking and logs a message indicating that the
   * stop speaking request was sent.
   */
  const stopSpeaking = () => {
    avatarSynthesizer
      .stopSpeakingAsync()
      .then(() => {
        console.log(
          "[" + new Date().toISOString() + "] Stop speaking request sent."
        );
      })
      .catch();
  };

  /**
   * The `stopSession` function stops the avatar from speaking and closes the synthesizer.
   */
  const stopSession = () => {
    try {
      //Stop speaking
      avatarSynthesizer
        .stopSpeakingAsync()
        .then(() => {
          console.log(
            "[" + new Date().toISOString() + "] Stop speaking request sent."
          );
          // Close the synthesizer
          avatarSynthesizer.close();
          console.log("[" + new Date().toISOString() + "] Avatar closed.");
        })
        .catch();
    } catch (e) {}
  };

  /**
   * The function `speakSelectedText` starts speaking the selected text using an avatar synthesizer and
   * logs the status and results of the speech synthesis process.
   */
  const speakSelectedText = () => {
    //Start speaking the text
    const audioPlayer = myAvatarAudioEleRef.current;
    console.log("Audio muted status ", audioPlayer.muted);
    audioPlayer.muted = false;
    avatarSynthesizer
      .speakTextAsync(mySpeechText)
      .then((result) => {
        if (
          result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted
        ) {
          console.log("Speech and avatar synthesized to video stream.");
        } else {
          console.log("Unable to speak. Result ID: " + result.resultId);
          if (result.reason === SpeechSDK.ResultReason.Canceled) {
            let cancellationDetails =
              SpeechSDK.CancellationDetails.fromResult(result);
            console.log(cancellationDetails.reason);
            if (
              cancellationDetails.reason === SpeechSDK.CancellationReason.Error
            ) {
              console.log(cancellationDetails.errorDetails);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
        avatarSynthesizer.close();
      });
  };

  /**
   * The `startSession` function sets up a WebRTC connection, adds video and audio transceivers, creates
   * an avatar synthesizer, and handles the connection state changes.
   */
  const startSession = () => {
    let peerConnection = createWebRTCConnection(
      iceUrl,
      iceUsername,
      iceCredential
    );
    console.log("Peer connection ", peerConnection);
    peerConnection.ontrack = handleOnTrack;
    peerConnection.addTransceiver("video", { direction: "sendrecv" });
    peerConnection.addTransceiver("audio", { direction: "sendrecv" });

    let avatarSynthesizer = createAvatarSynthesizer();
    setAvatarSynthesizer(avatarSynthesizer);
    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("WebRTC status: " + peerConnection.iceConnectionState);

      if (peerConnection.iceConnectionState === "connected") {
        console.log("Connected to Azure Avatar service");
      }

      if (
        peerConnection.iceConnectionState === "disconnected" ||
        peerConnection.iceConnectionState === "failed"
      ) {
        console.log("Azure Avatar service Disconnected");
      }
    };

    avatarSynthesizer
      .startAvatarAsync(peerConnection)
      .then((r) => {
        console.log("[" + new Date().toISOString() + "] Avatar started.");
      })
      .catch((error) => {
        console.log(
          "[" +
            new Date().toISOString() +
            "] Avatar failed to start. Error: " +
            error
        );
      });
  };

  return (
    <div className="h-full  w-full  flex flex-col items-center">
      <div id="myAvatarVideo" className="myVideoDiv">
        <video
          className="myAvatarVideoElement"
          ref={myAvatarVideoEleRef}
        ></video>

        <audio ref={myAvatarAudioEleRef}></audio>
      </div>
      <div className="myButtonGroup flex flex-col justify-center gap-y-3   z-[1500] absolute top-0 left-[20rem]">
        <Text className=" text-center text-3xl font-bold text-primary">
          Ava<span className="text-secondary">tar</span>
        </Text>
        <div className=" flex justify-between">
          <button
            className="middle none center mr-4 rounded-lg bg-green-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            ref={buttonRef}
            onClick={startSession}
          >
            Connect
          </button>
          <button
            className="middle none center mr-4 rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={stopSession}
            ref={logoutButtonRef}
          >
            Disconnect
          </button>
          <button
            className="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            ref={speakRef}
            onClick={speakSelectedText}
          >
            Speak
          </button>
          <button
            className="middle none center mr-4 rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            onClick={stopSpeaking}
          >
            Stop
          </button>
        </div>
        <Whisper />
      </div>
    </div>
  );
};
