import { FaMedal, FaUser } from "react-icons/fa";
import { MdLiveHelp } from "react-icons/md";
import { BiSolidExit } from "react-icons/bi";
import { IoChatboxEllipses } from "react-icons/io5";

export const sidebarItems = [
  {
    icon: IoChatboxEllipses,
    label: "Chat",
    lightColour: "hover:bg-primary bg-blue-200 text-black",
    darkColour: "hover:bg-primary bg-gray-800 text-white",
  },
  {
    icon: FaMedal,
    label: "My Subscription",
    lightColour: "hover:bg-primary bg-blue-200 text-black",
    darkColour: "hover:bg-primary bg-gray-800 text-white",
  },
  {
    icon: MdLiveHelp,
    label: "Help",
    lightColour: "hover:bg-primary bg-blue-200 text-black",
    darkColour: "hover:bg-primary bg-gray-800 text-white",
  },
];

export const bottomSidebarItems = [
  {
    icon: FaUser,
    label: "My Account",
    lightColour: "hover:bg-primary bg-blue-200 text-black",
    darkColour: "hover:bg-primary bg-gray-800 text-white",
  },
  {
    icon: BiSolidExit,
    label: "Logout",
    lightColour: "hover:bg-red-800 bg-red-200 text-black",
    darkColour: "hover:bg-red-700 bg-gray-800 text-white",
  },
];
