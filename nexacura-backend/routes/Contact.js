const BaseRoute = require("./BaseRoute");
const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

class ContactHandler extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
    this.transporter = this.configureMailTransporter();
  }

  configureMailTransporter() {
      return nodemailer.createTransport({
        host: "smtp.gmail.com",
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
        const { name, email, message } = request.body;
        const userNotified = await this.sendConfirmationEmail(name, email);
        const supportNotified = await this.sendToSupport(email, message);
        if (userNotified && supportNotified) {
          response.status(201).json({
            success: true,
            message: "Your message has been sent successfully.",
          });
        } else {
          response.status(500).json({
            success: false,
            message: "Failed to send your message. Please try again later.",
          });
        }
      } catch (error) {
        console.error(error);
        response.status(500).json({
          success: false,
          message: "Error handling your contact request",
        });
      }
    });
  }

  async sendConfirmationEmail(name, email) {
    try {
      const source = fs.readFileSync(
        path.join(__dirname, "../confirmation.html"),
        "utf-8"
      );
      const template = handlebars.compile(source);

      const htmlToSend = template();

      const mailOptions = {
        from: "support@nexacura.chat",
        to: email,
        subject: "Thank you for contacting us!",
        html: htmlToSend,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Confirmation email sent successfully");
      return true;
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      return false;
    }
  }

  async sendToSupport(userEmail, message) {
    const mailOptions = {
      from: "support@nexacura.chat",
      to: "support@nexacura.chat",
      subject: "New Contact Message",
      text: `You received a new message from ${userEmail}: ${message}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Message forwarded to support successfully");
      return true;
    } catch (error) {
      console.error("Error forwarding message to support:", error);
      return false;
    }
  }
}

module.exports = ContactHandler;
