/**
 * The above code defines a React component called Team that displays team members with their names,
 * positions, images, descriptions, and social links.
 * @returns The `Team` component is being returned, which displays a list of team members using the
 * `TeamMember` component. Each team member is rendered with their name, position, image, a short
 * description, and social links.
 */
import React from "react";
import teamMembers from "../../data/teamMembers";
import Text from "../Text/Text";
/**
 * The TeamMember function in JavaScript renders a component displaying information about a team member
 * including their name, position, image, and social links.
 * @returns The `TeamMember` component is being returned. It displays information about a team member
 * including their name, position, image, and social links. The component structure includes a
 * container with the team member's image on the left and their details on the right. The details
 * include the team member's name, position, a brief description, and social links.
 */
function TeamMember({ name, position, imageSrc, description, socialLinks }) {
  return (
    <div className=" w-full lg:max-w-full lg:flex mx-auto my-10">
      <div
        className="h-60 lg:h-80  lg:w-60 flex-none bg-cover bg-top rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
        style={{ backgroundImage: `url(${imageSrc})` }}
        title=""
      ></div>
      <div className=" bg-white  p-4 my-auto shadow-2xl  xl:border-none border-none">
        <div>
          <p className="text-primary font-bold text-xl mb-2  transition duration-500 ease-in-out">
            {name}
          </p>
          <Text className="text-sm text-gray-600">{position}</Text>
          <Text className="text-gray-500 text-base mt-4">{description}</Text>

          <div className="my-4 flex text-secondary">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} className="mr-3">
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The function `Team` renders a section displaying the team members with their details in a grid
 * layout.
 * @returns The Team component is being returned. It contains a div with various classes for styling, a
 * Text component displaying "Our Team", and a grid layout displaying team members using the TeamMember
 * component for each member in the teamMembers array.
 */
function Team() {
  return (
    <div className="mt-24 mx-auto  xl:px-32 ">
      <Text
        size="txtOpenSansBold50"
        className="lg:pl-0 text-left lg:text-center text-5xl text-primary mt-16 px-10 mb-20"
      >
        Our Team
      </Text>
      <div className="sm:grid grid-cols-2 gap-6 my-10 px-10 xl:px-0">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
      </div>
    </div>
  );
}

export default Team;
