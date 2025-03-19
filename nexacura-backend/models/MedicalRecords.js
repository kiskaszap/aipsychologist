const mongoose = require("mongoose");

const MedicalRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  summaryPath: { type: String, required: true }, // ✅ Path to summary file
  fullTranscriptPath: { type: String, required: true }, // ✅ Path to full transcript
  urgency: {
    type: String,
    enum: ["Critical - Immediate Attention Required", "Moderate - Needs Monitoring", "Low - Routine Checkup"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const MedicalRecords = mongoose.model("MedicalRecords", MedicalRecordSchema);
module.exports = MedicalRecords;
