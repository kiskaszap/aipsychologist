import React from "react";

const AITalkVisualizer = ({ isSpeaking, isUser }) => {
  if (!isSpeaking) return null; // Hide visualizer when not speaking

  return (
    <div className="flex flex-row gap-x-2 items-center justify-center">
      <div
        className={`wave rounded-full w-2 h-4 ${isUser ? "bg-blue-500/60" : "bg-green-500/60"}`}
        style={{ "--i": ".4s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-8 ${isUser ? "bg-blue-400/60" : "bg-green-400/60"}`}
        style={{ "--i": ".4s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-4 ${isUser ? "bg-blue-700/60" : "bg-green-700/60"}`}
        style={{ "--i": ".4s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-6 ${isUser ? "bg-blue-600/60" : "bg-green-600/60"}`}
        style={{ "--i": ".2s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-12 ${isUser ? "bg-blue-500/60" : "bg-green-500/60"}`}
        style={{ "--i": ".3s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-18 ${isUser ? "bg-blue-400/60" : "bg-green-400/60"}`}
        style={{ "--i": ".4s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-12 ${isUser ? "bg-blue-500/60" : "bg-green-500/60"}`}
        style={{ "--i": ".3s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-6 ${isUser ? "bg-blue-600/60" : "bg-green-600/60"}`}
        style={{ "--i": ".2s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-4 ${isUser ? "bg-blue-700/60" : "bg-green-700/60"}`}
        style={{ "--i": ".4s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-8 ${isUser ? "bg-blue-400/60" : "bg-green-400/60"}`}
        style={{ "--i": ".4s" }}
      ></div>
      <div
        className={`wave rounded-full w-2 h-4 ${isUser ? "bg-blue-500/60" : "bg-green-500/60"}`}
        style={{ "--i": ".4s" }}
      ></div>

      {/* Scoped CSS for animation */}
      <style>
        {`
          .wave {
            animation: wave 1s linear infinite;
            animation-delay: calc(1s - var(--i));
          }

          @keyframes wave {
            0% { scale: 0; }
            50% { scale: 1; }
            100% { scale: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default AITalkVisualizer;
