import React, { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

function Card({ title, description, icon }) {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const isLarge = fontSize === "text-lg";

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden px-6 pt-10 pb-8 shadow-xl ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-lg sm:px-10
        ${isDark ? "bg-gray-800 ring-gray-700" : "bg-white ring-gray-900/5"}`}
    >
      <span
        className={`absolute top-10 z-0 h-20 w-20 rounded-full transition-all duration-300 group-hover:scale-[13]
        ${isDark ? "bg-gray-600" : "bg-sky-500"}`}
      ></span>

      <div className="relative z-10 mx-auto max-w-md">
        <span
          className={`grid h-20 w-20 place-items-center rounded-full text-4xl font-bold transition-all duration-300
          ${isDark ? "bg-gray-600 text-white group-hover:bg-gray-500 group-hover:text-yellow-400" : "bg-sky-500 text-white group-hover:bg-sky-400 group-hover:text-[#eab676]"}`}
        >
          {icon}
        </span>

        <div
          className={`space-y-6 pt-5 leading-7 transition-all duration-300
          ${isDark ? "text-gray-300 group-hover:text-white/90" : "text-gray-600 group-hover:text-white/90"}`}
        >
          <h3
            className={`text-2xl ${
              isLarge ? "text-3xl" : ""
            } font-bold leading-7 transition-colors 
            ${
              isDark
                ? "text-yellow-400 group-hover:text-yellow-300"
                : "text-primary group-hover:text-[#eab676]"
            }`}
          >
            {title}
          </h3>

          <p
            className={`text-base ${isLarge ? "text-lg" : ""} ${
              isDark ? "text-gray-400" : ""
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Card;
