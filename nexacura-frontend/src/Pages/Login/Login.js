// import React from "react";
// import {
//   FaEnvelope,
//   FaLock,
//   FaGoogle,
//   FaFacebookF,
//   FaTwitter,
// } from "react-icons/fa";
// import Text from "../../Components/Text/Text";
// import { NavLink, useNavigate } from "react-router-dom";
// import OutlineButton from "../../Components/Button/OutlineButton";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import authenticationContext from "../../context/authenticationContext";
// import GoogleButton from "../../Components/Button/GoogleButton";

// function Login() {
//   const { dispatch } = React.useContext(authenticationContext);
//   const [errorMessage, setErrorMessage] = React.useState("");
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:4000/login",
//         data,
//         {
//           withCredentials: true,
//         }
//       );
//       console.log("Response:", response.data);
//       if (response.data.isAuthenticated) {
//         localStorage.setItem(
//           "NexaCuraIsAuthenticated",
//           response.data.isAuthenticated
//         );
//         localStorage.setItem("userData", JSON.stringify(response.data.message));

//         dispatch({
//           type: "LOGIN",
//           payload: {
//             isAuthenticated: response.data.isAuthenticated,
//             user: response.data.message,
//           },
//         });

//         navigate("/"); // Redirect to home/dashboard
//         reset();
//       } else {
//         setErrorMessage("Invalid credentials, please try again."); // Show error message
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setErrorMessage("Login failed, please try again later."); // Handle server or network errors
//     }
//   };

//   return (
//     <div className="font-[sans-serif] text-[#333]">
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <div className="items-center gap-4 px-10 lg:px-0 lg:max-w-3xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
//           <div className="w-full lg:px-6 py-4">
//             <Text className="text-3xl font-extrabold text-primary">
//               Welcome Back
//             </Text>

//             <form onSubmit={handleSubmit(onSubmit)}>
//               <div className="mb-12">
//                 <Text className="text-md text-gray-500 mt-2">
//                   Don't have an account?{" "}
//                   <NavLink to="/register" className="text-secondary">
//                     Register here
//                   </NavLink>
//                 </Text>
//               </div>
//               {errorMessage && (
//                 <Text className="text-red-500 mb-5">{errorMessage}</Text>
//               )}
//               <div>
//                 <label className="text-xs block mb-2">Email</label>
//                 <div className="relative flex items-center">
//                   <input
//                     {...register("email", {
//                       required: "Email is required",
//                       pattern: {
//                         value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
//                         message: "Invalid email format",
//                       },
//                     })}
//                     type="text"
//                     className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
//                     placeholder="Enter email"
//                   />
//                   <FaEnvelope className="text-[#bbb] absolute right-2" />
//                 </div>
//                 {errors.email && (
//                   <span className="text-xs text-red-600">
//                     {errors.email.message}
//                   </span>
//                 )}
//               </div>
//               <div className="mt-8">
//                 <label className="text-xs block mb-2">Password</label>
//                 <div className="relative flex items-center">
//                   <input
//                     {...register("password", {
//                       required: "Password is required",
//                     })}
//                     type="password"
//                     className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
//                     placeholder="Enter password"
//                   />
//                   <FaLock className="text-[#bbb] absolute right-2 cursor-pointer" />
//                 </div>
//                 {errors.password && (
//                   <span className="text-xs text-red-600">
//                     {errors.password.message}
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center justify-between gap-2 mt-5">
//                 <div>
//                   <Text className="text-lg text-gray-500">
//                     <NavLink
//                       to="/reset-password"
//                       className="text-primary text-sm"
//                     >
//                       Forgot password?
//                     </NavLink>
//                   </Text>
//                 </div>
//               </div>
//               <div className="mt-12">
//                 <OutlineButton
//                   borderColor="border-primary"
//                   hoverBorderColor="hover:border-secondary"
//                   textColor="text-white"
//                   hoverTextColor="hover:text-secondary"
//                   buttonText="Login"
//                   hoverBackgroundColor="hover:bg-transparent"
//                   backgroundColor="bg-primary"
//                   width="w-full"
//                 />
//               </div>
//               <div className="mt-5">
//                 <GoogleButton />
//               </div>
              
