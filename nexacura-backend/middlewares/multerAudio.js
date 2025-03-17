const multer = require("multer");
const path = require("path");
const DynamicFolderCreator = require("../utilities/DynamicFolderCreator");

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    console.log("Multer Request Session:", request.session); // Debugging Log

    if (!request.session || !request.session.user) {
      console.log("Session is missing in Multer!");
      return cb(new Error("Session data missing. Please log in again."), null);
    }

    const dynamicFolder = new DynamicFolderCreator(request, "input_audio");
    const folderPath = dynamicFolder.createFolder();
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
