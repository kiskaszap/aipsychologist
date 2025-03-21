import React from "react";
import Text from "../../Components/Text/Text";
import Footer from "../../Components/Footer/Footer";
import Faq from "../../Components/Faq/Faq";
import Review from "../../Components/Reviews/Review";
import PricingComponent from "../../Components/PricingComponent/PricingComponent";
function Pricing() {
  return (
    <div>
      <PricingComponent />
      <Text
        size="txtOpenSansBold50"
        className="lg:pl-0 text-left lg:text-center text-2xl text-primary mt-16 px-10"
      >
        Have a question ? Look here ...
      </Text>

      <Faq />
      <Review />
      <Footer />
    </div>
  );
}

export default Pricing;
