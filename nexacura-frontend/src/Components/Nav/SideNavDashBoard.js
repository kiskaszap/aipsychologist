/**
 * The SideNavDashBoard function renders a sidebar component with sidebar items and bottom sidebar
 * items using React.
 * @returns The `SideNavDashBoard` component is being returned. It contains a sidebar layout with a
 * logo, sidebar items, and bottom sidebar items rendered using the `SideBarData` component.
 */
// import React, { useState } from "react";
// import SideBarData from "../SideBarItem/SideBarData";
// import { sidebarItems, bottomSidebarItems } from "../../data/SideBarData";
// import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

// function SideNavDashBoard() {
//   const [isOpen, setIsOpen] = useState(false);

//   // Function to toggle sidebar visibility
//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };
//   return (
//     <div>
//       <button
//         className="fixed top-5 left-5 z-50 lg:hidden"
//         onClick={toggleSidebar}
//         style={{ color: "white" }} // Ensure the icon color is white
//       >
//         {isOpen ? (
//           <AiOutlineMenuUnfold className="text-4xl" />
//         ) : (
//           <AiOutlineMenuFold className="text-4xl" />
//         )}
//       </button>
// <div className=" w-0 overflow-hidden lg:w-72 h-screen ">
//   <div className="p-3 overflow-y-auto text-center bg-gray-100 h-full flex flex-col">
//     <div className="text-xl">
//       <div className=" flex items-center">
//         <div className="z-[1001] text-4xl font-bold text-secondary">
//           Nexa<span className="text-primary font-semibold">Cura</span>
//         </div>
//       </div>
//     </div>
//     <div className="flex flex-col h-full justify-between py-10">
//       <div>
//         {sidebarItems.map((item) => (
//           <SideBarData key={item.label} {...item} />
//         ))}
//       </div>
//       <div>
//         {bottomSidebarItems.map((item) => (
//           <SideBarData key={item.label} {...item} />
//         ))}
//       </div>
//     </div>
//   </div>
// </div>
//     </div>
//   );
// }

// export default SideNavDashBoard;

import React, { useState, useEffect } from "react";
import SideBarData from "../SideBarItem/SideBarData";
import ToggleNavData from "../SideBarItem/ToggleNavData";

import { sidebarItems, bottomSidebarItems } from "../../data/SideBarData";
import { toggleItems, toggleBottomItems } from "../../data/ToggleData";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

function SideNavDashBoard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 750);

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 750);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const closeSidebar = () => {
    setIsOpen(false); // This will close the sidebar
  };

  return (
    <div className={isOpen ? "bg-blue-500" : ""}>
      {/* Render button on small screens and full sidebar on large screens using a ternary operator */}
      {isLargeScreen ? (
        <div className="w-72 h-screen overflow-hidden">
          <div className="p-3 overflow-y-auto text-center bg-gray-100 h-full">
            <div className="text-xl flex items-center justify-center">
              <div className="text-4xl font-bold text-secondary">
                Nexa<span className="text-primary font-semibold">Cura</span>
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
            className=" top-5 left-5 z-50"
            onClick={toggleSidebar}
            style={{ color: "white" }} // Ensure the icon color is white
          >
            {isOpen ? (
              <AiOutlineMenuFold className="text-4xl text-white" />
            ) : (
              <AiOutlineMenuUnfold className="text-4xl text-primary" />
            )}
          </button>

          {/* Conditional rendering of sidebar based on isOpen state */}
          {isOpen && (
            <div className="w-screen h-screen bg-blue-500 flex flex-col ">
              <div className="p-3 text-center overflow-y-auto flex-col">
                <div className="text-xl flex  ">
                  <div className="w-full text-4xl font-bold text-secondary justify-center">
                    Nexa
                    <span className="text-white font-semibold text-center">
                      Cura
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-between h-full py-10">
                  {toggleItems.map((item) => (
                    <ToggleNavData
                      key={item.label}
                      {...item}
                      closeNav={closeSidebar}
                    />
                  ))}
                  {toggleBottomItems.map((item) => (
                    <ToggleNavData
                      key={item.label}
                      {...item}
                      closeNav={closeSidebar}
                    />
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
