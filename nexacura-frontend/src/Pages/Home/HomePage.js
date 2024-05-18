import React from "react";
import Text from "../../Components/Text/Text";
import Card from "../../Components/Card/Card";
import Thinking from "../../assets/thinking.jpg";
import OutlineButton from "../../Components/Button/OutlineButton";
import MoreCard from "../../Components/Card/MoreCard";
import Faq from "../../Components/Faq/Faq";
import Footer from "../../Components/Footer/Footer";
import Review from "../../Components/Reviews/Review";
import { NavLink } from "react-router-dom";
import hero from "../../assets/hero-image.png";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { LiaPiggyBankSolid } from "react-icons/lia";
import { IoTimeOutline } from "react-icons/io5";
import { RiChatPrivateLine } from "react-icons/ri";

function HomePage() {
  return (
    <div className="">
      {/* <!-- First Section --> */}
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-16 px-10 xl:px-32 pt-24 pb-32 text-white relative bg-custom-image bg-center bg-cover">
        <div className="flex flex-col gap-y-3 z-10 order-2 lg:order-1">
          <Text className="text-5xl " size="txtOpenSansBold50" htmlTag="h1">
            Your AI Psychologist Companion
          </Text>
          <Text
            className="text-base text-gray-200"
            size="txtPoppinsRegular20"
            htmlTag="h3"
          >
            Connect with understanding and empathy from the comfort of your own
            space. Our AI psychologist, crafted with cutting-edge technology,
            provides confidential support to help you navigate through trauma
            and situations you feel you can't discuss with others. Engage in
            meaningful, private conversations to find solace and understanding,
            anytime you need it.
          </Text>

          <div>
            <NavLink to="/register">
              <OutlineButton
                borderColor="border-secondary"
                hoverBorderColor="hover:border-secondary"
                textColor="text-white"
                hoverTextColor="hover:text-secondary"
                buttonText="Try Now"
                hoverBackgroundColor="hover:bg-transparent"
                backgroundColor="bg-secondary"
              />
            </NavLink>
          </div>
        </div>
        <div className="  w-[25rem] mx-auto flex flex-col gap-y-5 z-10   order-1 lg:order-2">
          <img src={hero} alt="hero" className="" />
        </div>
      </div>

      {/* <!-- Second Section --> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-10 xl:px-32 mt-5 md:mt-[-3rem]">
        <Card
          title="Confidential Conversation"
          description="Experience a safe space for private discussions. Our AI-powered confidential conversations offer you the support and discretion needed to explore sensitive topics without judgment."
          icon={<VscWorkspaceTrusted />}
        />
        <Card
          title="Affordable Access to Care"
          description="Unlock the support you need without the high costs. Our AI psychologist offers professional guidance at a fraction of the price of traditional therapy, making mental wellness accessible to everyone."
          icon={<LiaPiggyBankSolid />}
        />
        <Card
          title="Always Available Counseling"
          description="No schedules, no waiting. Our AI psychologist is available 24/7, providing immediate support whenever you need it. No appointments necessary, just reach out and start the conversation at your convenience."
          icon={<IoTimeOutline />}
        />
        <Card
          title="Private and Personalized Assistance"
          description="Discuss your concerns in a completely private setting. Our AI psychologist tailors conversations to your specific needs, ensuring that you receive personal and confidential advice whenever you seek it."
          icon={<RiChatPrivateLine />}
        />
      </div>

      {/* <!-- Third Section --> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-20 px-10 xl:px-32">
        <div className="flex flex-col gap-y-3 z-10 justify-center">
          <Text
            className="text-5xl text-primary"
            size="txtOpenSansBold50"
            htmlTag="h4"
          >
            Private AI-Assisted Therapy
          </Text>
          <Text className="text-lg text-gray-600 " size="txtPoppinsRegular16">
            Experience confidential and compassionate guidance from our AI
            psychologist anytime you need it. Engage in private conversations
            from the comfort of your home. Our advanced AI technology ensures a
            discreet and supportive environment, helping you work through
            personal challenges without judgment.
          </Text>

          <NavLink to="/register">
            <OutlineButton
              borderColor="border-secondary"
              hoverBorderColor="hover:border-secondary"
              textColor="text-white"
              hoverTextColor="hover:text-secondary"
              buttonText="Try Now"
              hoverBackgroundColor="hover:bg-transparent"
              backgroundColor="bg-secondary"
            />
          </NavLink>
        </div>
        <div className=" order-first lg:order-last">
          <img
            src={Thinking}
            alt="Thinking"
            className=" object-cover h-full w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* <!-- Fourth Section --> */}
      <div class=" px-10 xl:px-32">
        <Text
          size="txtOpenSansBold50"
          className=" text-center text-5xl text-primary"
        >
          Advanced AI Therapy Sessions
        </Text>
        <Text
          size="txtPoppinsMedium16Gray90001"
          className=" text-center text-lg text-gray-600 mt-3"
        >
          "Our AI technology enhances the therapy experience by providing timely
          and accurate responses, ensuring you receive the support you need
          exactly when you need it.
        </Text>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-10 mt-10 xl:px-32">
        <MoreCard
          title="Immediate Emotional Support"
          description="Access emotional support instantly with our AI psychologist, available 24/7. No waiting, no scheduling—just immediate help when you need it most."
        />
        <MoreCard
          title="Tailored Mental Health Guidance"
          description="Our AI technology adapts to your unique mental health needs, providing personalized advice and strategies to help you cope with stress, anxiety, and more."
        />
        <MoreCard
          title="Utmost Privacy and Confidentiality"
          description="Confide in a secure, private environment. Our platform ensures that all conversations are confidential, with the highest standards of data protection and privacy."
        />
        <MoreCard
          title="User-Friendly Interface"
          description="Navigate your path to mental wellness with ease. Our user-friendly interface makes accessing AI-driven therapy simple and stress-free, suitable for all age groups and tech skill levels."
        />
      </div>

      {/* <!-- Fifth Section --> */}
      <Text
        size="txtOpenSansBold50"
        className="lg:pl-0 text-left lg:text-center text-5xl text-primary mt-16 px-10"
      >
        Have a question ? Look here ...
      </Text>
      <Faq />

      {/* <!-- Sixth Section --> */}
      <Review />

      <Footer />
    </div>
  );
}

export default HomePage;
