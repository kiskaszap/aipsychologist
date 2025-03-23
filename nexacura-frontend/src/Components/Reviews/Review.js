import React from "react";
import Text from "../Text/Text";
import Testimonial from "../Card/Testimonial";
import reviews from "../../data/review";
import ThemeContext from "../../context/ThemeContext";

function Review() {
  const { fontSize } = React.useContext(ThemeContext);
  return (
    <div>
     <Text
  size="txtOpenSansBold50"
  className={`lg:pl-0 text-left lg:text-center text-2xl ${
    fontSize === "text-lg" ? "text-3xl" : ""
  } text-primary mt-16 px-10 mb-20`}
>
  What our clients say
</Text>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 px-10 xl:px-32">
        {reviews.map((review) => {
          return (
            <Testimonial
              rating={review.ratings}
              name={review.name}
              review={review.description}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Review;
