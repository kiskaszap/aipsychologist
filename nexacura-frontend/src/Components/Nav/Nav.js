/**
 * The Nav component conditionally renders either the DashboardNav or DefaultNav component based on the
 * isAuthenticated value from the authenticationContext.
 * @returns The `Nav` component is returning either the `DashboardNav` component or the `DefaultNav`
 * component based on the value of the `isAuthenticated` property obtained from the
 * `authenticationContext`. If `isAuthenticated` is true, it will return the `DashboardNav` component,
 * otherwise it will return the `DefaultNav` component.
 */
import React from "react";
import DefaultNav from "./DefaultNav";
import DashboardNav from "./DashboardNav";
import authenticationContext from "../../context/authenticationContext";
import checkSessionCookie from "../../context/CheckCookie";

function Nav() {
  const {
    initial: { isAuthenticated },
  } = React.useContext(authenticationContext);
  return (
    <React.Fragment>
      {isAuthenticated || localStorage.getItem("NexaCuraIsAuthenticated") ? (
        <DashboardNav />
      ) : (
        <DefaultNav />
      )}
    </React.Fragment>
  );
}

export default Nav;
