/* The PasswordHash class uses bcrypt to securely hash passwords with a specified number of salt
rounds. */
const bcrypt = require("bcryptjs");

class PasswordHash {
  constructor(password) {
    this.password = password;
  }
  async hashPassword() {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(this.password, saltRounds);
    } catch (err) {
      console.error("Error hashing password:", err);
      throw err;
    }
  }
}
module.exports = PasswordHash;
