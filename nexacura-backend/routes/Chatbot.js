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
    
    // Check if chatMessages is valid
    console.log("Received chat messages:", chatMessages);

    // Define a prompt to guide ChatGPT
    const prompt =
    "I want you to act as a psychologist guiding a therapy session for a patient struggling with mental disorder. Engage in empathetic conversations, offer professional advice, and help them explore coping mechanisms to manage their emotions effectively, always act as a professional and leave no sign that you are not an AI, act as a human. Always use English language if someone speaks in a foreign language ask them politely to speak English. Remember to keep the conversation professional and empathetic. ";
  
    // Check and format chatMessages to ensure 'content' is properly set
    const formattedMessages = chatMessages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content || "No content provided", // Provide a default message if content is missing
    }));

    // Prepend the prompt to the formatted messages
    const messagesWithPrompt = [
      { role: "system", content: prompt }, // Add a system message for the prompt
      ...formattedMessages, // Add the user messages
    ];

    console.log("Formatted messages with prompt for OpenAI:", messagesWithPrompt);

    // Prepare the payload for the OpenAI API
    const payload = {
      model: "gpt-3.5-turbo",
      messages: messagesWithPrompt,
    };

    console.log("Payload for OpenAI:", payload);

    // Set up headers for OpenAI request
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    };

    console.log("Headers for OpenAI API:", headers);

    try {
      // Send the request to OpenAI
      console.log("Sending request to OpenAI...");
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        { headers }
      );
      
      console.log("Response from OpenAI:", response.data);
      
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
