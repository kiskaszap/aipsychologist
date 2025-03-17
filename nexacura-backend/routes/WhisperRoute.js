const BaseRoute = require("./BaseRoute");
const multer = require("multer");
const WhisperTranscriber = require("../utilities/WhisperTranscriber");

class WhisperRoute extends BaseRoute {
  constructor(io) {
    super();
    this.io = io;
    this.initializeRoutes();
  }

  initializeRoutes() {
    const upload = multer({ storage: multer.memoryStorage() });

    this.router.post("/", upload.single("audio"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No audio file provided" });
        }

        console.log("✅ Received audio file for transcription");

        const transcriber = new WhisperTranscriber();
        const audioBuffer = req.file.buffer;
        const transcription = await transcriber.transcribeAudioBlob(audioBuffer);

        console.log("📝 Transcription:", transcription);

        // ✅ Emit transcription result through WebSockets
        this.io.emit("transcription", transcription);

        res.json({ message: transcription });
      } catch (error) {
        console.error("❌ Error processing audio:", error);
        res.status(500).json({ error: "Error processing audio" });
      }
    });
  }
}

module.exports = (io) => new WhisperRoute(io);
