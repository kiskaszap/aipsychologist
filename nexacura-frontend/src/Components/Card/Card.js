/**
 * The Card component in React renders a styled card with a title and description for a confidential
 * conversation.
 * @returns The Card component JSX code is being returned. It consists of a styled card element with a
 * title "Confidential Conversation" and a description. The card has hover effects for scaling, shadow,
 * and color changes.
 */
import React from "react";

function Card({ title, description, icon }) {
  return (
    <div className="group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-lg sm:px-10">
      <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-sky-500 transition-all duration-300 group-hover:scale-[13] hover:text-[#eab676]]"></span>
      <div className="relative z-10 mx-auto max-w-md">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-sky-500 transition-all duration-300 group-hover:bg-sky-400 group-hover:text-[#eab676] text-4xl text-white  font-bold">
          {icon}
        </span>
        <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
          <h3 className="text-2xl font-bold leading-7 group-hover:text-[#eab676] text-primary">
            {title}
          </h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
