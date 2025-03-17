import React from "react";
import { FaEnvelope } from "react-icons/fa";
import Text from "../../Components/Text/Text";
import OutlineButton from "../../Components/Button/OutlineButton";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // 🚀 **Validation before submission**
    if (!data.email.trim()) {
      toast.warning("Email is required!");
      return;
    }
    if (!/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(data.email)) {
      toast.warning("Invalid email format!");
      return;
    }

    toast.loading("Sending reset link...");

    try {
      const response = await axios.post("http://localhost:4000/reset-password", data);
      toast.dismiss();

      if (response.data.status === "success") {
        toast.success("A new password has been sent to your email!");
        reset();
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Email not found in our database!");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="font-[sans-serif] text-[#333]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="px-10 lg:px-0 lg:max-w-3xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className="py-4 lg:px-6 w-full">
            <Text className="text-3xl font-extrabold text-primary py-6">
              Reset Your Password
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
              <div className="mt-8">
                <label className="text-xs block mb-2">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
                    className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                  <FaEnvelope className="text-[#bbb] absolute right-2" />
                </div>
              </div>

              {/* Submit Button */}
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
