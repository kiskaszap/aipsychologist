import React from "react";
import DefaultRoutes from "./Components/Routes/DefaultRoutes";
import DashboardRoutes from "./Components/Routes/DashboardRoutes";

function App() {
  const loggedIn = true;

  return (
    <React.Fragment>
      {loggedIn ? <DashboardRoutes /> : <DefaultRoutes />}
    </React.Fragment>
  );
}

export default App;
