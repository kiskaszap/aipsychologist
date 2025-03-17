/* The DynamicFolderCreator class creates a dynamic folder based on session data for file uploads. */
const fs = require("fs");
const path = require("path");

class DynamicFolderCreator {
  constructor(request, folder) {
    this.request = request;
    this.uploadsPath = `uploads/${folder}`;
  }
 

  createFolder() {
    let dynamicFolder;
    let folderPath;
    console.log(this.request.session.user, "Dynamic folder creator was called");

    if (this.request.session.user.email) {
      dynamicFolder = this.request.session.user._id;
      folderPath = path.join(this.uploadsPath, dynamicFolder);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder created at: ${folderPath}`);
      } else {
        console.log(`Folder already exists at: ${folderPath}`);
      }

      return folderPath;
    } else {
      console.log("No session data found to create a dynamic folder.");
      return null;
    }
  }
}

module.exports = DynamicFolderCreator;
