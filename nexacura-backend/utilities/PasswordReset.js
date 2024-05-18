const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

class PasswordReset {
  constructor(userEmail) {
    this.userEmail = userEmail;
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

  async resetUserPassword() {
    const newPassword = this.generateRandomPassword();
    const hashedPassword = await this.hashPassword(newPassword);
    const updateResult = await this.updateUserPasswordInDb(hashedPassword);

    if (updateResult.success) {
      const emailSent = await this.sendEmail(newPassword);
      return emailSent;
    } else {
      return updateResult;
    }
  }

  generateRandomPassword() {
    return crypto.randomBytes(8).toString("hex");
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async updateUserPasswordInDb(hashedPassword) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: this.userEmail },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      if (updatedUser) {
        return { success: true, message: "Password updated successfully." };
      } else {
        return { success: false, message: "User not found." };
      }
    } catch (error) {
      console.error("Database update failed:", error);
      return { success: false, message: "Database update failed." };
    }
  }

  async sendEmail(newPassword) {
    try {
      const source = fs.readFileSync(
        path.join(__dirname, "../forgotPassword.html"),
        "utf-8"
      );
      const template = handlebars.compile(source);
      const replacements = {
        newPassword: newPassword,
      };
      const htmlToSend = template(replacements);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: this.userEmail,
        subject: "Your New Password",
        html: htmlToSend,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Password reset email sent successfully");
      return { success: true, message: "Email sent successfully." };
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false, message: "Email could not be sent." };
    }
  }
}

module.exports = PasswordReset;
