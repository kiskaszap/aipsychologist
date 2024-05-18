/* The Login class handles user authentication by checking email existence, verifying passwords, and
setting user session data. */
const BaseRoute = require("./Baseroute");
const EmailChecker = require("../utilities/EmailChecker");
const Authentification = require("../utilities/Authentification");

class Login extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      try {
        const { email, password } = request.body;
        // Check if the email exists in the database
        const doesEmailExistInDb = await new EmailChecker().checkEmail(email);
        if (doesEmailExistInDb) {
          // false if the password is incorrect, otherwise it returns the user data
          const getUserData = await new Authentification(
            password,
            email
          ).verifyUser();
          if (!getUserData) {
            response.json({
              isAuthenticated: false,
              message: "Invalid credentials!",
            });
          } else {
            const { password, ...userData } = getUserData;
            request.session.user = userData;
            console.log("User data:", userData);

            response.json({
              isAuthenticated: true,
              message: userData,
            });
          }
        } else {
          response.json({
            isAuthenticated: false,
            message: "Invalid credentials!",
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}

module.exports = Login;
