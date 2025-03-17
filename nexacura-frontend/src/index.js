import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Context from "../src/context/Context";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Context>
      
      <App />
      <ToastContainer
      position="top-right"
      autoClose={3000} // Closes toast after 3 sec
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" // Can be "light", "dark", or "colored"
    />
    </Context>
  </React.StrictMode>
);
