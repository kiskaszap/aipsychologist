const BaseRoute = require("./BaseRoute");
const axios = require("axios");

class WhisperTTSRoute extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (req, res) => {
      let { text, voice } = req.body;

      // ✅ Ensure voice is a valid OpenAI voice
      const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer", "ash", "sage", "coral"];
      if (!validVoices.includes(voice)) {
        console.warn(`⚠️ Invalid voice '${voice}', defaulting to 'alloy'`);
        voice = "alloy"; // ✅ Default to a valid voice
      }

      try {
        if (!text) {
          return res.status(400).json({ error: "Missing 'text' parameter" });
        }

        console.log("🔹 Whisper TTS Request Received:", { text, voice });

        // ✅ Call OpenAI's TTS API
        const response = await axios.post(
          "https://api.openai.com/v1/audio/speech",
          {
            model: "tts-1",
            input: text,
            voice: voice, // ✅ Now always valid
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer", // Get binary data for audio
          }
        );

        console.log("✅ Whisper TTS API Response Headers:", response.headers);

        if (!response.data) {
          console.error("❌ No audio received from OpenAI");
          return res.status(500).json({ error: "No audio received from OpenAI" });
        }

        console.log("✅ Successfully generated speech!");

        res.set("Content-Type", "audio/mpeg");
        res.send(response.data);
      } catch (error) {
        console.error("❌ Error generating speech:", error.response?.data || error.message);
        res.status(500).json({
          error: "Error generating speech",
          details: error.response?.data || error.message,
        });
      }
    });
  }
}

module.exports = WhisperTTSRoute;
