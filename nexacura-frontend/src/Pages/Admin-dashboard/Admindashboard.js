import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSignOutAlt, FaDownload, FaFileAlt, FaClock } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OutlineButton from "../../Components/Button/OutlineButton";
import ThemeContext from "../../context/ThemeContext";


const urgencyLevels = {
  "Critical - Immediate Attention Required": "🟥 Critical - Immediate Attention",
  "Moderate - Needs Monitoring": "🟦 Moderate - Needs Monitoring",
  "Low - Routine Checkup": "🟩 Low - Routine Checkup",
  
};

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState({}); // Stores appointment dates per user
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch users with urgency level & appointment data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/admin-dashboard");
      console.log("📢 API Response:", response.data.users);

      const usersWithAppointments = response.data.users.map((user) => ({
        ...user,
        urgency: urgencyLevels[user.urgency.trim()] || "🟧 Moderate - Needs Monitoring",
        appointmentDate: user.appointmentDate ? new Date(user.appointmentDate) : null, // Convert string to Date
      }));

      setUsers(usersWithAppointments);

      // ✅ Set appointments state
      const appointmentData = {};
      usersWithAppointments.forEach(user => {
        if (user.appointmentDate) {
          appointmentData[user._id] = user.appointmentDate;
        }
      });
      setAppointments(appointmentData); // ✅ Set state for appointments

      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users");
      console.error("❌ Fetch error:", error);
      setLoading(false);
    }
  };

  // ✅ Handle Date Selection & Save to Backend
  const handleDateChange = async (userId, date) => {
    setAppointments((prev) => ({
      ...prev,
      [userId]: date,
    }));

    try {
      await axios.post("http://localhost:4000/admin-dashboard/appointment", {
        userId,
        appointmentDate: date,
      });

      toast.success("Appointment scheduled successfully!");
    } catch (error) {
      console.error(" Error setting appointment:", error);
      toast.error("Failed to schedule appointment.");
    }
  };

  const handleDownloadFullChat = async (userId, userName) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/admin-dashboard/chat-history/${userId}`,
        { responseType: "blob" } // ✅ Ensure response is treated as a file
      );

      const blob = new Blob([response.data], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${userId}_full_chat.txt`;
      link.click();
      toast.success("Full chat downloaded successfully!");
    } catch (error) {
      console.error("❌ Error fetching chat:", error);
      toast.error("Failed to download chat transcript.");
    }
  };

  // ✅ Download AI Summary as TXT
  const handleDownloadAISummary = async (userId, userName) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/admin-dashboard/summary/${userId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${userId}_summary.txt`;
      link.click();
      toast.success("Summary downloaded successfully!");
    } catch (error) {
      console.error("❌ Error fetching summary:", error);
      toast.error("Failed to download AI summary.");
    }
  };

  return (
    <div className={`min-h-screen p-5 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-[#161931]"} ${fontSize}`}>
      {/* Top Header with Logout Button */}
      <div className={`flex flex-col md:flex-row justify-between items-center pb-4 shadow-md p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <h1 className={`text-2xl md:text-3xl font-bold text-primary ${fontSize}`}>🏥 Admin Dashboard</h1>
        <OutlineButton
          buttonText="Logout"
          backgroundColor="bg-red-500"
          textColor="text-white"
          icon={<FaSignOutAlt />}
          onClick={async () => {
            await axios.post("http://localhost:4000/logout/admin", {}, { withCredentials: true });
            localStorage.removeItem("userData");
            localStorage.removeItem("NexaCuraIsAuthenticated");
            window.location.href = "/login";
          }}
        />
      </div>
  
      {/* Desktop Table */}
      <div className={`hidden md:block overflow-x-auto shadow-md rounded-lg p-5 mt-4 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        {loading ? (
          <p className={`text-center text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading users...</p>
        ) : (
          <table className={`min-w-full ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <thead>
              <tr className={`${isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-left text-sm uppercase tracking-wider"}`}>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Urgency Level</th>
                <th className="py-3 px-4">Appointment</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className={`${isDark ? "border-b border-gray-600 hover:bg-gray-700" : "border-b hover:bg-gray-100"}`}>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 font-bold">{user.urgency}</td>
                    <td className="py-3 px-4 flex items-center space-x-2">
                      <DatePicker
                        selected={appointments[user._id] || null}
                        onChange={(date) => handleDateChange(user._id, date)}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className={`border p-2 rounded-md ${isDark ? "bg-gray-900 text-white border-gray-600" : ""}`}
                      />
                      <FaClock className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                    </td>
                    <td className="py-3 px-4 flex justify-center space-x-4">
                      <button className={`${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`} onClick={() => handleDownloadFullChat(user._id, user.name)}>
                        <FaDownload className="text-xl" title="Download Full Chat" />
                      </button>
                      <button className={`${isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-800"}`} onClick={() => handleDownloadAISummary(user._id, user.name)}>
                        <FaFileAlt className="text-xl" title="Download AI Summary" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
  
      {/* Mobile View */}
      <div className="md:hidden space-y-4 mt-4">
        {users.map((user) => (
          <div key={user._id} className={`p-4 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
            <p className="font-bold">{user.name}</p>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>{user.email}</p>
            <p className="font-bold">{user.urgency}</p>
            <div className="flex items-center space-x-2 mt-2">
              <DatePicker
                selected={appointments[user._id] || null}
                onChange={(date) => handleDateChange(user._id, date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className={`border p-2 rounded-md w-full ${isDark ? "bg-gray-900 text-white border-gray-600" : ""}`}
              />
              <FaClock className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}

export default AdminDashboard;
