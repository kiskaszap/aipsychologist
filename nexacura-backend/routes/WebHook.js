const BaseRoute = require("./BaseRoute");
const stripe = require("stripe")(process.env.STRIPE_SIGNING_KEY);
const express = require("express");
const User = require("../models/User");

class StripeWebhook extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/",
      express.raw({ type: "*/*" }),
      async (request, response) => {
        const sig = request.headers["stripe-signature"];
        const rawBody = request.body;

        let event;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        try {
          event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        } catch (err) {
          response.status(400).send(`Webhook Error: ${err.message}`);
          console.log(err.message);
          return;
        }

        // Handle the event
        switch (event.type) {
          case "checkout.session.created":
            break;
          case "payment_intent.succeeded":
            break;
          case "charge.succeeded":
            break;
          case "payment_intent.created":
            // Handle payment intent created event

            break;
          case "checkout.session.completed":
            const checkoutSessionCompleted = event.data.object;
            console.log(checkoutSessionCompleted.metadata.userId);
            console.log(checkoutSessionCompleted.amount_total);
            console.log(checkoutSessionCompleted.payment_status);
            console.log(checkoutSessionCompleted.status);

            if (
              checkoutSessionCompleted.payment_status === "paid" &&
              checkoutSessionCompleted.status === "complete" &&
              checkoutSessionCompleted.metadata.userId
            ) {
              console.log("Payment is successful");

              // Calculate subscription type and expiry date based on the charged amount
              let subscriptionType;
              let expiryDate;
              if (checkoutSessionCompleted.amount_total === 1000) {
                subscriptionType = "hourly";
                expiryDate = new Date();
                expiryDate.setMinutes(expiryDate.getMinutes() + 60); // Expires 60 minutes later
              } else if (checkoutSessionCompleted.amount_total === 4000) {
                subscriptionType = "weekly";
                expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 7); // Expires a week later
              } else if (checkoutSessionCompleted.amount_total === 10000) {
                subscriptionType = "monthly";
                expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + 1); // Expires a month later
              }

              // Update the user's subscription status in the database
              const user = await User.findById(
                checkoutSessionCompleted.metadata.userId
              );
              if (user) {
                user.subscription.type = subscriptionType;
                user.subscription.expiry = expiryDate;
                user.subscription.active = true;
                await user.save();
                console.log("User subscription status updated successfully");
              } else {
                console.log("User not found");
              }
            }
            break;

          // Add more cases for other event types as needed
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
