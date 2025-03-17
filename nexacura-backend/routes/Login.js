const BaseRoute = require("./BaseRoute");
const EmailChecker = require("../utilities/EmailChecker");
const Authentification = require("../utilities/Authentification");

class Login extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      const { email, password } = request.body;

      try {
        // Check if the email exists in the database
        const doesEmailExist = await new EmailChecker().checkEmail(email);
        if (!doesEmailExist) {
          return response.status(401).json({
            isAuthenticated: false,
            message: "Invalid email address!",
          });
        }

        // Authenticate the user
        const userData = await new Authentification(
          password,
          email
        ).verifyUser();
        if (!userData) {
          return response.status(401).json({
            isAuthenticated: false,
            message: "Invalid credentials!",
          });
        }

        // Set user session details
        const { password: userPassword, _id, ...userDetails } = userData;
        request.session.user = {
          _id: _id.toString(), // Convert MongoDB ObjectId to string
          ...userDetails,
        };

        // Save the session to ensure it's stored properly
        request.session.save((err) => {
          if (err) {
            throw new Error("Session save failed.");
          }

          
          response.json({
            isAuthenticated: true,
            message: request.session.user,
          });
        });
      } catch (error) {
        console.error("Login error:", error);
        response
          .status(500)
          .json({ error: "Internal server error", details: error.message });
      }
    });
  }
}

module.exports = Login;
