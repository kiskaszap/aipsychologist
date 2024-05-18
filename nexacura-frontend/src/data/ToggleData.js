import { FaMedal, FaUser } from "react-icons/fa";
import { MdLiveHelp } from "react-icons/md";
import { BiSolidExit } from "react-icons/bi";
import { IoChatboxEllipses } from "react-icons/io5";

export const toggleItems = [
  {
    icon: IoChatboxEllipses,
    label: "Chat",

    onClick: () => console.log("Video clicked"),
  },
  {
    icon: FaMedal,
    label: "My Subscription",

    onClick: () => console.log("My Subscription clicked"),
  },
  {
    icon: MdLiveHelp,
    label: "Help",

    onClick: () => console.log("Help clicked"),
  },
];

export const toggleBottomItems = [
  {
    icon: FaUser,
    label: "My Account",

    onClick: () => console.log("My Account clicked"),
  },
  {
    icon: BiSolidExit,
    label: "Logout",

    onClick: () => console.log("Logout clicked"),
  },
];
