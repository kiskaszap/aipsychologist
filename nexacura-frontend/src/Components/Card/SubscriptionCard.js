/**
 * The `SubscriptionCard` function in JavaScript renders a subscription card component with name,
 * price, duration, benefits, and a button to select the plan.
 * @returns The `SubscriptionCard` component is being returned. It is a functional component that
 * displays subscription card information such as name, price, duration, benefits, and a button to
 * select the plan. The card design includes styling for the header, pricing section, benefits list
 * with checkmarks, and a button styled with gradient colors and hover effects.
 */
import React from "react";
import { FaCheck } from "react-icons/fa";

import Text from "../Text/Text";

import axios from "axios";

function SubscriptionCard({ name, price, duration, benefits, id, isActive }) {
  console.log(isActive, "SubscriptionCard");

  const handleSelectPlan = () => {
    console.log(id); // Correctly logs the ID when the button is clicked.

    axios
    .post(
      "http://localhost:4000/stripe",
      { item: [id] },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures cookies are sent
        
      }
    )
    .then((res) => {
      if (res.status === 200) {
        return res.data; // Access response body
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then((data) => {
      window.location.href = data.url; // Assuming redirect to Stripe URL
    })
    .catch((error) => {
      console.error("Error during plan selection:", error);
    });
  
  };

  return (
    <div
      className={`shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] rounded-md overflow-hidden transition-all duration-500 hover:scale-105 ${
        isActive ? "ring-4 ring-primary" : ""
      }`}
    >
      <div className="text-center p-4 bg-gradient-to-r from-primary to-[#11a5e9]">
        <Text className="text-xl text-white font-semibold mb-1">{name}</Text>
        <Text className="text-xs text-white">{duration}</Text>
      </div>
      <div className="text-center -mt-8 mb-4">
        <div className="h-24 w-24 mx-auto shadow-xl rounded-full bg-gradient-to-r from-primary to-[#11a5e9] text-white flex items-center justify-center">
          <Text className="text-2xl font-semibold">{price}</Text>
        </div>
      </div>
      <div className="px-6 py-4">
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-sm text-gray-500">
              <FaCheck className="mr-2 text-green-500" /> {benefit}
            </li>
          ))}
        </ul>
        <button
          onClick={handleSelectPlan}
          className="outline-button w-full mt-4 border-primary hover:border-secondary text-white hover:text-secondary bg-primary hover:bg-transparent"
        >
          Select Plan
        </button>
      </div>
    </div>
  );
}

export default SubscriptionCard;
