import React, { useEffect, useId, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSignOutAlt, FaDownload, FaFileAlt } from "react-icons/fa";
import OutlineButton from "../../Components/Button/OutlineButton";

// ✅ Urgency levels from the database
const urgencyLevels = {
  "Critical - Immediate Attention Required": "🟥 Critical - Immediate Attention",
  "Moderate - Needs Monitoring": "🟧 Moderate - Needs Monitoring",
  "Low - Routine Checkup": "🟨 Low - Routine Checkup",
};

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch users with urgency level from the database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/admin-dashboard");
  
      console.log("📢 API Response:", response.data.users); // ✅ Debugging Response
  
      // ✅ Directly store urgency from backend (No manual mapping)
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users");
      console.error("❌ Fetch error:", error);
      setLoading(false);
    }
  };
  
  

  // ✅ Download Full Chat Transcript as TXT
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
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Top Header with Logout Button */}
      <div className="flex flex-col md:flex-row justify-between items-center pb-4 bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          🏥 Admin Dashboard
        </h1>
        <OutlineButton
          buttonText="Logout"
          backgroundColor="bg-red-500"
          textColor="text-white"
          icon={<FaSignOutAlt />}
          onClick={async () => {
            await axios.post("http://localhost:4000/logout/admin", {
              withCredentials: true,
            });
            localStorage.removeItem("userData");
            localStorage.removeItem("NexaCuraIsAuthenticated");
            window.location.href = "/login";
          }}
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-5 mt-4">
        {loading ? (
          <p className="text-center text-lg text-gray-500">Loading users...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Urgency Level</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    {/* Name */}
                    <td className="py-3 px-4">{user.name}</td>

                    {/* Email */}
                    <td className="py-3 px-4">{user.email}</td>

                    {/* Urgency Level Display */}
                    <td
  className={`py-3 px-4 font-bold ${
    user.urgency === "Critical - Immediate Attention Required"
      ? "text-red-600"
      : user.urgency === "Moderate - Needs Monitoring"
      ? "text-orange-500"
      : "text-yellow-500"
  }`}
>
  {user.urgency}
</td>


                    {/* Actions */}
                    <td className="py-3 px-4 flex justify-center space-x-4">
                      {/* Download Full Transcript */}
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleDownloadFullChat(user._id, user.name)}
                      >
                        <FaDownload className="text-xl" title="Download Full Chat" />
                      </button>

                      {/* Download AI Summary */}
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleDownloadAISummary(user._id, user.name)}
                      >
                        <FaFileAlt className="text-xl" title="Download AI Summary" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
