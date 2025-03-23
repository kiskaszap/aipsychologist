import React, { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import Text from "../../Components/Text/Text";
import about from "../../assets/about.jpeg";
import OutlineButton from "../../Components/Button/OutlineButton";
import about2 from "../../assets/about2.jpeg";
import Review from "../../Components/Reviews/Review";
import Footer from "../../Components/Footer/Footer";
import OurTeam from "../../Components/OurTeam/OurTeam";
import { NavLink } from "react-router-dom";

function About() {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* first section */}
      <div className={`flex flex-col`}>
        <div className={`flex gap-16 px-10 xl:px-32 pt-24 pb-20 xl:pb-60 relative ${isDark? "bg-custom-image-dark":"bg-custom-image"} bg-center bg-cover`}>
          <div className="flex flex-col gap-y-5 z-10 xl:w-[90%]">
            <Text className={`text-5xl ${fontSize} text-white`} size="txtOpenSansBold50" htmlTag="h1">
              About us
            </Text>
            <Text className={`text-xl text-white ${fontSize}`} size="txtPoppinsRegular20" htmlTag="h3">
              We understand the struggle of coping with anxiety and the isolation of a panic attack when there seems to be no one to talk to. That's why we created Nexacura. Our platform provides round-the-clock AI-driven psychological support, offering immediate, confidential help. Nexacura was developed to ensure that no one has to face their darkest moments alone. Our AI psychologists are here to guide you through your mental health journey, making support accessible anytime, anywhere.
            </Text>
            <NavLink to="/contact">
              <OutlineButton
                borderColor={isDark ? "border-gray-500" : "border-secondary"}
                hoverBorderColor={isDark ? "hover:border-gray-400" : "hover:border-secondary"}
                textColor="text-white"
                hoverTextColor={isDark ? "hover:text-gray-300" : "hover:text-secondary"}
                backgroundColor={isDark ? "bg-gray-800" : "bg-secondary"}
                hoverBackgroundColor={isDark ? "hover:bg-gray-700" : "hover:bg-transparent"}
                buttonText="Try Now"
              />
            </NavLink>
          </div>
        </div>
        <div className="xl:px-32 w-full z-50 xl:mt-[-10rem] order-first xl:order-last ">
          <img
            src={about}
            alt="about"
            className="h-[30rem] xl:h-[35rem] w-full object-cover xl:rounded-lg"
          />
        </div>
      </div>

      {/* second section */}
      <div className="xl:mt-20 flex flex-col xl:flex-row xl:px-32 gap-x-10">
        <div className="flex flex-col gap-y-5 justify-center px-10 xl:px-0 pt-16 pb-8 xl:pt-0 xl:pb-0">
          <Text className={`text-2xl text-primary ${fontSize}`} size="txtOpenSansBold50" htmlTag="h1">
            Our Mission
          </Text>
          <Text className={`text-base ${isDark ? "text-gray-300" : "text-gray-600"} ${fontSize}`} size="txtPoppinsRegular20" htmlTag="h3">
            At Nexacura, our mission is clear: to help as many people around the world as we possibly can...
          </Text>
          <NavLink to="/contact">
            <OutlineButton
              borderColor={isDark ? "border-gray-500" : "border-secondary"}
              hoverBorderColor={isDark ? "hover:border-gray-400" : "hover:border-secondary"}
              textColor="text-white"
              hoverTextColor={isDark ? "hover:text-gray-300" : "hover:text-secondary"}
              backgroundColor={isDark ? "bg-gray-800" : "bg-secondary"}
              hoverBackgroundColor={isDark ? "hover:bg-gray-700" : "hover:bg-transparent"}
              buttonText="Try Now"
            />
          </NavLink>
        </div>
        <div className="order-first xl:order-last">
          <img
            src={about2}
            alt="about"
            className="h-[25rem] w-[250rem] object-cover xl:rounded-lg"
          />
        </div>
      </div>

      {/* third section */}
      <div className="xl:mt-20 flex flex-col xl:flex-row gap-10 xl:px-32 gap-x-10">
        <div className="flex flex-col gap-y-5 justify-center px-10 xl:px-0 pt-8 xl:pt-0 xl:pb-0">
          <Text className={`text-2xl text-primary ${fontSize}`} size="txtOpenSansBold50" htmlTag="h1">
            Who we are
          </Text>
          <Text className={`text-base ${isDark ? "text-gray-300" : "text-gray-600"} ${fontSize}`} size="txtPoppinsRegular20" htmlTag="h3">
            Nexacura emerged from a collective passion to address the often overlooked and underserved area of mental health...
          </Text>
          <NavLink to="/contact">
            <OutlineButton
              borderColor={isDark ? "border-gray-500" : "border-secondary"}
              hoverBorderColor={isDark ? "hover:border-gray-400" : "hover:border-secondary"}
              textColor="text-white"
              hoverTextColor={isDark ? "hover:text-gray-300" : "hover:text-secondary"}
              backgroundColor={isDark ? "bg-gray-800" : "bg-secondary"}
              hoverBackgroundColor={isDark ? "hover:bg-gray-700" : "hover:bg-transparent"}
              buttonText="Try Now"
            />
          </NavLink>
        </div>
        <div className="order-first mt-10 xl:mt-0">
          <img
            src={about2}
            alt="about"
            className="h-[25rem] w-[250rem] object-cover xl:rounded-lg"
          />
        </div>
      </div>

      {/* final sections */}
      <Review />
      <Footer />
    </div>
  );
}

export default About;
