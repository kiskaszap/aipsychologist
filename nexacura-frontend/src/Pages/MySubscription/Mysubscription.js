import React, { useState, useEffect } from "react";

import Layout from "../../Components/Dashboard/Layout";
import Text from "../../Components/Text/Text";
import SubscriptionCard2 from "../../Components/Card/SubscriptionCard";
import subscriptions from "../../data/subscriptions";

function Mysubscription() {
  // State to hold the active subscription data

  return (
    <Layout>
      <div className="h-full pt-12 pb-20">
        <Text className="text-2xl text-primary font-semibold">
          My Subscription
        </Text>
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 mt-6">
          {/* Render subscription cards, passing in the active state based on the activeSubscription data */}
          {subscriptions.map((subscription) => (
            <SubscriptionCard2 key={subscription.id} {...subscription} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Mysubscription;
