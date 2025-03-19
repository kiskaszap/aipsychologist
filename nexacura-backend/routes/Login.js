// const BaseRoute = require("./BaseRoute");
// const EmailChecker = require("../utilities/EmailChecker");
// const Authentification = require("../utilities/Authentification");

// class Login extends BaseRoute {
//   constructor() {
//     super();
//     this.initializeRoutes();
//   }

//   initializeRoutes() {
//     this.router.post("/", async (request, response) => {
//       const { email, password } = request.body;

//       try {
//         // Ellenőrizzük, hogy az email létezik-e az adatbázisban
//         const doesEmailExist = await new EmailChecker().checkEmail(email);
//         if (!doesEmailExist) {
//           return response.status(401).json({
//             isAuthenticated: false,
//             message: "Invalid email address!",
//           });
//         }

//         // Felhasználó hitelesítése
//         const userData = await new Authentification(password, email).verifyUser();
//         if (!userData) {
//           return response.status(401).json({
//             isAuthenticated: false,
//             message: "Invalid credentials!",
//           });
//         }

//         // Kivesszük a jelszót az adatokból
//         const { password: userPassword, _id, ...userDetails } = userData;

//         // Ellenőrizzük, hogy az admin jelentkezett-e be
//         const isAdmin = email === "admin@gmail.com";

//         // Mentjük a felhasználót a session-ben
//         request.session.user = {
//           _id: _id.toString(), // MongoDB ObjectId-t stringgé alakítjuk
//           ...userDetails,
//         };

//         // Session mentése és válasz küldése
//         request.session.save((err) => {
//           if (err) {
//             throw new Error("Session save failed.");
//           }

//           response.json({
//             isAuthenticated: true,
//             user: request.session.user,
//             isAdmin, // Visszaküldjük az admin státuszt
//           });
//         });
//       } catch (error) {
//         console.error("Login error:", error);
//         response.status(500).json({
//           error: "Internal server error",
//           details: error.message,
//         });
//       }
//     });
//   }
// }

// module.exports = Login;
const BaseRoute = require("./BaseRoute");
const EmailChecker = require("../utilities/EmailChecker");
const Authentication = require("../utilities/Authentification");

class Login extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    
    this.router.post("/", async (request, response) => {
      const { email, password } = request.body;

      try {
        console.log("🔹 Login attempt:", email); // ✅ Check login attempt

        // ✅ Step 1: Check if the email exists in the database
        const doesEmailExist = await new EmailChecker().checkEmail(email);
        if (!doesEmailExist) {
          return response.status(401).json({
            isAuthenticated: false,
            message: "Invalid email address!",
          });
        }

        // ✅ Step 2: Authenticate the user
        const userData = await new Authentication(password, email).verifyUser();
        if (!userData) {
          return response.status(401).json({
            isAuthenticated: false,
            message: "Invalid credentials!",
          });
        }

        // ✅ Step 3: Extract and return user details
        const { password: userPassword, _id, ...userDetails } = userData;
        request.session.user = {
          _id: _id.toString(),
          ...userDetails,
        };

        console.log("✅ User authenticated:", request.session.user); // ✅ Debug log

        // ✅ Step 4: Save session and return userData
        request.session.save((err) => {
          if (err) {
            throw new Error("Session save failed.");
          }
          response.json({
            isAuthenticated: true,
            message: request.session.user, // ✅ Send full user data
          });
        });

      } catch (error) {
        console.error("❌ Login error:", error);
        response
          .status(500)
          .json({ error: "Internal server error", details: error.message });
      }
    });
  }
}

module.exports = Login;
