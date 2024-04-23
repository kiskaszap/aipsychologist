import React from "react";
import { FaEnvelope } from "react-icons/fa"; // Using the envelope icon for the email input
import Text from "../../Components/Text/Text";
import OutlineButton from "../../Components/Button/OutlineButton";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/reset-password",
        data
      );
      console.log("Reset link sent:", response.data);
      // Optionally navigate to a "Reset Email Sent" page or display a message
    } catch (error) {
      console.error("Failed to send reset link:", error);
    }
  };

  return (
    <div className="font-[sans-serif] text-[#333]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="px-10 lg:px-0 lg:max-w-3xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="py-4 lg:px-6 w-full ">
            <Text className="text-3xl font-extrabold text-primary py-6">
              Reset Your Password
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
                <label className="text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
                    className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Invalid email format",
                      },
                    })}
                  />
                  <FaEnvelope className="text-[#bbb] absolute right-2" />
                </div>
              </div>
              <div className="mt-12">
                <OutlineButton
                  borderColor="border-primary"
                  hoverBorderColor="hover:border-secondary"
                  textColor="text-white"
                  hoverTextColor="hover:text-secondary"
                  buttonText="Send Reset Link"
                  hoverBackgroundColor="hover:bg-transparent"
                  backgroundColor="bg-primary"
                  width="w-full"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
