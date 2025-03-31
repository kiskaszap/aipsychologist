const BaseRoute = require("./Baseroute");
const multer = require("multer");
const WhisperTranscriber = require("../utilities/WhisperTranscriber");

class SpeechToText extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // ✅ Multer for handling audio file uploads (memory storage)
    const upload = multer({ storage: multer.memoryStorage() });

    this.router.post("/", upload.single("audio"), async (request, response) => {
      try {
        if (!request.file) {
          return response.status(400).json({ error: "No audio file provided" });
        }

        console.log("✅ Received audio file for transcription");

        const transcriber = new WhisperTranscriber();
        const transcription = await transcriber.transcribeAudioBlob(request.file.buffer);

        console.log("📝 Transcription:", transcription);
        response.json({ message: transcription });
      } catch (error) {
        console.error("❌ Error processing audio:", error);
        response.status(500).json({ error: "Error processing audio" });
      }
    });
  }
}

module.exports = SpeechToText;
