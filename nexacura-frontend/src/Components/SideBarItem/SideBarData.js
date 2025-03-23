import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import authenticationContext from "../../context/authenticationContext";
import ThemeContext from "../../context/ThemeContext";

function SideBarData({ icon: Icon, label, lightColour, darkColour }) {
  const { dispatch } = React.useContext(authenticationContext);
  const { theme, fontSize } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const appliedColour = isDark ? darkColour : lightColour;


  const navigate = useNavigate();
  let navigatTo = "/";

  switch (label) {
    case "Video":
      navigatTo = "/";
      break;
    case "My Subscription":
      navigatTo = "/my-subscription";
      break;
    case "Help":
      navigatTo = "/help";
      break;
    case "My Account":
      navigatTo = "/my-account";
      break;
    case "Logout":
      navigatTo = "/";
      break;
    default:
      navigatTo = "/";
      break;
  }

  function handleClick() {
    if (label === "Logout") {
      dispatch({
        type: "DASHBOARD_LOGOUT",
      });
    }
    navigate(navigatTo);
  }

  return (
    <div
      className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer 
      ${appliedColour} 
      ${isDark ? "hover:text-white text-white" : "hover:text-white text-black"} 
      font-semibold ${fontSize}`}
      onClick={handleClick}
      key={label}
    >
      <Icon />
      <span className={`ml-4 ${fontSize}`}>{label}</span>
    </div>
  );
}

export default SideBarData;
