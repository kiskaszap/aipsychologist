// import React from "react";
// import DefaultRoutes from "./Components/Routes/DefaultRoutes";
// import DashboardRoutes from "./Components/Routes/DashboardRoutes";
// import authenticationContext from "./context/authenticationContext";
// import checkSessionCookie from "./context/CheckCookie";
// import Admindashboard from "./Pages/Admin-dashboard/Admindashboard";

// function App() {
//   console.log(checkSessionCookie());

//   const {
//     initial: { isAuthenticated },
//   } = React.useContext(authenticationContext);

//   // Retrieve user info from localStorage
//   const userData = JSON.parse(localStorage.getItem("userData")) || {};

//   return (
//     <React.Fragment>
//       {isAuthenticated || localStorage.getItem("NexaCuraIsAuthenticated") ? (
//         userData.email === "admin@gmail.com" ? (
//           <Admindashboard /> // ✅ Redirect admin users to admin dashboard
//         ) : (
//           <DashboardRoutes /> // ✅ Redirect normal users to their dashboard
//         )
//       ) : (
//         <DefaultRoutes /> // ✅ Redirect unauthenticated users to login/register
//       )}
//     </React.Fragment>
//   );
// }

// export default App;
import React from "react";
import DefaultRoutes from "./Components/Routes/DefaultRoutes";
import DashboardRoutes from "./Components/Routes/DashboardRoutes";
import authenticationContext from "./context/authenticationContext";
import checkSessionCookie from "./context/CheckCookie";
import Admindashboard from "./Pages/Admin-dashboard/Admindashboard";

function App() {
  console.log(checkSessionCookie());

  const {
    initial: { isAuthenticated },
  } = React.useContext(authenticationContext);

  // ✅ Ensure userData is always an object
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData")) || {};
  } catch (error) {
    console.error("❌ Error parsing userData from localStorage:", error);
    userData = {}; // ✅ Set to empty object to prevent crashes
  }

  return (
    <React.Fragment>
      {isAuthenticated || localStorage.getItem("NexaCuraIsAuthenticated") ? (
        userData?.email === "admin@gmail.com" ? ( // ✅ Check if email exists
          <Admindashboard /> // ✅ Admin Dashboard for admin users
        ) : (
          <DashboardRoutes /> // ✅ Regular Dashboard for normal users
        )
      ) : (
        <DefaultRoutes /> // ✅ Login/Register for unauthenticated users
      )}
    </React.Fragment>
  );
}

export default App;
