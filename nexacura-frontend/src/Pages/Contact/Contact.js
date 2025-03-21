import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import Text from "../../Components/Text/Text";
import Input from "../../Components/Input/Input";
import OutlineButton from "../../Components/Button/OutlineButton";
import { FaEarthAfrica, FaLocationArrow } from "react-icons/fa6";
import Footer from "../../Components/Footer/Footer";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const IconsContact = ({ title, reactIcon }) => {
  return (
    <div className="flex items-center space-x-5">
      <div className="h-10 w-10 border-2 border-[#11a5e9] rounded-full text-white text-xl font-bold flex items-center justify-center shrink-0">
        {reactIcon}
      </div>
      <Text className="text-lg text-white" size="txtPoppinsRegular18">
        {title}
      </Text>
    </div>
  );
};

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (formData) => {
    // **Basic Validation Before Submission**
    if (!formData.name.trim()) {
      toast.warning("Name is required!");
      return;
    }
    if (formData.name.length < 3) {
      toast.warning("Name must be at least 3 characters!");
      return;
    }
    if (!formData.email.trim()) {
      toast.warning("Email is required!");
      return;
    }
    if (!/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(formData.email)) {
      toast.warning("Invalid email format!");
      return;
    }
    if (!formData.subject.trim()) {
      toast.warning("Subject is required!");
      return;
    }
    if (!formData.message.trim()) {
      toast.warning("Message cannot be empty!");
      return;
    }

    toast.loading("Sending message...");

    try {
      const response = await axios.post("http://localhost:4000/contact", formData);
      toast.dismiss();

      if (response.status === 201) {
        toast.success(`Thank you for your message, ${formData.name}!`);
        reset();
      } else {
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error sending message. Please try again later.");
    }
  };

  return (
    <div>
      <Text
        className="text-2xl text-center text-primary mt-24 mb-5"
        size="txtOpenSansBold50"
        htmlTag="h1"
      >
        Contact Us
      </Text>
      <Text className="text-gray-500 text-lg text-center mb-10">
        Feel free to reach out with any questions or feedback through our contact form on the website.
      </Text>
      <div className="my-6 xl:px-32">
        <div className="grid lg:grid-cols-12 xl:p-2 mx-auto bg-white lg:shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md text-[#333] font-[sans-serif]">
          <div className="bg-primary xl:rounded-md p-10 flex flex-col justify-between gap-y-16 lg:col-span-4">
            <div>
              <Text className="text-3xl text-white">Contact Information</Text>
              <Text className="text-white text-lg">Say something to start a chat!</Text>
            </div>
            <div className="flex flex-col gap-y-5">
              <IconsContact title="Address: Glasgow, United Kingdom G131JP" reactIcon={<FaLocationArrow />} />
              <IconsContact title="Email: support@nexacura.chat" reactIcon={<FaEnvelope />} />
              <IconsContact title="Website: www.nexacura.chat" reactIcon={<FaEarthAfrica />} />
            </div>
            <div className="">
              <ul className="flex mt-3 space-x-4">
                <a href="https://www.facebook.com">
                  <li className="bg-white text-secondary h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <FaFacebook />
                  </li>
                </a>
                <a href="https://www.linkedin.com">
                  <li className="bg-white text-secondary h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <FaLinkedin />
                  </li>
                </a>
                <a href="https://www.instagram.com">
                  <li className="bg-white text-secondary h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <FaInstagram />
                  </li>
                </a>
              </ul>
            </div>
          </div>

          <form className="space-y-4 p-10 lg:col-span-7" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Name"
              type="text"
              name="name"
              placeholder="Name"
              register={register("name")}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              register={register("email")}
            />
            <Input
              label="Subject"
              type="text"
              name="subject"
              placeholder="Subject"
              register={register("subject")}
            />
            <Input
              label="Message"
              type="textarea"
              name="message"
              placeholder="Message"
              register={register("message")}
            />
            <OutlineButton
              borderColor="border-primary"
              hoverBorderColor="hover:border-secondary"
              textColor="text-white"
              hoverTextColor="hover:text-secondary"
              buttonText="Send Message"
              hoverBackgroundColor="hover:bg-transparent"
              backgroundColor="bg-primary"
            />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
