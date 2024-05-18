const BaseRoute = require("./Baseroute");
const PasswordHash = require("../utilities/PasswordHashing");
const UserModel = require("../models/User"); // Adjust the path as per your project structure

class NewPassword extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      const { password } = request.body;
      const userId = request.session.user?._id; // Ensure user is logged in and session is set

      if (!userId) {
        return response
          .status(401)
          .json({ message: "User not authenticated." });
      }

      if (!password) {
        return response.status(400).json({ message: "New password required." });
      }

      try {
        const user = await UserModel.findById(userId);
        if (!user) {
          return response.status(404).json({ message: "User not found." });
        }

        // Use the PasswordHash class to hash the new password
        const passwordHash = new PasswordHash(password);
        const hashedPassword = await passwordHash.hashPassword();

        user.password = hashedPassword; // Update the password in the user object
        await user.save(); // Save the updated user object to the database

        response
          .status(200)
          .json({ message: "Password updated successfully." });
      } catch (error) {
        console.error("Error updating password:", error);
        response.status(500).json({ message: "Error updating password." });
      }
    });
  }
}

module.exports = NewPassword;
