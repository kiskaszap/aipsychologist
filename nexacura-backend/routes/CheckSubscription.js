const BaseRoute = require("./BaseRoute");
const mongoose = require("mongoose");
const User = require("../models/User");

class SubscriptionChecker extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", async (req, res) => {
    
      if (!req.session || !req.session.user) {
        res.json({
          hasSubscription: false,
          message: "User not logged in. ",
          message2: req.session,
        });
        return;
      }

      try {
        const user = await User.findById(req.session.user._id);

        if (!user) {
          console.log("No user found with the provided ID.");
          res.json({
            hasSubscription: false,
            message: "No user found with the provided ID.",
          });
          return;
        }

        const { subscription } = user;
        if (!subscription) {
          console.log("User has no subscription details.");
          res.json({
            hasSubscription: false,
            message: "User has no subscription details.",
          });
          return;
        }

        // Check if the subscription is active and not expired
        const now = new Date();
        if (
          subscription.active &&
          subscription.expiry &&
          new Date(subscription.expiry) <= now
        ) {
          // If the subscription is expired, update the user's subscription details
          subscription.active = false;
          subscription.expiry = null;
          subscription.type = null;

          // Save the updated user object to the database
          await user.save();

          console.log("Subscription has been updated due to expiry.");
        }

        const isSubscriptionActive = subscription.active;
        res.json({
          hasSubscription: isSubscriptionActive,
          type: subscription.type,
          expiry: subscription.expiry,
        });
      } catch (error) {
        console.error("Error checking user subscription:", error);
        res.status(500).json({
          hasSubscription: false,
          message: "Failed to check subscription status.",
        });
      }
    });
  }
}

module.exports = SubscriptionChecker;
