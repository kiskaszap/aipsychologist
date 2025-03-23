/**
 * The MoreCard component renders a styled card with a title and description emphasizing expertise,
 * innovation, and educational conversations.
 * @returns The MoreCard component is being returned, which is a React functional component that
 * renders a styled card with text content.
 */
import React from "react";
import Text from "../Text/Text";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

function MoreCard({ title, description }) {
  const { theme, fontSize } = useContext(ThemeContext);
  return (
    <div className="rounded-lg shadow-2xl p-5 py-10 border-t-8 border-secondary">
      <Text
  className={`text-2xl ${
    fontSize === "text-lg" ? "text-3xl" : ""
  } font-bold leading-7 text-primary`}
>
  {title}
</Text>

<Text
  className={`text-lg ${
    fontSize === "text-lg" ? "text-xl" : ""
  } text-gray-600 mt-3`}
>
  {description}
</Text>

    </div>
  );
}

export default MoreCard;
