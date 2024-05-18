/* The Authentification class is used for verifying user credentials by comparing the input password
with the hashed password stored in the database using bcrypt. */
const bcrypt = require("bcryptjs");
const GetUser = require("./GetUser");
class Authentification {
  constructor(userInputPassword, email) {
    this.userInputPassword = userInputPassword;
    this.email = email;
  }

  async verifyUser() {
    const user = await new GetUser(this.email).get();
    const storedUserHashedPassword = user.password;
    try {
      const isMatch = await bcrypt.compare(
        this.userInputPassword,
        storedUserHashedPassword
      );
      if (isMatch) {
        return user;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      throw err;
    }
  }
}

module.exports = Authentification;
