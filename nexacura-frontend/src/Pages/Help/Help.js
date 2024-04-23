import React, { useState } from "react";
import Layout from "../../Components/Dashboard/Layout";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Text from "../../Components/Text/Text";

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="py-5">
      <details className="group">
        <summary
          className="flex cursor-pointer list-none items-center justify-between font-medium"
          onClick={toggleOpen}
        >
          <span>{question}</span>
          <span className="transition group-open:rotate-180">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </summary>
        <p
          className={`group-open:animate-fadeIn mt-3 text-neutral-600 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {answer}
        </p>
      </details>
    </div>
  );
}

function Help() {
  return (
    <Layout>
      <div className="relative w-full bg-white px-6 pt-10 pb-8 mt-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
        <div className="mx-auto px-5">
          <div className="flex flex-col items-center">
            <Text className="text-2xl text-primary">FAQ</Text>
            <Text className="mt-3 text-md text-neutral-500 md:text-lg">
              Frequently asked questions
            </Text>
          </div>
          <div className="mx-auto mt-8 grid max-w-xl gap-y-6 divide-y divide-neutral-200">
            <FAQItem
              question="What subscription plans are available?"
              answer="We offer a range of subscription options to meet your needs, including hourly, weekly, and monthly plans. Subscriptions do not auto-renew, and you'll need to purchase again once your current plan expires."
            />
            <FAQItem
              question="Can I trust that my data is safe?"
              answer="Absolutely. We take your privacy seriously and never sell your data to anyone. Your conversations and data are your own."
            />
            <FAQItem
              question="What happens to my data if I delete my profile?"
              answer="When you choose to delete your profile, all your saved conversations are permanently deleted from our servers as part of our commitment to your privacy and data security."
            />
            <FAQItem
              question="What are the operating hours of the service?"
              answer="Our service is available 24/7, ensuring that you can access support whenever you need it, with no additional fees."
            />
            <FAQItem
              question="Why should I use this service?"
              answer="Our service is designed for individuals seeking an alternative to traditional psychological services. It's perfect for those looking to save money on therapy, those who prefer not to talk to a real person, or anyone in need of a non-biased opinion."
            />
            <FAQItem
              question="Is there a refund policy?"
              answer="You are entitled to a refund if there is a service downtime that affects your access. Please report the issue immediately to qualify for a refund, which we will process swiftly after verification."
            />
            {/* Add more FAQItems as needed */}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Help;
