import React, { useContext } from "react";
import { Outlet, NavLink } from "react-router-dom";
import OutlineButton from "../Button/OutlineButton";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import ThemeContext from "../../context/ThemeContext";

function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const width = isOpen
    ? "w-screen transition-all duration-300"
    : "w-0 transition-all duration-300";

  return (
    <div className={`lg:hidden flex justify-between items-center px-10 py-3 relative ${isDark ? "bg-gray-900 text-white" : ""}`}>
      <div className={`z-[1001] text-4xl font-bold ${isOpen ? "text-white" : "text-primary"}`}>
        Nexa<span className="text-secondary font-semibold">Cura</span>
      </div>
      <div className="flex gap-3 text-3xl z-[1001]">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <AiOutlineMenuUnfold className="text-white" />
          ) : (
            <AiOutlineMenuFold className={isDark ? "text-white" : "text-primary"} />
          )}
        </button>
      </div>
      <div
        className={`h-screen ${width} absolute top-0 left-0 ${isDark ? "bg-gray-800" : "bg-primary"} z-[1000] overflow-hidden`}
      >
        <div className="flex flex-col gap-y-5 items-center justify-center h-full text-3xl font-bold text-white">
          <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/about" onClick={() => setIsOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</NavLink>
          <NavLink to="/pricing" onClick={() => setIsOpen(false)}>Pricing</NavLink>
          <NavLink to="/login" onClick={() => setIsOpen(false)}>Login</NavLink>
          <NavLink to="/register" onClick={() => setIsOpen(false)}>Register</NavLink>
        </div>
      </div>
    </div>
  );
}

function DefaultNav() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const color = (isActive) => (isActive ? "text-primary" : isDark ? "text-gray-300" : "text-gray-400");
  const style = "hover:text-secondary transition duration-300 ease-in-out";

  return (
    <React.Fragment>
      <nav className={`lg:flex hidden px-10 xl:px-32 py-3 justify-between text-lg items-center font-medium ${isDark ? "text-white bg-gray-900" : "text-gray-400"}`}>
        <div className=" text-primary text-4xl font-bold">
          Nexa<span className="text-secondary font-semibold">Cura</span>
        </div>
        <div className="flex gap-x-3">
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/about">About</NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/contact">Contact</NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/pricing">Pricing</NavLink>
        </div>
        <div className="flex gap-x-3">
          <NavLink to="/login">
            <OutlineButton
              borderColor={isDark ? "border-white" : "border-primary"}
              hoverBorderColor="hover:border-white"
              textColor={isDark ? "text-white" : "text-primary"}
              hoverTextColor="hover:text-white"
              buttonText="Login"
              hoverBackgroundColor="hover:bg-primary"
            />
          </NavLink>
          <NavLink to="/register">
            <OutlineButton
              borderColor={isDark ? "border-secondary" : "border-secondary"}
              hoverBorderColor="hover:border-secondary"
              textColor="text-white"
              hoverTextColor="hover:text-secondary"
              buttonText="Try Now"
              hoverBackgroundColor="hover:bg-transparent"
              backgroundColor={isDark ? "bg-gray-800" : "bg-secondary"}
            />
          </NavLink>
        </div>
      </nav>
      <MobileMenu />
      <Outlet />
    </React.Fragment>
  );
}

export default DefaultNav;
