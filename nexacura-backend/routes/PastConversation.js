const BaseRoute = require("./BaseRoute");
const fs = require("fs");
const path = require("path");
const DynamicFolderCreator = require("../utilities/DynamicFolderCreator");

class PastConversation extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", async (request, response) => {
     

      if (!request.session.user) {
        console.log("No user in session.");
        return response.status(401).json({ message: "Unauthorized" });
      }

      const id = request.session.user._id;
     

      // Use DynamicFolderCreator to get the folder path for storing conversations
      const dynamicFolderCreator = new DynamicFolderCreator(
        request,
        "conversations"
      );
      const folderPath = dynamicFolderCreator.createFolder();

      // Construct the file path where the conversation would be stored
      const filePath = path.join(folderPath, `${id}_conversation.json`);
      console.log(`File path for conversation: ${filePath}`);

      // Attempt to read the conversation file
      try {
        if (fs.existsSync(filePath)) {
          // File exists, read and parse the JSON file
          const fileData = fs.readFileSync(filePath);
          const conversationData = JSON.parse(fileData.toString());

          response.status(200).json({
            message: "Conversation retrieved successfully.",
            conversation: conversationData.conversation,
          });
        } else {
          // No conversation file exists for the user
          console.log("No conversation file found for user ID:", id);
          response.status(404).json({ message: "No conversation found." });
        }
      } catch (error) {
        console.error("Error retrieving conversation:", error);
        response.status(500).json({
          error: "Failed to retrieve conversation. Error: " + error.message,
        });
      }
    });
  }
}

module.exports = PastConversation;
