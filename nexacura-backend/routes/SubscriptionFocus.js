const UserModel = require("../models/User");
const BaseRoute = require("./Baseroute");

class SubscriptionFocus extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Route to get active subscription using session data
    this.router.get("/", async (request, response) => {
      console.log(request.session.user._id, "Subscription");
      if (!request.session || !request.session.user._id) {
        return response.status(401).json({ message: "User not logged in" });
      }

      try {
        const user = await UserModel.findById(request.session.user._id);
        console.log(user, "User");
        if (user && user.subscription) {
          response.json({
            message: "Active subscription retrieved successfully",
            subscription: user.subscription,
          });
        } else {
          response.status(201).json({ subscription: user.subscription });
        }
      } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Error retrieving subscription" });
      }
    });

    // Route to update active subscription using session data
  }
}

module.exports = SubscriptionFocus;
