import React, { useContext } from "react";
import Text from "../../Components/Text/Text";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Review from "../../Components/Reviews/Review";
import PricingComponent from "../../Components/PricingComponent/PricingComponent";
import ThemeContext from "../../context/ThemeContext";

function Pricing() {
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className={`${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <PricingComponent />

      <Text
        size="txtOpenSansBold50"
        className={`lg:pl-0 text-left lg:text-center text-2xl text-primary mt-16 px-10 ${
          fontSize === "text-lg" ? "text-3xl" : ""
        }`}
      >
        Have a question? Look here ...
      </Text>

      <Faq />
      <Review />
      <Footer />
    </div>
  );
}

export default Pricing;
