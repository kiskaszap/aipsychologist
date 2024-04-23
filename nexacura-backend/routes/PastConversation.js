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
      // Assumes user session is already set
      const id = request.session.user._id;

      // Use DynamicFolderCreator to get the folder path for storing conversations
      const dynamicFolderCreator = new DynamicFolderCreator(
        request,
        "conversations"
      );
      const folderPath = dynamicFolderCreator.createFolder();

      // Construct the file path where the conversation would be stored
      const filePath = path.join(folderPath, `${id}_conversation.json`);

      // Attempt to read the conversation file
      try {
        console.log("Attempting to retrieve conversation from path:", filePath);

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
