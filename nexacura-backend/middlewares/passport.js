const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
require("dotenv").config();

// ✅ GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });


        // 🔁 Check by email if githubId not found
        if (!user && profile.emails?.[0]?.value) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.githubId = profile.id;
            await user.save();
          }
        }

        // 🆕 Create new if still not found
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || "",
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile received:", profile);

        // 🔍 First, check if the user exists by email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          console.log("User found in database:", user);
          // ✅ If user exists but does NOT have a Google ID, update it
          if (!user.googleId) {
            console.log("Updating user with Google ID:", user);
            user.googleId = profile.id;
            await user.save();
            console.log("Updated user with Google ID:", user);
          } else {
            console.log("User already exists with Google ID:", user);
          }
        } else {
          // 🆕 If no user is found, create a new one
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          console.log("New user created:", user);
        }

        // 🔁 Return the user
        done(null, user);
      } catch (err) {
        console.error("Error in Google OAuth strategy:", err);
        done(err, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;