//               <Text className="text-md text-gray-500 text-center my-5">
//                 By continuing, you agree to accept our{" "}
//                 <NavLink to="/terms" className="text-secondary">
//                   Terms & Conditions
//                 </NavLink>
//               </Text>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Text from "../../Components/Text/Text";
import { NavLink, useNavigate } from "react-router-dom";
import OutlineButton from "../../Components/Button/OutlineButton";
import { useForm } from "react-hook-form";
import axios from "axios";
import authenticationContext from "../../context/authenticationContext";
import GoogleButton from "../../Components/Button/GoogleButton";
import { toast } from "react-toastify"; // Import toast

function Login() {
  const { dispatch } = React.useContext(authenticationContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    // 🛑 **Client-side validation before API request**
    if (!data.email) {
      toast.error("Email is required!");
      return;
    }
    if (!data.password) {
      toast.error("Password is required!");
      return;
    }
    if (!/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(data.email)) {
      toast.error("Invalid email format! Make sure it includes '@' and a valid domain.");
      return;
    }

    toast.loading("Logging in...");

    try {
      const response = await axios.post("http://localhost:4000/login", data, {
        withCredentials: true,
      });

      toast.dismiss(); // Remove loading toast

      if (response.data.isAuthenticated) {
        toast.success("Login successful!");

        localStorage.setItem(
          "NexaCuraIsAuthenticated",
          response.data.isAuthenticated
        );
        localStorage.setItem("userData", JSON.stringify(response.data.message));

        dispatch({
          type: "LOGIN",
          payload: {
            isAuthenticated: response.data.isAuthenticated,
            user: response.data.message,
          },
        });

        navigate("/"); // Redirect to home/dashboard
        reset();
      } else {
        toast.error("Invalid credentials, please try again.");
      }
    } catch (error) {
      toast.dismiss();

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
    <div className="font-[sans-serif] text-[#333]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="items-center gap-4 px-10 lg:px-0 lg:max-w-3xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="w-full lg:px-6 py-4">
            <Text className="text-3xl font-extrabold text-primary">
              Welcome Back
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-12">
                <Text className="text-md text-gray-500 mt-2">
                  Don't have an account?{" "}
                  <NavLink to="/register" className="text-secondary">
                    Register here
                  </NavLink>
                </Text>
              </div>

              {/* Email Input */}
              <div>
                <label className="text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input
                    {...register("email")}
                    type="text"
                    className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
                    placeholder="Enter email"
                  />
                  <FaEnvelope className="text-[#bbb] absolute right-2" />
                </div>
              </div>

              {/* Password Input */}
              <div className="mt-8">
                <label className="text-xs block mb-2">Password</label>
                <div className="relative flex items-center">
                  <input
                    {...register("password")}
                    type="password"
                    className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
                    placeholder="Enter password"
                  />
                  <FaLock className="text-[#bbb] absolute right-2 cursor-pointer" />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-between gap-2 mt-5">
                <div>
                  <Text className="text-lg text-gray-500">
                    <NavLink
                      to="/reset-password"
                      className="text-primary text-sm"
                    >
                      Forgot password?
                    </NavLink>
                  </Text>
                </div>
              </div>

              {/* Login Button */}
              <div className="mt-12">
                <OutlineButton
                  borderColor="border-primary"
                  hoverBorderColor="hover:border-secondary"
                  textColor="text-white"
                  hoverTextColor="hover:text-secondary"
                  buttonText="Login"
                  hoverBackgroundColor="hover:bg-transparent"
                  backgroundColor="bg-primary"
                  width="w-full"
                />
              </div>

              {/* Google Login */}
              <div className="mt-5">
                <GoogleButton />
              </div>

              <Text className="text-md text-gray-500 text-center my-5">
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
