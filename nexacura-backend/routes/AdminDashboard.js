const BaseRoute = require("./BaseRoute");
const User = require("../models/User");
const MedicalRecords = require("../models/MedicalRecords");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

class AdminDashboard extends BaseRoute {
  constructor() {
    super();
    this.initializeRoutes();
  }

  // ✅ Configure Nodemailer Transporter
  configureMailTransporter() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Environment variable for security
        pass: process.env.EMAIL_PASS, // Store password securely
      },
    });
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
            const record = await MedicalRecords.findOne({ userId: user._id }).select("urgency appointmentDate");
            return {
              _id: user._id,
              name: user.name,
              email: user.email,
              urgency: record ? record.urgency : "Moderate - Needs Monitoring", // Default to Moderate
              appointmentDate: record ? record.appointmentDate : null, // Include appointment date
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

    // ✅ Schedule Appointment & Notify User via Email
    this.router.post("/appointment", async (req, res) => {
      console.log("📢 Appointment Update API Called");
      const { userId, appointmentDate } = req.body;

      try {
        // ✅ Fetch user email
        const user = await User.findById(userId);
        if (!user || !user.email) {
          return res.status(404).json({ error: "User not found or has no email" });
        }

        // ✅ Update the medical record with the new appointment date
        const updatedRecord = await MedicalRecords.findOneAndUpdate(
          { userId },
          { appointmentDate },
          { new: true }
        );

        if (!updatedRecord) {
          return res.status(404).json({ error: "User medical record not found" });
        }

        // ✅ Send Appointment Email to User
        const transporter = this.configureMailTransporter();
await transporter.sendMail({
  from: `"NexaCura Support" <support@nexacura.co.uk>`,
  to: user.email, // ✅ Send to the correct user
  subject: "Your Mental Health Appointment Has Been Scheduled",
  text: `Dear ${user.name || user.email},

We want to inform you that a mental health specialist has scheduled an appointment for you. This session, lasting approximately one hour, will take place at the following location:

📅 Date & Time: ${new Date(appointmentDate).toLocaleString()}  
📍 Location: **NexaCura Mental Health Centre**  
🏢 **45 West George Street, Glasgow G2 1DH, United Kingdom**  

This appointment is an opportunity to discuss your thoughts, feelings, and any challenges you may be facing in a safe and supportive space. The specialist will work with you to explore coping strategies and provide guidance tailored to your needs.

If you have any concerns or need to reschedule, please don’t hesitate to reach out. Your well-being is important to us, and we are here to support you every step of the way.

Take care,  
**NexaCura Support Team**  
support@nexacura.co.uk  
`,
});


        console.log(`✅ Appointment updated & email sent to ${user.email}`);
        res.status(200).json({ message: "Appointment scheduled successfully" });
      } catch (error) {
        console.error("❌ Error updating appointment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
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
