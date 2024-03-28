import React from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Text from "../../Components/Text/Text";
import { NavLink } from "react-router-dom";
import OutlineButton from "../../Components/Button/OutlineButton";
import { useForm } from "react-hook-form";
import axios from "axios";

// Import necessary icons

const iconSelector = (name) => {
  switch (name) {
    case "email":
      return <FaEnvelope className="text-[#bbb] absolute right-2" />;
    case "fullName":
      return <FaUser className="text-[#bbb] absolute right-2" />;
    case "password":
    case "confirmPassword":
      return <FaLock className="text-[#bbb] absolute right-2" />;
    default:
      return null; // Default case if no match
  }
};
const FormInput = ({ label, name, type, placeholder, register, errors }) => {
  return (
    <div>
      {errors && <span className="text-xs text-red-600">{errors.message}</span>}
      <label className="text-xs block mb-2">{label}</label>
      <div className="relative flex items-center">
        <input
          name={name}
          type={type}
          className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
          placeholder={placeholder}
          {...register}
        />
        {iconSelector(name)}
      </div>
    </div>
  );
};

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const password = watch("password", "");
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/registration",
        data
      );
      console.log("Response:", response.data);
      reset();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <div className="font-[sans-serif] text-[#333]">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="items-center gap-4 px-10 lg:px-0 lg:max-w-3xl w-full  shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div className=" w-full lg:px-6 py-4">
            <Text className="text-3xl font-extrabold text-primary">
              Welcome
            </Text>

            <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-5">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  type="text"
                  placeholder="Enter full name"
                  register={register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name should be at least 3 characters",
                    },
                  })}
                  errors={errors.name}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="text"
                  placeholder="Enter email"
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                  errors={errors.email}
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  register={register("password", {
                    required: "You must specify a password",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  })}
                  errors={errors.password}
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  register={register("confirmPassword", {
                    validate: (value) =>
                      value === password || "The passwords do not match",
                  })}
                  errors={errors.confirmPassword}
                />
              </div>
              <div className="flex items-center justify-between gap-2 mt-5">
                <div className="flex items-center"></div>
                <div>
                  <Text className="text-md text-gray-500 mt-2">
                    Already have an account?{" "}
                    <NavLink to="/login" className="text-secondary">
                      Login here
                    </NavLink>
                  </Text>
                </div>
              </div>
              <div className="mt-12">
                <OutlineButton
                  borderColor="border-primary"
                  hoverBorderColor="hover:border-secondary"
                  textColor="text-white"
                  hoverTextColor="hover:text-secondary"
                  buttonText="Register"
                  hoverBackgroundColor="hover:bg-transparent"
                  backgroundColor="bg-primary"
                  width="w-full"
                />
              </div>
              <Text className="text-md text-gray-500  text-center my-5">
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
