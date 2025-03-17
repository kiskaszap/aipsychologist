/* The `WhisperTranscriber` class uses the OpenAI API to transcribe audio files using the Whisper
model. */
// const FormData = require("form-data");
// const fs = require("fs");
// const axios = require("axios");

// class WhisperTranscriber {
//   constructor() {
//     this.apiKey = "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";
//   }

//   async transcribeAudio(readFile) {
//     const formData = new FormData();
//     formData.append("model", "whisper-1");
//     formData.append("file", fs.createReadStream(readFile));

//     try {
//       console.log("🔊 Whisper Transcriber was hit, Transcribing audio...");
//       const response = await axios.post(
//         "https://api.openai.com/v1/audio/transcriptions",
//         formData,
//         {
//           headers: {
//             ...formData.getHeaders(),
//             Authorization: `Bearer ${this.apiKey}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error in transcribing audio:", error.message);
//       throw error; // Rethrow or handle as needed
//     }
//   }
// }

// module.exports = WhisperTranscriber;
const axios = require("axios");
const FormData = require("form-data"); // ✅ Import FormData

class WhisperTranscriber {
  async transcribeAudioBlob(audioBuffer) {
    try {
      console.log("🔍 Transcribing audio...");

      // ✅ Create a FormData object
      const formData = new FormData();

      // ✅ Append the audio buffer as a file
      formData.append("file", audioBuffer, {
        filename: "audio.webm", // Specify a filename
        contentType: "audio/webm", // Specify the content type
      });

      // ✅ Append the model parameter
      formData.append("model", "whisper-1");

      // ✅ Send the audio to OpenAI's Whisper API
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            ...formData.getHeaders(), // Include FormData headers
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      // ✅ Return the transcription
      return response.data.text;
    } catch (error) {
      console.error("❌ Error in transcription:", error);
      throw error;
    }
  }
}

module.exports = WhisperTranscriber;