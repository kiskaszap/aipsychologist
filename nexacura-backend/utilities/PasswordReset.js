const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User"); // Ensure this path is correct

class PasswordReset {
  constructor(userEmail) {
    this.userEmail = userEmail;
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
    return crypto.randomBytes(8).toString("hex"); // Generates a simple 16-character hex password
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async updateUserPasswordInDb(hashedPassword) {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: this.userEmail }, // Assumes email is the unique identifier in your schema
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

  async sendEmail(password) {
    let transporter = nodemailer.createTransport({
      host: "smtp.ionos.co.uk", // SMTP server
      port: 465, // Standard port for SSL/TLS
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your IONOS email address
        pass: process.env.EMAIL_PASS, // Your IONOS password
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER, // This should be the same as `auth.user`
      to: this.userEmail,
      subject: "Your New Password",
      text: `You are receiving this email because a request was made to reset your password.\n\nHere is your new password: ${password}\n\nPlease change it after you log in for increased security.\n\nIf you did not request this, please contact support immediately.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent successfully." };
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false, message: "Email could not be sent." };
    }
  }
}

module.exports = PasswordReset;
