const BaseRoute = require("./Baseroute");
const axios = require("axios");

class Chatbot extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", this.handleChatCompletionRequest.bind(this));
  }

  async handleChatCompletionRequest(req, res) {
    const { chatMessages } = req.body; // Received from the front-end
    const prompt =
    "I want you to act as a psychologist guiding a therapy session for a patient struggling with mental disorder. Engage in empathetic conversations, offer professional advice, and help them explore coping mechanisms to manage their emotions effectively, always act as a professional and leave no sign that you are not an AI, act as a human. Always use English language if someone speaks in a foreign language ask them politely to speak English. Remember to keep the conversation professional and empathetic. ";
    const formattedMessages = chatMessages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content || "No content provided", // Provide a default message if content is missing
    }));

    const messagesWithPrompt = [
      { role: "system", content: prompt }, // Add a system message for the prompt
      ...formattedMessages, // Add the user messages
    ];
    const payload = {
      model: "gpt-3.5-turbo",
      messages: messagesWithPrompt,
    };
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    };
    try {
      console.log("Sending request to OpenAI...");
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        { headers }
      );
      res.json(response.data); // Send the response back to the front-end
    } catch (error) {
      console.error("Error communicating with OpenAI:", error.response || error.message);

      // If OpenAI returns a response object, log it
      if (error.response) {
        console.error("OpenAI error response:", error.response.data);
      }
      res.status(500).send("Failed to process the message");
    }
  }
}

module.exports = Chatbot;
