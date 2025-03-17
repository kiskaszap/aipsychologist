const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Adjust the path to your User model
require("dotenv").config();

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: "31675834820-i18ifq0aefcuq6skf750bspkvsrfd6d2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile received:", profile);

        // Check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
        console.log("User found in database:", user);

        if (!user) {
          console.log("User not found in database. Creating new user...");
          // Create a new user if they don't exist
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
           
          });
          await user.save();
          console.log("New user created:", user);
        }

        // Pass the user object to serializeUser
        done(null, user);
      } catch (err) {
        console.error("Error in Google OAuth strategy:", err);
        done(err, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user); // Log the user being serialized
  done(null, user.id); // Store only the user ID in the session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user with ID:", id); // Log the user ID being deserialized
    // Fetch the user from the database using the ID
    const user = await User.findById(id);
    console.log("Deserialized user:", user); // Log the deserialized user
    done(null, user); // Attach the user object to req.user
  } catch (err) {
    console.error("Error deserializing user:", err); // Log any errors
    done(err, null);
  }
});

module.exports = passport;