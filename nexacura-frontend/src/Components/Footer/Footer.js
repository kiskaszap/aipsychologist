/**
 * The `Footer` function in React renders a footer component with company information, social media
 * links, quick links, and support information.
 * @returns The `Footer` component is being returned, which consists of a footer section with company
 * information, social media links, quick links, and support links. The footer also includes the
 * current year and copyright information.
 */
import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import Text from "../Text/Text";
import { NavLink } from "react-router-dom";

function Footer() {
  /**
   * The function `getYear` returns the current year as a string.
   * @returns The function `getYear` returns the current year as a string.
   */
  const getYear = () => {
    return new Date().getFullYear().toString();
  };
  /**
   * The function `color` returns either "text-secondary" or "text-white" based on the value of the
   * `isActive` parameter.
   * @param isActive - The `isActive` parameter is a boolean value that determines whether an element is
   * currently active or not. If `isActive` is true, the function will return the CSS class
   * "text-secondary", indicating that the text should be displayed in a secondary color. If `isActive`
   * is false, the function will
   */
  const color = (isActive) => (isActive ? "text-secondary" : "text-white");
  const style = "transition duration-300 ease-in-out";

  return (
    <div>
      <div class="grid grid-cols-1 md:grid-cols-4  gap-10 px-10 xl:px-32 bg-primary p-10 mt-20">
        <div class="flex flex-col gap-y-5 col-span-2">
          <div className=" text-secondary text-4xl font-bold">
            Nexa<span className="text-white font-semibold">Cura</span>
          </div>
          <Text className="text-white">
            Our cutting-edge AI technology offers compassionate and interactive
            therapy sessions, designed to bring personalized psychological
            support to life. Experience engaging and educational conversations
            that help you navigate life's challenges with newfound clarity and
            insight.
          </Text>
          <div className="flex text-white text-xl gap-3 ">
            <a href="https://www.linkedin.com/">
              <FaLinkedin className=" cursor-pointer hover:text-secondary duration-300 transition ease-out" />
            </a>
            <a href="https://www.facebook.com/">
              <FaFacebook className=" cursor-pointer hover:text-secondary duration-300 transition ease-out" />
            </a>
            <a href="https://www.youtube.com/">
              <FaYoutube className=" cursor-pointer hover:text-secondary duration-300 transition ease-out" />
            </a>
          </div>
        </div>
        <div class="flex flex-col gap-y-3">
          <Text className="text-white text-xl" size="txtPoppinsMedium16">
            Quick Links
          </Text>
          <NavLink
            className={({ isActive }) => `${color(isActive)} ${style}`}
            to="/"
          >
            <Text size="txtPoppinsRegular14">Home</Text>
          </NavLink>
          <NavLink
            className={({ isActive }) => `${color(isActive)} ${style}`}
            to="/about"
          >
            <Text size="txtPoppinsRegular14">About</Text>
          </NavLink>
          <NavLink
            className={({ isActive }) => `${color(isActive)} ${style}`}
            to="/pricing"
          >
            <Text size="txtPoppinsRegular14">Pricing</Text>
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => `${color(isActive)} ${style}`}
          >
            <Text size="txtPoppinsRegular14">Register</Text>
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => `${color(isActive)} ${style}`}
          >
            <Text size="txtPoppinsRegular14">Login</Text>
          </NavLink>
        </div>
        <div class="">
          <div class="flex flex-col gap-y-3">
            <Text className="text-white text-xl" size="txtPoppinsMedium16">
              Support
            </Text>
            <Text className="text-white" size="txtPoppinsRegular14">
              FAQs
            </Text>
            <NavLink
              className={({ isActive }) => `${color(isActive)} ${style}`}
              to="/contact"
            >
              <Text size="txtPoppinsRegular14">Contact</Text>
            </NavLink>
            <NavLink
              className={({ isActive }) => `${color(isActive)} ${style}`}
              to="/privacy"
            >
              <Text size="txtPoppinsRegular14">Privacy Policy</Text>
            </NavLink>
          </div>
        </div>
      </div>
      <div className="bg-secondary py-2">
        <Text className="text-white col-span-4 text-center">
          @ {getYear()} NexaCura All rights reserved.
        </Text>
      </div>
    </div>
  );
}

export default Footer;
