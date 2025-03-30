const BaseRoute = require("../routes/Baseroute");
const fs = require("fs");
const path = require("path");
const DynamicFolderCreator = require("../utilities/DynamicFolderCreator");

class ChatSession extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      console.log("📢 ChatSession API called");
      console.log("Request body:", request.body.conversation);
      console.log("Session user:", request.session);
      
      const id = request.session.user._id;

      const newConversationData = request.body.conversation;

      if (!newConversationData) {
        return response
          .status(400)
          .json({ error: "Invalid or missing conversation data." });
      }
      const dynamicFolderCreator = new DynamicFolderCreator(
        request,
        "conversations"
      );
      const folderPath = dynamicFolderCreator.createFolder();
      const filePath = path.join(folderPath, `${id}_conversation.json`);

      try {

        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          const conversationData = JSON.parse(fileData.toString());
          conversationData.conversation.push(...newConversationData);
          fs.writeFileSync(filePath, JSON.stringify(conversationData, null, 2));
        } else {
          fs.writeFileSync(
            filePath,
            JSON.stringify({ conversation: newConversationData }, null, 2)
          );
        }

        response
          .status(200)
          .json({ message: "Conversation updated successfully." });
      } catch (error) {
        console.error("Error handling conversation:", error);
        response.status(500).json({
          error: "Failed to handle conversation. Error: " + error.message,
        });
      }
    });
  }
}

module.exports = ChatSession;
