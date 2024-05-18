import React from "react";
import { useNavigate } from "react-router-dom";
import authenticationContext from "../../context/authenticationContext";

function ToggleNavData({ icon: Icon, label, colour, closeNav }) {
  const { dispatch } = React.useContext(authenticationContext);

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
    closeNav();
  }

  return (
    <div
      className={`p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer text-white font-semibold`}
      onClick={handleClick}
      key={label}
    >
      <Icon />
      <span className="text-[15px] ml-4">{label}</span>
    </div>
  );
}

export default ToggleNavData;
