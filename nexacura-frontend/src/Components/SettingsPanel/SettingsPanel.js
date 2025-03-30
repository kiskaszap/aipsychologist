import React, { useContext, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import { FaCog } from "react-icons/fa";

export default function SettingsPanel() {
  const { theme, setTheme, fontSize, setFontSize } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  // 📱 Toggle function for mobile users
  const toggleSettings = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`z-50 fixed right-0 top-1/4 bg-gray-100 dark:bg-gray-900 p-4 shadow-lg transition-transform duration-300
      ${isOpen ? "translate-x-0" : "translate-x-full"} w-52 h-auto`}
      onMouseEnter={() => setIsOpen(true)} //  Open on hover (for desktop)
      onMouseLeave={() => setIsOpen(false)} //  Close on mouse leave
    >
      <button
        className="absolute -left-10 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full focus:outline-none"
        onClick={toggleSettings} // 📱 Click to open/close on mobile
      >
        <FaCog className="text-xl" />
      </button>
      <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">Settings</h3>
      <label className="block mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Colours</span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
        >
          <option value="light">Light mode</option>
          <option value="dark">Dark mode</option>
        </select>
      </label>

      {/*  Font Size Selector */}
      <label className="block mt-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Font-size</span>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-full p-2 border rounded mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
        >
          
          <option value="text-base">Normal</option>
          <option value="text-lg">Large</option>
        </select>
      </label>
    </div>
  );
}
