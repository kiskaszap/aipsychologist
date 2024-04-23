const BaseRoute = require("./Baseroute");
const PasswordHash = require("../utilities/PasswordHashing");
const User = require("../models/User");
const EmailChecker = require("../utilities/EmailChecker");
const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

class UserRegistration extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
    this.transporter = this.configureMailTransporter();
  }

  configureMailTransporter() {
    return nodemailer.createTransport({
      host: "smtp.ionos.co.uk",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  initializeRoutes() {
    this.router.post("/", async (request, response) => {
      try {
        const { name, email, password } = request.body;
        const doesEmailExistInDb = await new EmailChecker().checkEmail(email);
        if (!doesEmailExistInDb) {
          const hashedPassword = await new PasswordHash(
            password
          ).hashPassword();
          const newUser = await new User({
            name,
            email,
            password: hashedPassword,
            // ...other user fields
          }).save();

          // Send welcome email if user is successfully registered
          const emailSent = await this.sendWelcomeEmail(name, email);

          if (emailSent) {
            response.status(201).json({
              isRegistered: true,
              message: "User registered successfully",
            });
          } else {
            // In case email fails to send, still return success for user registration.
            response.status(201).json({
              isRegistered: true,
              message: "User registered successfully, but email not sent.",
            });
          }
        } else {
          response.status(409).json({
            isRegistered: false,
            isEmailRegistered: true,
            message: "Email already exists",
          });
        }
      } catch (error) {
        console.error(error);
        response.status(500).json({
          isRegistered: false,
          message: "Error during registration",
        });
      }
    });
  }

  async sendWelcomeEmail(name, email) {
    try {
      const source = fs.readFileSync(
        path.join(__dirname, "../welcome.html"),
        "utf-8"
      );
      const template = handlebars.compile(source);
      const replacements = {
        name: name,
      };
      const htmlToSend = template(replacements);

      const mailOptions = {
        from: "support@nexacura.chat",
        to: email,
        subject: "Welcome to NexaCura!",
        html: htmlToSend,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Welcome email sent successfully");
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return false;
    }
  }
}

module.exports = UserRegistration;
