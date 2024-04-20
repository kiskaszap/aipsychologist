const BaseRoute = require("./BaseRoute");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);
const bodyParser = require("body-parser");

class StripeWebhook extends BaseRoute {
  constructor() {
    super();
    this.endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your Stripe webhook secret
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      "/",
      bodyParser.raw({ type: "application/json" }), // Use raw body parser for webhook handling

      async (req, res) => {
        console.log(req.body.id);
        console.log(req.body.data.object.object);
        console.log(req.body.data.object.amount_captured);
        console.log(req.body.data.object.paid);
        console.log(req.body.data.object.status);
        res.json({ success: true });
      }
    );
  }
}

module.exports = StripeWebhook;
