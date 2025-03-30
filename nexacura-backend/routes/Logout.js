const BaseRoute = require("./BaseRoute");
const MedicalRecords = require("../models/MedicalRecords");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

class Logout extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", async (req, res) => {
        try {
          if (!req.session.user) {
            return res.status(401).json({ error: "User not authenticated" });
          }
  
          const userId = req.session.user._id;
          const folderPath = path.join(__dirname, "..", "uploads", "conversations", userId);
          const fullTranscriptPath = path.join(folderPath, `${userId}_full.txt`);
          const summaryPath = path.join(folderPath, `${userId}_summary.txt`);
          const conversationJsonPath = path.join(folderPath, `${userId}_conversation.json`);
          if (!fs.existsSync(conversationJsonPath)) {
            return res.status(404).json({ error: "No conversation history found" });
          }
          const conversationData = JSON.parse(fs.readFileSync(conversationJsonPath, "utf-8"));
          const conversationText = conversationData.conversation
            .map((msg) => `${msg.sender}: ${msg.content}`)
            .join("\n");
          const summaryResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: `Summarize the following therapy session while maintaining an empathetic and professional tone:\n\n${conversationText}`,
                },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          const summaryText = summaryResponse.data.choices[0].message.content;
          fs.writeFileSync(fullTranscriptPath, conversationText, "utf-8");
          fs.writeFileSync(summaryPath, summaryText, "utf-8");
          const urgencyResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content: `Analyze the following therapy session and classify the urgency level as one of the following: "Critical - Immediate Attention Required", "Moderate - Needs Monitoring", or "Low - Routine Checkup". ONLY return one of these exact three options and nothing else.\n\n${conversationText}`,
                },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          const urgencyLevel = urgencyResponse.data.choices[0].message.content.trim();
          const newRecord = await MedicalRecords.create({
            userId,
            summaryPath,
            fullTranscriptPath,
            urgency: urgencyLevel,
          });
          req.session.destroy((err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to log out" });
            }
            res.status(200).json({ message: "User logged out successfully" });
          });
        } catch (error) {
          console.error("❌ Error during logout:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });
    
    this.router.post("/admin", async (req, res) => {
        console.log("✅ Admin Logout route reached");
  
        try {
          // ✅ Clear session-related cookies
          res.clearCookie("connect.sid"); // If session exists
          res.clearCookie("adminAuthToken"); // If using JWT or another token
  
          // ✅ Inform frontend to clear local storage
          return res.status(200).json({
            message: "Admin logged out successfully",
            clearLocalStorage: true, // ✅ Signal frontend to remove items
          });
        } catch (error) {
          console.error("❌ Error during admin logout:", error);
          return res.status(500).json({ error: "Failed to log out admin" });
        }
      });
    
  }
}

module.exports = Logout;
