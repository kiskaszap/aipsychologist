/* The `OpenAiPsychologist` class uses the OpenAI API to generate responses based on user input and
maintains conversation history. */
const axios = require("axios");
const DynamicFolderCreator = require("./DynamicFolderCreator");
const ConversationHistoryManager = require("./ConversationHistoryManager");
const initialPrompt = require("../prompt/initialPrompt").default;

class OpenAiPsychologist {
  constructor(request) {
    this.apiKey = "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";
    this.request = request;
  }

  async answer(userText) {
    const txtPath = new DynamicFolderCreator(
      this.request,
      "output_txt"
    ).createFolder();
    const historymanager = new ConversationHistoryManager(
      txtPath,
      "conversationHistory.txt"
    );
    // Define the payload directly as a JavaScript object
    const payload = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: historymanager.readConversationHistory(),
        },
        { role: "user", content: userText },
      ],
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            withCredentials: true,
          },
        }
      );

      console.log(txtPath, "dynamicFolder");
      console.log(response.data.choices[0].message);
      //   console.log(initialPrompt);

      // Append the conversation to the history file
      const email = this.request.session.user.email;
      const role = response.data.choices[0].message.role;
      const message = response.data.choices[0].message.content;

      if (email) {
        // historymanager.appendToHistory(initialPrompt);
        historymanager.appendToHistory("user");
        historymanager.appendToHistory(userText);
        historymanager.appendToHistory(role);
        historymanager.appendToHistory(message);
      }
      return message;
    } catch (error) {
      console.error("Error in answer:", error.message);
      throw error; // Rethrow or handle as needed
    }
  }
}

module.exports = OpenAiPsychologist;
