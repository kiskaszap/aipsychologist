const BaseRoute = require("./Baseroute");
const axios = require("axios");

class WhisperTTSRoute extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (req, res) => {
      let { text, voice } = req.body;

      const validVoices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer", "ash", "sage", "coral"];
      if (!validVoices.includes(voice)) {
        voice = "alloy"; //  Default to a valid voice
      }
      try {
        if (!text) {
          return res.status(400).json({ error: "Missing 'text' parameter" });
        }
        const response = await axios.post(
          "https://api.openai.com/v1/audio/speech",
          {
            model: "tts-1",
            input: text,
            voice: voice, //  Now always valid
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            responseType: "arraybuffer", // Get binary data for audio
          }
        );

        if (!response.data) {
          return res.status(500).json({ error: "No audio received from OpenAI" });
        }
        res.set("Content-Type", "audio/mpeg");
        res.send(response.data);
      } catch (error) {
        console.error(" Error generating speech:", error.response?.data || error.message);
        res.status(500).json({
          error: "Error generating speech",
          details: error.response?.data || error.message,
        });
      }
    });
  }
}

module.exports = WhisperTTSRoute;
