
const BaseRoute = require("./BaseRoute");
const EmailChecker = require("../utilities/EmailChecker");
const Authentication = require("../utilities/Authentification");

class Login extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      const { email, password } = request.body;
      try {
        //  Step 1: Check if the email exists in the database
        const doesEmailExist = await new EmailChecker().checkEmail(email);
        if (!doesEmailExist) {
          return response.status(401).json({
            isAuthenticated: false,
            message: "Invalid email address!",
          });
        }
        //  Step 2: Authenticate the user
        const userData = await new Authentication(password, email).verifyUser();
        if (!userData) {
          return response.status(401).json({
            isAuthenticated: false,
            message: "Invalid credentials!",
          });
        }
        //  Step 3: Extract and return user details
        const { password: userPassword, _id, ...userDetails } = userData;
        request.session.user = {
          _id: _id.toString(),
          ...userDetails,
        };

      

        // ✅ Step 4: Save session and return userData
        request.session.save((err) => {
          if (err) {
            throw new Error("Session save failed.");
          }
          response.json({
            isAuthenticated: true,
            message: request.session.user, //  Send full user data
          });
        });

      } catch (error) {
        console.error(" Login error:", error);
        response
          .status(500)
          .json({ error: "Internal server error", details: error.message });
      }
    });
  }
}

module.exports = Login;
