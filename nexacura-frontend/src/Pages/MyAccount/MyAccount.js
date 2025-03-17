import React, { useContext, useState, useEffect } from "react";
import Layout from "../../Components/Dashboard/Layout";
import Text from "../../Components/Text/Text";
import OutlineButton from "../../Components/Button/OutlineButton";
import authenticationContext from "../../context/authenticationContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const InputField = ({ id, label, type, placeholder, register }) => {
  return (
    <div className="">
      <label className="text-xs block  ">{label}</label>
      <div className="relative flex items-center ">
        <input
          type={type}
          id={id}
          name={id}
          className="w-full text-sm focus:border-secondary px-2 py-3 outline-none "
          placeholder={placeholder}
          {...register}
        />
      </div>
    </div>
  );
};

function MyAccount() {
  const { initial, dispatch } = useContext(authenticationContext);
  const [user, setUser] = useState(initial.user);
  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  // **Handle password change**
  const passwordSubmit = handleSubmit(async (data) => {
    if (!data.password || !data.confirmPassword) {
      toast.warning("Please fill in all password fields.");
      return;
    }
    if (data.password.length < 8) {
      toast.warning("Password must be at least 8 characters long.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }

    toast.loading("Updating password...");

    try {
      const response = await axios.post(
        "http://localhost:4000/new-password",
        { password: data.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.dismiss();

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        reset();
      } else {
        toast.error("Failed to update password.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error updating password. Please try again.");
    }
  });

  // **Handle profile update**
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user.name.trim() || !user.email.trim()) {
      toast.warning("Name and Email are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    if (user.image) formData.append("image", user.image);

    toast.loading("Updating profile...");

    try {
      const response = await axios.post("http://localhost:4000/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.dismiss();
      toast.success("Profile updated successfully!");

      dispatch({
        type: "PROFILE_UPDATE",
        payload: { user: response.data.user },
      });

      localStorage.setItem("userData", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      toast.dismiss();
      toast.error("Error updating profile. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="flex w-full flex-col gap-3 bg-white px-3 text-[#161931] md:flex-row">
        <main className="h-full w-full py-1 xl:w-4/5">
          <div className="w-full sm:max-w-xl sm:rounded-lg">
            <Text className="text-2xl font-bold sm:text-xl text-primary">
              Profile
            </Text>

            <form className="mx-auto mt-5 grid max-w-2xl " onSubmit={onSubmit}>
              <InputField
                id="name"
                label="Your full name"
                type="text"
                placeholder={user.name || "Your full name"}
                register={register("name")}
              />
              <InputField
                id="email"
                label="Your email"
                type="email"
                placeholder={user.email || "Your email"}
                register={register("email")}
              />
              <InputField
                id="profession"
                label="Profession"
                type="text"
                placeholder={user.profession || "Profession"}
                register={register("profession")}
              />

              <div className="flex justify-end mt-5">
                <OutlineButton
                  borderColor="border-primary"
                  hoverBorderColor="hover:border-primary"
                  textColor="text-white"
                  hoverTextColor="hover:text-primary"
                  buttonText="Save"
                  hoverBackgroundColor="hover:bg-transparent"
                  backgroundColor="bg-primary"
                  
                />
              </div>
            </form>

            {/* Password Update Form */}
            <form onSubmit={passwordSubmit} className="mt-5 gap-5">
              <InputField
                id="password"
                label="New Password"
                type="password"
                placeholder="Enter new password"
                register={register("password")}
              />
              <InputField
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                register={register("confirmPassword")}
              />

              <div className="flex justify-end mt-5">
                <OutlineButton
                  borderColor="border-primary"
                  hoverBorderColor="hover:border-secondary"
                  textColor="text-white"
                  hoverTextColor="hover:text-secondary"
                  buttonText="Save"
                  hoverBackgroundColor="hover:bg-transparent"
                  backgroundColor="bg-primary"
                  
                />
              </div>
            </form>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default MyAccount;
