import React, { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

function Input({ label, type, placeholder, name, register, errors }) {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const fontSizeClass = fontSize === "text-lg" ? "text-lg" : "text-base";

  return (
    <React.Fragment>
      <div className="flex flex-col space-y-1">
        {errors && (
          <span className="text-xs text-red-600">{errors.message}</span>
        )}
        <label
          htmlFor={name}
          className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}
        >
          {label}
        </label>

        {type !== "textarea" ? (
          <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            className={`w-full py-2.5 px-4 border-b outline-none 
              ${fontSizeClass} 
              ${isDark 
                ? "bg-gray-800 text-white border-gray-600 focus:border-secondary" 
                : "bg-white text-black border-gray-300 focus:border-secondary"}`}
            {...register}
          />
        ) : (
          <textarea
            name={name}
            id={name}
            placeholder={placeholder}
            rows="6"
            className={`w-full rounded-md px-4 pt-2.5 outline-none 
              ${fontSizeClass} 
              ${isDark 
                ? "bg-gray-800 text-white border border-gray-600 focus:border-secondary" 
                : "bg-white text-black border border-gray-300 focus:border-secondary"}`}
            {...register}
          ></textarea>
        )}
      </div>
    </React.Fragment>
  );
}

export default Input;
