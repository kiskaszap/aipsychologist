import React, { useContext, useState, useEffect } from "react";
import Layout from "../../Components/Dashboard/Layout";
import Text from "../../Components/Text/Text";
import OutlineButton from "../../Components/Button/OutlineButton";
import authenticationContext from "../../context/authenticationContext";
import axios from "axios";
import { useForm } from "react-hook-form";

const InputField = ({ id, label, type, placeholder, register, errors }) => {
  return (
    <div>
      {errors && <span className="text-xs text-red-600">{errors.message}</span>}
      <label className="text-xs block mb-2">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          id={id}
          name={id} // Ensure name matches id for consistency with form registration
          className="w-full text-sm border-b border-gray-300 focus:border-secondary px-2 py-3 outline-none"
          placeholder={placeholder}
          {...register} // Correct usage of register
        />
      </div>
    </div>
  );
};

function MyAccount() {
  const { initial, dispatch } = useContext(authenticationContext);
  const [user, setUser] = useState(initial.user);
  const [bulb, setBulb] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  // const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const password = watch("password"); // Make sure this matches the registration name

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      console.log("storedUserData", storedUserData);
      setUser(JSON.parse(storedUserData));
    }
  }, []);
  const passwordSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      // Make sure names match the register call
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        "https://nexacura-f522fa3d182e.herokuapp.com/new-password",
        { password: data.password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setPopupMessage("Password updated successfully.");
      } else {
        setPopupMessage("Failed to update password.");
      }
      setShowPopup(true);
      reset(); // Reset form fields after successful update
    } catch (error) {
      console.error("Error updating password:", error);
      setPopupMessage("Error updating password.");
      setShowPopup(true);
    }
  });

  function handleChange(e) {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  // function handlePasswordChange(e) {
  //   setPassword(e.target.value);
  // }
  // function handleNewPasswordChange(e) {
  //   setNewPassword(e.target.value);
  // }

  async function onSubmit(e) {
    console.log(user.image);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("image", user.image);

    try {
      const response = await axios.post(
        "https://nexacura-f522fa3d182e.herokuapp.com/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      dispatch({
        type: "PROFILE_UPDATE",
        payload: {
          user: response.data.user,
        },
      });
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setBulb(false); // Turn off bulb after successful upload
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  return (
    <Layout>
      <div className="flex w-full flex-col gap-3 bg-white px-3 text-[#161931] md:flex-row">
        <main className=" h-full w-full py-1  xl:w-4/5 ">
          <div className="w-full  sm:max-w-xl sm:rounded-lg">
            <Text className="text-2xl font-bold sm:text-xl text-primary">
              Profile
            </Text>
            {showPopup && (
              <div className="absolute top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <p>{popupMessage}</p>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <form className="mx-auto mt-5 grid max-w-2xl" onSubmit={onSubmit}>
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0"></div>
              <InputField
                id="name"
                label="Your full name"
                type="text"
                placeholder={user.name ? user.name : "Your full name"}
                name="name"
                value={user.name || ""}
                handleChange={handleChange}
              />
              <InputField
                id="email"
                label="Your email"
                type="email"
                placeholder={user.email ? user.email : "Your email"}
                name="email"
                value={user.email || ""}
                handleChange={handleChange}
                readOnly={true}
              />
              <InputField
                id="profession"
                label="Profession"
                type="text"
                placeholder={user.profession ? user.profession : "Profession"}
                name="profession"
                value={user.profession || ""}
                handleChange={handleChange}
              />

              <div className="flex justify-end">
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
            <form onSubmit={handleSubmit(passwordSubmit)} className="mt-5">
              <InputField
                id="password"
                label="New Password"
                type="password"
                placeholder="Enter new password"
                register={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                errors={errors.password}
              />
              <InputField
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                register={register("confirmPassword", {
                  validate: (value) =>
                    value === password || "The passwords do not match",
                })}
                errors={errors.confirmPassword}
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
