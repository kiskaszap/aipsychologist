import React, { useContext, useState, useEffect } from "react";
import Text from "../Text/Text";
import authenticationContext from "../../context/authenticationContext";

function ProfileDashNav() {
  const { initial } = useContext(authenticationContext);
  const [localUserData, setLocalUserData] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setLocalUserData(JSON.parse(userData));
    }
  }, []);

  const isAuthenticated = initial.isAuthenticated || localUserData;
  const user = isAuthenticated
    ? initial.user.name
      ? initial.user
      : localUserData
    : {};

  return (
    <div className="flex gap-x-3 items-center justify-end  ">
      {/* <img
        src={user.image || ""}
        alt="profile"
        className="rounded-full h-10 w-10"
      />
      <Text size="lg" weight="bold" className="text-primary font-medium">
        {user.name || ""}
      </Text> */}
    </div>
  );
}

export default ProfileDashNav;
