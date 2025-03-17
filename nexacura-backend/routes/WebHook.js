const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SIGNING_KEY); // Ensure the correct key is set
const User = require("../models/User");

class StripeWebhook {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/",
      express.raw({ type: "application/json" }), // Capture the request body as raw
      async (request, response) => {
        console.log("Stripe webhook hit");

        const sig = request.headers["stripe-signature"];
        const rawBody = request.body; // Raw body captured by express.raw
        console.log("Received raw body:", rawBody);

        let event;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST; // Ensure you're using the correct secret key

        try {
          // Stripe signature verification with raw body (Buffer)
          console.log("Verifying webhook signature...");
          event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret); // Use the raw body

          console.log("Webhook signature verified successfully");
        } catch (err) {
          console.error("Webhook signature verification failed:", err.message);
          return response.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
          case "charge.succeeded":
            const charge = event.data.object;
            console.log("Charge succeeded:", charge.id);

            // Update user subscription upon successful charge
            const chargeUserId = charge.metadata.userId; // Assuming the userId is stored in the charge metadata
            const chargeUser = await User.findById(chargeUserId);

            if (chargeUser) {
              // Logic based on amount captured (e.g., amount is in cents)
              const amount = charge.amount;

              // Example logic to determine subscription type based on charge amount
              let subscriptionType = "unknown";
              let expiryDate = new Date();

              if (amount === 1000) {  // Example: 1000 cents = 10 USD, hourly subscription
                subscriptionType = "hourly";
                expiryDate.setMinutes(expiryDate.getMinutes() + 60); // Expires in 1 hour
              } else if (amount === 4000) {  // Example: 4000 cents = 40 USD, weekly subscription
                subscriptionType = "weekly";
                expiryDate.setDate(expiryDate.getDate() + 7); // Expires in 1 week
              } else if (amount === 10000) {  // Example: 10000 cents = 100 USD, monthly subscription
                subscriptionType = "monthly";
                expiryDate.setMonth(expiryDate.getMonth() + 1); // Expires in 1 month
              }

              chargeUser.subscription.type = subscriptionType;
              chargeUser.subscription.expiry = expiryDate;
              chargeUser.subscription.active = true;
              await chargeUser.save();

              console.log("User subscription updated successfully based on charge");
            } else {
              console.log("User not found for charge event");
            }
            break;

          case "checkout.session.completed":
            const sessionCompleted = event.data.object;
            console.log("Session completed:", sessionCompleted.id);

            // Update user subscription upon successful session completion
            const sessionUserId = sessionCompleted.metadata.userId; // Assuming the userId is stored in the session metadata
            const sessionUser = await User.findById(sessionUserId);

            if (sessionUser) {
              // Logic based on total amount in session (e.g., session.amount_total is in cents)
              const amount = sessionCompleted.amount_total;

              // Example logic to determine subscription type based on session amount
              let subscriptionType = "unknown";
              let expiryDate = new Date();

              if (amount === 1000) {  // Example: 1000 cents = 10 USD, hourly subscription
                subscriptionType = "hourly";
                expiryDate.setMinutes(expiryDate.getMinutes() + 60); // Expires in 1 hour
              } else if (amount === 4000) {  // Example: 4000 cents = 40 USD, weekly subscription
                subscriptionType = "weekly";
                expiryDate.setDate(expiryDate.getDate() + 7); // Expires in 1 week
              } else if (amount === 10000) {  // Example: 10000 cents = 100 USD, monthly subscription
                subscriptionType = "monthly";
                expiryDate.setMonth(expiryDate.getMonth() + 1); // Expires in 1 month
              }

              sessionUser.subscription.type = subscriptionType;
              sessionUser.subscription.expiry = expiryDate;
              sessionUser.subscription.active = true;
              await sessionUser.save();

              console.log("User subscription updated successfully based on session completion");
            } else {
              console.log("User not found for session completion event");
            }
            break;

          // Handle more events as needed...
          default:
            console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.sendStatus(200);
      }
    );
  }
}

module.exports = StripeWebhook;
