import React, { useState, useEffect, useContext } from "react";
import SideBarData from "../SideBarItem/SideBarData";
import ToggleNavData from "../SideBarItem/ToggleNavData";
import ThemeContext from "../../context/ThemeContext";

import { sidebarItems, bottomSidebarItems } from "../../data/SideBarData";
import { toggleItems, toggleBottomItems } from "../../data/ToggleData";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

function SideNavDashBoard() {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 750);

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 750);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : ""} ${fontSize}`}>
      {isLargeScreen ? (
        <div className="w-72 h-screen overflow-hidden">
          <div className={`p-3 overflow-y-auto text-center h-full ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
            <div className="text-xl flex items-center justify-center">
              <div className={`text-4xl font-bold text-secondary`}>
                Nexa<span className={`${isDark ? "text-white" : "text-primary"} font-semibold`}>Cura</span>
              </div>
            </div>
            <div className="flex flex-col justify-around h-full py-10">
              <div>
                {sidebarItems.map((item) => (
                  <SideBarData key={item.label} {...item} />
                ))}
              </div>
              <div>
                {bottomSidebarItems.map((item) => (
                  <SideBarData key={item.label} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            className="top-5 left-5 z-50"
            onClick={toggleSidebar}
            style={{ color: isDark ? "white" : "black" }}
          >
            {isOpen ? (
              <AiOutlineMenuFold className={`text-4xl ${isDark ? "text-white" : "text-primary"}`} />
            ) : (
              <AiOutlineMenuUnfold className={`text-4xl ${isDark ? "text-white" : "text-primary"}`} />
            )}
          </button>

          {isOpen && (
            <div className={`w-screen h-screen flex flex-col ${isDark ? "bg-gray-800 text-white" : "bg-blue-500 text-white"}`}>
              <div className="p-3 text-center overflow-y-auto flex-col">
                <div className="text-xl flex">
                  <div className="w-full text-4xl font-bold text-secondary justify-center">
                    Nexa
                    <span className={`font-semibold ${isDark ? "text-white" : "text-white"}`}>Cura</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between h-full py-10">
                  {toggleItems.map((item) => (
                    <ToggleNavData key={item.label} {...item} closeNav={closeSidebar} />
                  ))}
                  {toggleBottomItems.map((item) => (
                    <ToggleNavData key={item.label} {...item} closeNav={closeSidebar} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SideNavDashBoard;
