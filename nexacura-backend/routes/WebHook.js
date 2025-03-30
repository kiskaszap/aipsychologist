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
        const sig = request.headers["stripe-signature"];
        const rawBody = request.body; // Raw body captured by express.raw
        let event;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST; // Ensure you're using the correct secret key
        try {
          event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret); // Use the raw body
        } catch (err) {
          return response.status(400).send(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
          case "charge.succeeded":
            const charge = event.data.object;
            const chargeUserId = charge.metadata.userId; // Assuming the userId is stored in the charge metadata
            const chargeUser = await User.findById(chargeUserId);

            if (chargeUser) {
              const amount = charge.amount;
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
            } else {
              console.log("User not found for charge event");
            }
            break;
          case "checkout.session.completed":
            const sessionCompleted = event.data.object;
            const sessionUserId = sessionCompleted.metadata.userId; // Assuming the userId is stored in the session metadata
            const sessionUser = await User.findById(sessionUserId);
            if (sessionUser) {             
              const amount = sessionCompleted.amount_total;
              let subscriptionType = "unknown";
              let expiryDate = new Date();
              if (amount === 1000) {  
                subscriptionType = "hourly";
                expiryDate.setMinutes(expiryDate.getMinutes() + 60); 
              } else if (amount === 4000) {  
                subscriptionType = "weekly";
                expiryDate.setDate(expiryDate.getDate() + 7); 
              } else if (amount === 10000) { 
                subscriptionType = "monthly";
                expiryDate.setMonth(expiryDate.getMonth() + 1); 
              }
              sessionUser.subscription.type = subscriptionType;
              sessionUser.subscription.expiry = expiryDate;
              sessionUser.subscription.active = true;
              await sessionUser.save();
            } else {
              console.log("User not found for session completion event");
            }
            break;
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
