import React, {useContext} from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Text from "../../Components/Text/Text";
import { NavLink, useNavigate } from "react-router-dom";
import OutlineButton from "../../Components/Button/OutlineButton";
import { useForm } from "react-hook-form";
import axios from "axios";
import authenticationContext from "../../context/authenticationContext";
import GoogleButton from "../../Components/Button/GoogleButton";
import { toast } from "react-toastify"; // Import Toastify
import GitHubButton from "../../Components/Button/GithubButton";
import ThemeContext from "../../context/ThemeContext";

function Login() {
  const { dispatch } = React.useContext(authenticationContext);
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const onSubmit = async (data) => {
    // **Client-side validation before API request**
    if (!data.email.trim()) {
      toast.warning("Email is required!");
      return;
    }
    if (!/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(data.email)) {
      toast.warning("Invalid email format! Make sure it includes '@' and a valid domain.");
      return;
    }
    if (!data.password.trim()) {
      toast.warning("Password is required!");
      return;
    }
    const toastId = toast.loading("Logging in...");
    try {
      const response = await axios.post("http://localhost:4000/login", data, {
        withCredentials: true,
      });
      toast.dismiss(toastId); // Remove loading toast
      if (response.data.isAuthenticated) {
        toast.success("Login successful!");
        localStorage.setItem("NexaCuraIsAuthenticated", response.data.isAuthenticated);
        localStorage.setItem("userData", JSON.stringify(response.data.message));
        dispatch({
          type: "LOGIN",
          payload: {
            isAuthenticated: response.data.isAuthenticated,
            user: response.data.message,
          },
        });

        // **Admin Redirection**
        if (data.email === "admin@gmail.com") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
        reset();
      } else {
        toast.error("Invalid credentials, please try again.");
      }
    } catch (error) {
      toast.dismiss(toastId);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error(error.response.data.message || "Invalid credentials!");
        } else {
          toast.error(`Error: ${error.response.data.message || "Something went wrong!"}`);
        }
      } else {
        toast.error("Login failed, please try again later.");
      }

      console.error("Error:", error);
    }
  };

  return (
    <div className={`font-[sans-serif] ${isDark ? "bg-gray-900 text-white" : "text-[#333]"}`}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className={`items-center gap-4 px-10 lg:px-0 lg:max-w-3xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
          <div className="w-full lg:px-6 py-4">
            <Text className={`text-3xl font-extrabold text-primary ${fontSize}`}>
              Welcome Back
            </Text>
  
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-12">
                <Text className={`text-md mt-2 ${fontSize} ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                  Don't have an account?{" "}
                  <NavLink to="/register" className="text-secondary">
                    Register here
                  </NavLink>
                </Text>
              </div>
  
              {/* Email Input */}
              <div>
                <label className={`text-xs block mb-2 ${fontSize} ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</label>
                <div className="relative flex items-center">
                  <input
                    {...register("email")}
                    type="text"
                    className={`w-full border-b px-2 py-3 outline-none ${fontSize} ${isDark ? "bg-transparent border-gray-600 text-white focus:border-secondary" : "border-gray-300 text-black focus:border-secondary"}`}
                    placeholder="Enter email"
                  />
                  <FaEnvelope className={`absolute right-2 ${isDark ? "text-gray-400" : "text-[#bbb]"}`} />
                </div>
              </div>
  
              {/* Password Input */}
              <div className="mt-8">
                <label className={`text-xs block mb-2 ${fontSize} ${isDark ? "text-gray-300" : "text-gray-700"}`}>Password</label>
                <div className="relative flex items-center">
                  <input
                    {...register("password")}
                    type="password"
                    className={`w-full border-b px-2 py-3 outline-none ${fontSize} ${isDark ? "bg-transparent border-gray-600 text-white focus:border-secondary" : "border-gray-300 text-black focus:border-secondary"}`}
                    placeholder="Enter password"
                  />
                  <FaLock className={`absolute right-2 cursor-pointer ${isDark ? "text-gray-400" : "text-[#bbb]"}`} />
                </div>
              </div>
  
              {/* Forgot Password */}
              <div className="flex items-center justify-between gap-2 mt-5">
                <div>
                  <Text className={`text-lg ${fontSize} ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                    <NavLink to="/reset-password" className="text-primary text-sm">
                      Forgot password?
                    </NavLink>
                  </Text>
                </div>
              </div>
  
              {/* Login Button */}
              <div className="mt-12">
                <OutlineButton
                  borderColor={isDark ? "border-gray-500" : "border-secondary"}
                  hoverBorderColor={isDark ? "hover:border-gray-400" : "hover:border-secondary"}
                  textColor="text-white w-full"
                  hoverTextColor={isDark ? "hover:text-gray-300" : "hover:text-secondary"}
                  backgroundColor={isDark ? "bg-gray-800" : "bg-secondary"}
                  hoverBackgroundColor={isDark ? "hover:bg-gray-700" : "hover:bg-transparent"}
                  buttonText="Login"
                />
              </div>
  
              {/* Google / GitHub */}
              <div className="mt-5">
                <GoogleButton />
              </div>
              <div className="mt-5">
                <GitHubButton />
              </div>
  
              {/* Terms */}
              <Text className={`text-md text-center my-5 ${fontSize} ${isDark ? "text-gray-300" : "text-gray-500"}`}>
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

export default Login;
