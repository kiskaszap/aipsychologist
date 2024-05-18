import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

const teamMembers = [
  {
    name: "Peter Kaszap-Nagy",
    position: "CEO & President",
    description: "Passionate programmer, driving force behind the company.",
    imageSrc:
      "https://images.pexels.com/photos/3785084/pexels-photo-3785084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    socialLinks: [
      { href: "https://www.facebook.com/", icon: <FaFacebook /> },
      { href: "https://twitter.com/", icon: <FaTwitter /> },
      { href: "https://www.linkedin.com/feed/", icon: <FaLinkedin /> },
    ],
  },
  {
    name: "Balint Kaszap-Nagy",
    position: "CEO & President",
    description:
      "Creative coder, problem solver, and a key player in the company's success.",
    imageSrc:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    socialLinks: [
      { href: "https://www.facebook.com/", icon: <FaFacebook /> },
      { href: "https://twitter.com/", icon: <FaTwitter /> },
      { href: "https://www.linkedin.com/feed/", icon: <FaLinkedin /> },
    ],
  },
];
export default teamMembers;
