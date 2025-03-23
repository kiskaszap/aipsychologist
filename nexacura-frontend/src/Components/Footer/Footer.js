import React, { useContext } from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import Text from "../Text/Text";
import { NavLink } from "react-router-dom";
import ThemeContext from "../../context/ThemeContext";

function Footer() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const getYear = () => new Date().getFullYear().toString();

  const color = (isActive) =>
    isActive ? "text-secondary" : isDark ? "text-yellow-200" : "text-white";

  const style = "transition duration-300 ease-in-out";

  return (
    <div>
      <div
        className={`grid grid-cols-1 md:grid-cols-4 gap-10 px-10 xl:px-32 ${
          isDark ? "bg-gray-900" : "bg-primary"
        } p-10 mt-20`}
      >
        <div className="flex flex-col gap-y-5 col-span-2">
          <div className="text-secondary text-4xl font-bold">
            Nexa
            <span className={`${isDark ? "text-white" : "text-white"} font-semibold`}>
              Cura
            </span>
          </div>
          <Text className={`${isDark ? "text-gray-300" : "text-white"}`}>
            Our cutting-edge AI technology offers compassionate and interactive therapy sessions,
            designed to bring personalized psychological support to life. Experience engaging and
            educational conversations that help you navigate life's challenges with newfound clarity
            and insight.
          </Text>
          <div className="flex text-white text-xl gap-3">
            <a href="https://www.linkedin.com/">
              <FaLinkedin className="cursor-pointer hover:text-secondary duration-300 transition ease-out" />
            </a>
            <a href="https://www.facebook.com/">
              <FaFacebook className="cursor-pointer hover:text-secondary duration-300 transition ease-out" />
            </a>
            <a href="https://www.youtube.com/">
              <FaYoutube className="cursor-pointer hover:text-secondary duration-300 transition ease-out" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          <Text
            className={`${isDark ? "text-yellow-300" : "text-white"} text-xl`}
            size="txtPoppinsMedium16"
          >
            Quick Links
          </Text>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/">
            <Text size="txtPoppinsRegular14">Home</Text>
          </NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/about">
            <Text size="txtPoppinsRegular14">About</Text>
          </NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/pricing">
            <Text size="txtPoppinsRegular14">Pricing</Text>
          </NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/register">
            <Text size="txtPoppinsRegular14">Register</Text>
          </NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/login">
            <Text size="txtPoppinsRegular14">Login</Text>
          </NavLink>
        </div>

        <div className="flex flex-col gap-y-3">
          <Text
            className={`${isDark ? "text-yellow-300" : "text-white"} text-xl`}
            size="txtPoppinsMedium16"
          >
            Support
          </Text>
          <Text className={`${isDark ? "text-yellow-100" : "text-white"}`} size="txtPoppinsRegular14">
            FAQs
          </Text>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/contact">
            <Text size="txtPoppinsRegular14">Contact</Text>
          </NavLink>
          <NavLink className={({ isActive }) => `${color(isActive)} ${style}`} to="/privacy">
            <Text size="txtPoppinsRegular14">Privacy Policy</Text>
          </NavLink>
        </div>
      </div>

      <div className={`${isDark ? "bg-gray-800" : "bg-secondary"} py-2`}>
        <Text
          className={`text-center ${
            isDark ? "text-gray-300" : "text-white"
          }`}
        >
          @ {getYear()} NexaCura All rights reserved.
        </Text>
      </div>
    </div>
  );
}

export default Footer;
