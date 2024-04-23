/* The ResetPassword class handles the process of sending a password reset link to users who have forgotten their passwords. */
const BaseRoute = require("./Baseroute");
const EmailChecker = require("../utilities/EmailChecker");
const PasswordReset = require("../utilities/PasswordReset");

class ResetPassword extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      try {
        const { email } = request.body;
        // Check if the email exists in the database
        const doesEmailExistInDb = await new EmailChecker().checkEmail(email);
        if (doesEmailExistInDb) {
          // Send password reset link
          const passwordReset = await new PasswordReset(email).sendResetLink();
          if (passwordReset.success) {
            response.json({
              status: "success",
              message: "Password reset link sent.",
            });
          } else {
            response.json({
              status: "error",
              message: "Failed to send reset link.",
            });
          }
        } else {
          response.json({
            status: "error",
            message: "Email does not exist.",
          });
        }
      } catch (error) {
        console.log(error);
        response.status(500).json({
          status: "error",
          message: "Server error while processing request.",
        });
      }
    });
  }
}

module.exports = ResetPassword;
