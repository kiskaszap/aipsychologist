import React, { useContext } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Text from "../../Components/Text/Text";
import { NavLink, useNavigate } from "react-router-dom";
import OutlineButton from "../../Components/Button/OutlineButton";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import GoogleButton from "../../Components/Button/GoogleButton";
import GitHubButton from "../../Components/Button/GithubButton";
import ThemeContext from "../../context/ThemeContext";

const iconSelector = (name, isDark) => {
  const baseStyle = isDark ? "text-gray-400" : "text-[#bbb]";
  switch (name) {
    case "email":
      return <FaEnvelope className={`${baseStyle} absolute right-2`} />;
    case "fullName":
      return <FaUser className={`${baseStyle} absolute right-2`} />;
    case "password":
    case "confirmPassword":
      return <FaLock className={`${baseStyle} absolute right-2`} />;
    default:
      return null;
  }
};

const FormInput = ({ label, name, type, placeholder, register, isDark, fontSize }) => {
  return (
    <div>
      <label className={`text-xs block mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          name={name}
          type={type}
          className={`w-full border-b px-2 py-3 outline-none ${fontSize} ${
            isDark
              ? "bg-transparent border-gray-600 text-white focus:border-secondary"
              : "border-gray-300 focus:border-secondary"
          }`}
          placeholder={placeholder}
          {...register}
        />
        {iconSelector(name, isDark)}
      </div>
    </div>
  );
};


function Register() {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch } = useForm();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    if (!data.fullName.trim()) return toast.warning("Full Name is required!");
    if (!data.email.trim()) return toast.warning("Email is required!");
    if (!/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(data.email)) return toast.warning("Invalid email format!");
    if (!data.password) return toast.warning("Password is required!");
    if (data.password.length < 8) return toast.warning("Password must be at least 8 characters!");
    if (data.password !== data.confirmPassword) return toast.warning("Passwords do not match!");

    toast.loading("Registering...");
    try {
      const formattedData = {
        name: data.fullName,
        email: data.email,
        password: data.password,
      };
      const response = await axios.post("http://localhost:4000/registration", formattedData);
      toast.dismiss();

      if (response.data.isRegistered) {
        toast.success("Registration successful! Redirecting...");
        reset();
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Registration failed. Try again.");
      }
    } catch (error) {
      toast.dismiss();
      if (error.response?.status === 409) toast.error("Email is already in use!");
      else if (error.response?.status === 400) toast.warning(error.response.data.message || "Check your inputs!");
      else toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={`font-[sans-serif] ${isDark ? "bg-gray-900 text-white" : "text-[#333]"}`}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className={`items-center gap-4 px-10 lg:px-0 lg:max-w-3xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="w-full lg:px-6 py-4">
            <Text className={`text-3xl font-extrabold text-primary ${fontSize}`}>
              Welcome
            </Text>

            <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-5">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  type="text"
                  placeholder="Enter full name"
                  register={register("fullName")}
                  isDark={isDark}
                  fontSize={fontSize}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="text"
                  placeholder="Enter email"
                  register={register("email")}
                  isDark={isDark}
                  fontSize={fontSize}
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  register={register("password")}
                  isDark={isDark}
                  fontSize={fontSize}
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  register={register("confirmPassword")}
                  isDark={isDark}
                  fontSize={fontSize}
                />
              </div>

              <div className="flex items-center justify-between gap-2 mt-5">
                <Text className={`text-md mt-2 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                  Already have an account?{" "}
                  <NavLink to="/login" className="text-secondary">
                    Login here
                  </NavLink>
                </Text>
              </div>

              <div className="mt-12">
                <OutlineButton
                  borderColor={isDark ? "border-gray-500" : "border-primary"}
                  hoverBorderColor={isDark ? "hover:border-gray-400" : "hover:border-secondary"}
                  textColor="text-white"
                  hoverTextColor={isDark ? "hover:text-gray-300" : "hover:text-secondary"}
                  buttonText="Register"
                  hoverBackgroundColor={isDark ? "hover:bg-gray-700" : "hover:bg-transparent"}
                  backgroundColor={isDark ? "bg-gray-800" : "bg-primary"}
                  width="w-full"
                />
              </div>

              <div className="mt-5">
                <GoogleButton />
              </div>
              <div className="mt-5">
                <GitHubButton />
              </div>

              <Text className={`text-md text-center my-5 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                By continuing, you agree to accept our{" "}
                <NavLink to="/terms" className="text-secondary">
                  Terms & Conditions
                </NavLink>
              </Text>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
