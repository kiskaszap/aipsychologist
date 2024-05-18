import React from "react";
import Text from "../../Components/Text/Text";
import about from "../../assets/about.jpeg";
import OutlineButton from "../../Components/Button/OutlineButton";
import about2 from "../../assets/about2.jpeg";
import Review from "../../Components/Reviews/Review";
import Footer from "../../Components/Footer/Footer";
import OurTeam from "../../Components/OurTeam/OurTeam";
import { NavLink } from "react-router-dom";

function About() {
  return (
    <div>
      {/* first section */}
      <div className="flex flex-col">
        <div className="flex gap-16 px-10 xl:px-32 pt-24 pb-20 xl:pb-60 text-white relative bg-custom-image bg-center bg-cover ">
          <div className="flex flex-col gap-y-5 z-10 xl:w-[90%]">
            <Text className="text-5xl " size="txtOpenSansBold50" htmlTag="h1">
              About us
            </Text>
            <Text
              className="text-xl text-gray-200"
              size="txtPoppinsRegular20"
              htmlTag="h3"
            >
              We understand the struggle of coping with anxiety and the
              isolation of a panic attack when there seems to be no one to talk
              to. That's why we created Nexacura. Our platform provides
              round-the-clock AI-driven psychological support, offering
              immediate, confidential help. Nexacura was developed to ensure
              that no one has to face their darkest moments alone. Our AI
              psychologists are here to guide you through your mental health
              journey, making support accessible anytime, anywhere.
            </Text>
            <NavLink to="/contact">
              <OutlineButton
                borderColor="border-secondary"
                hoverBorderColor="hover:border-secondary"
                textColor="text-white"
                hoverTextColor="hover:text-secondary"
                buttonText="Contact"
                hoverBackgroundColor="hover:bg-transparent"
                backgroundColor="bg-secondary"
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
      <div className=" xl:mt-20 flex flex-col xl:flex-row xl:px-32 gap-x-10 ">
        <div className="flex flex-col gap-y-5 justify-center   px-10 xl:px-0 pt-16 pb-8 xl:pt-0 xl:pb-0">
          <Text
            className="text-5xl text-primary"
            size="txtOpenSansBold50"
            htmlTag="h1"
          >
            Our Mission
          </Text>
          <Text
            className="text-base text-gray-400"
            size="txtPoppinsRegular20"
            htmlTag="h3"
          >
            At Nexacura, our mission is clear: to help as many people around the
            world as we possibly can. We believe that mental health support
            should be universal—a right, not a privilege. By leveraging
            cutting-edge AI technology, we provide 24/7 access to psychological
            care, ensuring that anyone, anywhere, can reach out for help
            whenever they need it, without barriers. Our dedication is rooted in
            the understanding that mental health challenges do not
            discriminate—they can affect anyone, regardless of their background
            or circumstances. With this in mind, we have developed a platform
            that is not only accessible but also confidential and sensitive to
            the needs of its users. Each feature of our service is designed with
            the goal of making effective psychological support more inclusive
            and approachable.
          </Text>
          <NavLink to="/contact">
            <OutlineButton
              borderColor="border-secondary"
              hoverBorderColor="hover:border-secondary"
              textColor="text-white"
              hoverTextColor="hover:text-secondary"
              buttonText="Contact"
              hoverBackgroundColor="hover:bg-transparent"
              backgroundColor="bg-secondary"
            />
          </NavLink>
        </div>
        <div className=" order-first xl:order-last">
          <img
            src={about2}
            alt="about"
            className=" h-[25rem] w-[250rem] object-cover xl:rounded-lg"
          />
        </div>
      </div>
      {/* third section */}
      <div className=" xl:mt-20 flex flex-col xl:flex-row gap-10 xl:px-32 gap-x-10">
        <div className="flex flex-col gap-y-5 justify-center px-10 xl:px-0 pt-8 xl:pt-0 xl:pb-0">
          <Text
            className="text-5xl text-primary"
            size="txtOpenSansBold50"
            htmlTag="h1"
          >
            Who we are
          </Text>
          <Text
            className="text-base text-gray-400"
            size="txtPoppinsRegular20"
            htmlTag="h3"
          >
            Nexacura emerged from a collective passion to address the often
            overlooked and underserved area of mental health. We are a team of
            technologists, psychologists, and advocates who believe in the power
            of technology to transform lives. Our journey began with a shared
            vision to integrate AI with the empathy and understanding of human
            psychology, creating a platform that delivers personalized,
            effective mental health support accessible to all, anytime and
            anywhere. We recognize the intricate challenges faced by individuals
            dealing with mental health issues and the stigmatization that often
            silences them. Our solution, Nexacura, uses advanced artificial
            intelligence to mimic the nuanced understanding of a human
            therapist, providing users with the benefits of therapeutic
            conversations without the barriers of traditional mental health
            services. We are committed to privacy, ensuring that every
            interaction remains confidential and secure, fostering a safe space
            for healing and growth.
          </Text>
          <NavLink to="/contact">
            <OutlineButton
              borderColor="border-secondary"
              hoverBorderColor="hover:border-secondary"
              textColor="text-white"
              hoverTextColor="hover:text-secondary"
              buttonText="Contact"
              hoverBackgroundColor="hover:bg-transparent"
              backgroundColor="bg-secondary"
            />
          </NavLink>
        </div>
        <div className=" order-first mt-10 xl:mt-0">
          <img
            src={about2}
            alt="about"
            className=" h-[25rem] w-[250rem] object-cover xl:rounded-lg"
          />
        </div>
      </div>
      {/* fourth section */}

      <Review />
      <Footer />
    </div>
  );
}

export default About;
