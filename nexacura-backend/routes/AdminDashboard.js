const BaseRoute = require("./BaseRoute");
const User = require("../models/User");
const MedicalRecords = require("../models/MedicalRecords");
const fs = require("fs");
const path = require("path");

class AdminDashboard extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // ✅ Fetch all users with urgency levels
    this.router.get("/", async (req, res) => {
        console.log("📢 Admin Dashboard API called");
      
        try {
          // ✅ Fetch users
          const users = await User.find({}, "name email");
      
          // ✅ Attach urgency level from MedicalRecords
          const updatedUsers = await Promise.all(
            users.map(async (user) => {
              const record = await MedicalRecords.findOne({ userId: user._id }).select("urgency");
              return {
                _id: user._id,
                name: user.name,
                email: user.email,
                urgency: record ? record.urgency : "Moderate - Needs Monitoring", // Default to Moderate
              };
            })
          );
      
          console.log("✅ Users fetched with urgency:", updatedUsers);
      
          res.json({
            status: "success",
            users: updatedUsers,
          });
        } catch (error) {
          console.error("❌ Error fetching users:", error);
          res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
      });
      

    // ✅ Fetch Full Chat History as TXT
    this.router.get("/chat-history/:userId", async (req, res) => {
      const { userId } = req.params;
      console.log(`📢 Fetching chat history for user: ${userId}`);

      const transcriptPath = path.join(__dirname, "../uploads/conversations", userId, `${userId}_full.txt`);

      if (!fs.existsSync(transcriptPath)) {
        return res.status(404).json({ error: "Chat history not found" });
      }

      res.sendFile(transcriptPath);
    });

    // ✅ Fetch AI Summary as TXT
    this.router.get("/summary/:userId", async (req, res) => {
      const { userId } = req.params;
      console.log(`📢 Fetching AI summary for user: ${userId}`);

      const summaryPath = path.join(__dirname, "../uploads/conversations", userId, `${userId}_summary.txt`);

      if (!fs.existsSync(summaryPath)) {
        return res.status(404).json({ error: "Summary not found" });
      }

      res.sendFile(summaryPath);
    });
  }
}

module.exports = AdminDashboard;
