import { FaMedal, FaUser } from "react-icons/fa";
import { MdLiveHelp } from "react-icons/md";
import { BiSolidExit } from "react-icons/bi";
import { IoChatboxEllipses } from "react-icons/io5";

export const sidebarItems = [
  {
    icon: IoChatboxEllipses,
    label: "Chat",
    colour: "hover:bg-primary bg-blue-200",
    onClick: () => console.log("Video clicked"),
  },
  {
    icon: FaMedal,
    label: "My Subscription",
    colour: "hover:bg-primary bg-blue-200",
    onClick: () => console.log("My Subscription clicked"),
  },
  {
    icon: MdLiveHelp,
    label: "Help",
    colour: "hover:bg-primary bg-blue-200",
    onClick: () => console.log("Help clicked"),
  },
];

export const bottomSidebarItems = [
  {
    icon: FaUser,
    label: "My Account",
    colour: "hover:bg-primary bg-blue-200",
    onClick: () => console.log("My Account clicked"),
  },
  {
    icon: BiSolidExit,
    label: "Logout",
    colour: "hover:bg-red-800 bg-red-200",
    onClick: () => console.log("Logout clicked"),
  },
];
