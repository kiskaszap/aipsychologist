/* The User class extends a BaseRoute class and handles updating user data including image upload
functionality. */
const UserModel = require("../models/User");
const BaseRoute = require("./Baseroute");
const upload = require("../middlewares/multer");

class User extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", upload.single("image"), async (request, response) => {
      const { email, name, profession, bio } = request.body;
      console.log(email, name, profession, bio);
      let updateObj = {
        name,
        profession,
        bio,
      };

      if (request.file) {
        const path = request.file.path.replace("uploads/", "");
        const imagePath = `http://localhost:3000/${path}`;
        updateObj.image = imagePath;
      }

      try {
        const updatedUser = await UserModel.findOneAndUpdate(
          { email: email },
          { $set: updateObj },
          { new: true }
        );

        if (updatedUser) {
          response.json({
            message: "User data updated successfully",
            user: updatedUser,
          });
        } else {
          response.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error updating user data" });
      }
    });
  }
}

module.exports = User;
