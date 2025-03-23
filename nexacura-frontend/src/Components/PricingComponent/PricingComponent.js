import React, { useContext } from "react";
import Text from "../Text/Text";
import SubscriptionCard2 from "../Card/SubsciptionCard2";
import subscriptions from "../../data/subscriptions";
import ThemeContext from "../../context/ThemeContext";

function PricingComponent() {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const fontSizeClass = fontSize === "text-lg" ? "text-lg" : "text-base";

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div lassName={`${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`} >
        <Text
          className={`text-2xl text-center text-primary pt-24 mb-5 ${fontSize === "text-lg" ? "text-3xl" : ""}`}
          size="txtOpenSansBold50"
          htmlTag="h1"
        >
          Choose your plan
        </Text>
        <Text
          className={`text-center ${fontSizeClass} ${isDark ? "text-gray-300" : "text-gray-500"}`}
        >
          Select the plan that best fits your needs to start your journey
          towards better mental health with personalized AI support
        </Text>
      </div>

      <div className={`font-[sans-serif] ${isDark ? "text-white" : "text-[#333]"}`}>
        <div className="xl:px-32 px-10 mx-auto">
          <div className="text-center"></div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8 mt-6 max-sm:max-w-sm max-sm:mx-auto">
            {subscriptions.map((subscription) => (
              <SubscriptionCard2
                key={subscription.id}
                {...subscription}
                id={subscription.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingComponent;
