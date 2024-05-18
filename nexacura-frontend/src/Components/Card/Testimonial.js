/**
 * The Testimonial component in React displays a star rating, review text, and user image with name.
 * @returns The Testimonial component is being returned, which consists of a testimonial card
 * displaying the rating stars, review text, and user's name with an image.
 */
import React from "react";
import { FaStar } from "react-icons/fa";
import Text from "../Text/Text";
import image from "../../assets/users/49.jpg";

function Testimonial({ name, rating, review }) {
  return (
    <div className="flex flex-col gap-y-5 p-5 shadow-2xl rounded-lg">
      <div className="flex">
        {Array.from({ length: rating }, (_, index) => (
          <FaStar key={index} className="text-secondary text-xl" />
        ))}
      </div>
      <Text size="txtPoppinsMedium16Gray90001" className="text-gray-600">
        {review}
      </Text>
      <div className="flex gap-x-5 items-center">
        <Text size="txtPoppinsMedium16Gray90001">- {name}</Text>
      </div>
    </div>
  );
}

export default Testimonial;
