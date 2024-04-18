import React from "react";
import DefaultRoutes from "./Components/Routes/DefaultRoutes";
import DashboardRoutes from "./Components/Routes/DashboardRoutes";
import authenticationContext from "./context/authenticationContext";
import checkSessionCookie from "./context/CheckCookie";

function App() {
  console.log(checkSessionCookie());
  const {
    initial: { isAuthenticated },
  } = React.useContext(authenticationContext);

  return (
    <React.Fragment>
      {isAuthenticated || localStorage.getItem("NexaCuraIsAuthenticated") ? (
        <DashboardRoutes />
      ) : (
        <DefaultRoutes />
      )}
    </React.Fragment>
  );
}

export default App;
