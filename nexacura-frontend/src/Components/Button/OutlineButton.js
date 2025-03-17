/**
 * The OutlineButton component in React renders a button with customizable styles such as border color,
 * text color, and background color.
 * @returns The OutlineButton component is being returned. It is a button element with various styling
 * properties and event handlers based on the props passed to it. The button displays the buttonText
 * provided as a prop and triggers the onClick function when clicked.
 */
import React from "react";

function OutlineButton({
  borderColor,
  hoverBorderColor,
  textColor,
  hoverTextColor,
  buttonText,
  hoverBackgroundColor,
  backgroundColor,
  width,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`${backgroundColor} outline-none mr-1 mb-1 border border-solid ${borderColor}  ${width} rounded px-4 py-2  text-sm font-bold ${textColor} uppercase focus:outline-none ${hoverBorderColor} ${hoverTextColor} ${hoverBackgroundColor} transition-all duration-150 ease-in-out`}
    >
      {buttonText}
    </button>
  );
}

export default OutlineButton;
