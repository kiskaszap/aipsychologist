/**
 * The `PricingComponent` function renders a pricing component with subscription cards based on data
 * from the `subscriptions` array.
 * @returns The PricingComponent function is returning a JSX structure that includes a heading "Choose
 * your plan", a description text, and a list of SubscriptionCard components generated based on the
 * data from the subscriptions array.
 */
import React from "react";
import Text from "../Text/Text";
import SubscriptionCard from "../Card/SubscriptionCard";
import subscriptions from "../../data/subscriptions";

function PricingComponent() {
  return (
    <div>
      <div>
        <Text
          className="text-2xl text-center text-primary mt-24 mb-5"
          size="txtOpenSansBold50"
          htmlTag="h1"
        >
          Choose your plan
        </Text>
        <Text className="text-gray-500 text-lg text-center">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </Text>
      </div>
      <div className="font-[sans-serif] text-[#333]">
        <div className="xl:px-32 px-10 mx-auto">
          <div className="text-center"></div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8 mt-6 max-sm:max-w-sm max-sm:mx-auto">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
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
