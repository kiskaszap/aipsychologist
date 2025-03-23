import React, { useContext } from "react";
import ProfileDashNav from "../ProfileDashNav/ProfileDashNav";
import ThemeContext from "../../context/ThemeContext";

function Layout({ children }) {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div
      className={`p-3 lg:pr-10 h-screen overflow-scroll w-full lg:w-custom transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black"
      } ${fontSize}`}
    >
      <ProfileDashNav />
      {children}
    </div>
  );
}

export default Layout;
