/* The UserRegistration class handles user registration by checking if the email already exists in the
database and saving the user details if it doesn't. */
const BaseRoute = require("../routes/Baseroute");
const PasswordHash = require("../utilities/PasswordHashing");
const User = require("../models/User");
const EmailChecker = require("../utilities/EmailChecker");

class UserRegistration extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      try {
        const { name, email, password } = request.body;
        const doesEmailExistInDb = await new EmailChecker().checkEmail(email);
        if (doesEmailExistInDb === false) {
          const hashedPassword = await new PasswordHash(
            password
          ).hashPassword();
          await new User({
            name,
            email,
            password: hashedPassword,
            bio: "",
            image: "",
            profession: "",
            subscription: {
              type: null, // No subscription type by default
              expiry: null, // No expiry date by default
              active: false, // Subscription is not active by default
            },
          }).save();
          response.status(201).json({
            isRegistered: true,
          });
        } else {
          response.status(201).json({
            isRegistered: false,
            isEmailRegistered: true,
            message: "Email already exists",
          });
        }
      } catch (error) {
        response.status(500).json({
          isRegistered: false,
        });
      }
    });
  }
}

module.exports = UserRegistration;
