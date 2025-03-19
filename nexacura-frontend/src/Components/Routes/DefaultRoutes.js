import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../../Pages/Home/HomePage";
import About from "../../Pages/About/About";
import Contact from "../../Pages/Contact/Contact";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import Pricing from "../../Pages/Pricing/Pricing";
import SelectPlan from "../../Pages/SelectPlan/SelectPlan";
import VerifyingEmail from "../../Pages/VerifyingEmail/VerifyingEmail";
import VerifiedEmail from "../../Pages/VerifiedEmail/VerifiedEmail";
import Nav from "../Nav/Nav";
import Terms from "../../Pages/Terms/Terms";
import Privacy from "../../Pages/Privacy/Privacy";
import ResetPassword from "../../Pages/ResetPassword/ResetPassword";
import Admindashboard from "../../Pages/Admin-dashboard/Admindashboard";

function DefaultRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/select-plan" element={<SelectPlan />} />
          <Route path="/verifying-email" element={<VerifyingEmail />} />
          <Route path="/verified-email" element={<VerifiedEmail />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/reset-password" element={<ResetPassword />} />
         
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default DefaultRoutes;
