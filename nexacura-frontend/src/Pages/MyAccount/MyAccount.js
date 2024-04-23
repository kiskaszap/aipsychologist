import React, { useContext, useState, useEffect } from "react";
import Layout from "../../Components/Dashboard/Layout";
import Text from "../../Components/Text/Text";
import OutlineButton from "../../Components/Button/OutlineButton";
import authenticationContext from "../../context/authenticationContext";
import axios from "axios";

const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  handleChange,
  readOnly = false,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-500">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="px-4 py-3.5 bg-gray-100 text-[#333] w-full text-sm border rounded-md focus:border-primary outline-none mt-2 mb-4"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
      />
    </div>
  );
};

function MyAccount() {
  const { initial, dispatch } = useContext(authenticationContext);
  const [user, setUser] = useState(initial.user);
  const [file, setFile] = useState(null);
  const [bulb, setBulb] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);

  function handleChange(e) {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFile(url); // Set blob URL for image preview
      setBulb(true); // Turn on bulb to indicate a new image is being previewed
      setUser((prev) => ({ ...prev, image: url })); // Update user state with new image for instant feedback
    }
  }

  async function onSubmit(e) {
    console.log(user.image);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("image", user.image);
    formData.append("profession", user.profession);
    formData.append("bio", user.bio);

    try {
      const response = await axios.post(
        "http://localhost:4000/user",
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

            <form className="mx-auto mt-5 grid max-w-2xl" onSubmit={onSubmit}>
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0"></div>
              <InputField
                id="name"
                label="Your full name"
                type="text"
                placeholder="Your full name"
                name="name"
                value={user.name || ""}
                handleChange={handleChange}
              />
              <InputField
                id="email"
                label="Your email"
                type="email"
                placeholder="your.email@mail.com"
                name="email"
                value={user.email || ""}
                handleChange={handleChange}
                readOnly={true}
              />
              <InputField
                id="profession"
                label="Profession"
                type="text"
                placeholder="Your profession"
                name="profession"
                value={user.profession || ""}
                handleChange={handleChange}
              />
              <div className="mb-6">
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-gray-500"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  className="px-4 py-3.5 bg-gray-100 text-[#333] w-full text-sm border rounded-md focus:border-primary outline-none"
                  placeholder="Write your bio here..."
                  value={user.bio || ""}
                  name="bio"
                  onChange={handleChange}
                ></textarea>
              </div>
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
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default MyAccount;
