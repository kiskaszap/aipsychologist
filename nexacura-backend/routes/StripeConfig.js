const BaseRoute = require("./BaseRoute");
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

class StripeConfig extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (req, res) => {
      console.log("Received item:", req.body.item);
      const storeItems = new Map([
        [1, { priceInCents: 1000, name: "Focus Hour" }],
        [2, { priceInCents: 4000, name: "Discovery Week" }],
        [3, { priceInCents: 10000, name: "Pathfinder Month" }],
      ]);

      try {
        if (!req.body.item || !Array.isArray(req.body.item)) {
          throw new Error("Invalid item data");
        }

        const line_items = req.body.item.map((id) => {
          const storeItem = storeItems.get(id);
          if (!storeItem) {
            throw new Error(`No item found for ID ${id}`);
          }
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInCents,
            },
            quantity: 1,
          };
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: line_items,
          success_url: `${process.env.CLIENT_URL}/`,
          cancel_url: `${process.env.CLIENT_URL}/my-subscription`,
        });

        res.json({ url: session.url });
      } catch (e) {
        console.error("Error creating Stripe session:", e);
        res.status(500).json({ error: e.message });
      }
    });
  }
}

module.exports = StripeConfig;
