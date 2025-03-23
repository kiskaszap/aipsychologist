import React, { useContext } from "react";
import { FaCheck } from "react-icons/fa";
import Text from "../Text/Text";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";

function SubscriptionCard2({ name, price, duration, benefits, isActive }) {
  const navigate = useNavigate();
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const fontSizeClass = fontSize === "text-lg" ? "text-lg" : "text-base";

  function handleSelectPlan() {
    navigate("/login");
  }

  return (
    <div
      className={`transition-all duration-500 hover:scale-105 rounded-md overflow-hidden shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] 
        ${isActive ? "ring-4 ring-primary" : ""} 
        ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}
    >
      <div className="text-center p-4 bg-gradient-to-r from-primary to-[#11a5e9]">
        <Text className={`text-xl font-semibold mb-1 ${fontSizeClass} text-white`}>{name}</Text>
        <Text className={`text-xs text-white ${fontSizeClass}`}>{duration}</Text>
      </div>

      <div className="text-center -mt-8 mb-4">
        <div className="h-24 w-24 mx-auto shadow-xl rounded-full bg-gradient-to-r from-primary to-[#11a5e9] text-white flex items-center justify-center">
          <Text className={`text-2xl font-semibold ${fontSizeClass}`}>{price}</Text>
        </div>
      </div>

      <div className="px-6 py-4">
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className={`flex items-center text-sm ${isDark ? "text-gray-300" : "text-gray-500"}`}
            >
              <FaCheck className="mr-2 text-green-500" /> {benefit}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSelectPlan}
          className={`w-full mt-4 outline-none font-bold border border-primary hover:border-secondary transition-all duration-200
            ${isDark 
              ? "bg-gray-700 text-white hover:bg-gray-600 hover:text-yellow-300"
              : "bg-primary text-white hover:bg-transparent hover:text-secondary"}`}
        >
          Select Plan
        </button>
      </div>
    </div>
  );
}

export default SubscriptionCard2;
