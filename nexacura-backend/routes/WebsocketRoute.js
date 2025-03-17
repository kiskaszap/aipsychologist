const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const axios = require("axios"); // ✅ Import axios for ChatGPT API calls

module.exports = (app) => {
  // ✅ Create HTTP Server
  const server = http.createServer(app);

  // ✅ Setup Socket.io with CORS
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // Allow your frontend to connect
      credentials: true,
    },
  });

  // ✅ Attach Session Middleware to WebSockets
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "12345",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  });

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  // ✅ WebSocket Connection Handler
  io.on("connection", (socket) => {
    console.log("🎙️ WebSocket client connected");

    let audioChunks = [];

    // ✅ Handle Incoming Audio Stream
    socket.on("audio-stream", (audioData) => {
      console.log("🔹 Receiving audio chunk...");
      audioChunks.push(audioData); // Collect audio chunks
    });

    // ✅ Handle End of Audio Stream
    socket.on("audio-end", async () => {
      console.log("✅ Audio stream ended. Processing audio...");

      try {
        // Concatenate all audio chunks into a single buffer
        const audioBuffer = Buffer.concat(audioChunks);

        // Log the received audio buffer (for debugging)
        console.log("🔊 Received audio buffer size:", audioBuffer.length);

        // ✅ Send the audio buffer to the WhisperTranscriber
        const WhisperTranscriber = require("../utilities/WhisperTranscriber");
        const transcriber = new WhisperTranscriber();

        const transcription = await transcriber.transcribeAudioBlob(audioBuffer);
        console.log("📝 Transcription:", transcription);

        // ✅ Send the transcription to ChatGPT
        const chatGPTResponse = await axios.post(
          "http://localhost:4000/chatbot",
          {
            chatMessages: [{ sender: "user", content: transcription }],
          }
        );

        const chatGPTMessage = chatGPTResponse.data.choices[0].message.content;
        console.log("🤖 ChatGPT Response:", chatGPTMessage);

        // ✅ Send the ChatGPT response back to the client
        socket.emit("chat-response", { message: chatGPTMessage });

        // ✅ Convert the ChatGPT response to speech (TTS)
        const ttsResponse = await axios.post(
          "http://localhost:4000/whisper-tts",
          { text: chatGPTMessage, voice: "alloy" }, // Use "alloy" as the default voice
          { responseType: "arraybuffer" } // Get the audio as a binary buffer
        );

        // ✅ Send the TTS audio back to the client
        socket.emit("tts-audio", ttsResponse.data);
      } catch (error) {
        console.error("❌ Error processing audio:", error);

        // ✅ Send a detailed error message to the client
        socket.emit("error", {
          message: "Error processing audio",
          details: error.message,
        });
      } finally {
        // Clear the audio chunks for the next recording
        audioChunks = [];
      }
    });

    // ✅ Handle Client Disconnection
    socket.on("disconnect", () => {
      console.log("❌ WebSocket client disconnected");
    });
  });

  // ✅ Start WebSocket Server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`✅ WebSocket Server is running on port ${PORT}`);
  });
};