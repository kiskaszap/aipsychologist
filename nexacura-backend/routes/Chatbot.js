const BaseRoute = require("./BaseRoute");
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

    // Check and format chatMessages to ensure 'content' is properly set
    const formattedMessages = chatMessages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content || "No content provided", // Provide a default message if content is missing
    }));

    // Prepare the payload for the OpenAI API
    const payload = {
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
    };

    // Set up headers for OpenAI request
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    };

    try {
      // Send the request to OpenAI
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        { headers }
      );
      res.json(response.data); // Send the response back to the front-end
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
      res.status(500).send("Failed to process the message");
    }
  }
}

module.exports = Chatbot;
