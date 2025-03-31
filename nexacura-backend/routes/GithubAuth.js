const BaseRoute = require("./Baseroute");
const passport = require("passport");

class GitHubAuth extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      "/",
      (req, res, next) => {
        console.log("GitHub auth route called");
        next();
      },
      passport.authenticate("github", { scope: ["user:email"] })
    );
    this.router.get(
      "/callback",
      passport.authenticate("github", { failureRedirect: "/" }),
      async (req, res) => {
        if (!req.user) {
          return res.status(401).json({ error: "GitHub authentication failed" });
        }
        req.session.user = {
          _id: req.user._id,
          user_id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        };
        req.session.save((err) => {
          if (err) {
            console.error("Session save failed:", err);
            return res.status(500).json({ error: "Session save failed" });
          }
          res.send(`<script>window.close()</script>`);
        });
      }
    );

    // 🔹 Logout route
    this.router.get("/logout", (req, res) => {
      req.logout(() => {
        req.session.destroy(() => {
          res.redirect("http://localhost:3000/");
        });
      });
    });

    // 🔹 Get authenticated user info
    this.router.get("/user", (req, res) => {
      console.log("Fetching authenticated GitHub user info:", req.session.user);
      res.json(req.session.user || null);
    });
  }
}

module.exports = GitHubAuth;
