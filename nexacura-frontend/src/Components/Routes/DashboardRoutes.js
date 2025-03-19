import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import PaymentOptions from "../../Pages/PaymentOptions/PaymentOptions";
import PaymentForm from "../../Pages/PaymentForm/PaymentForm";
import ReviewPayment from "../../Pages/ReviewPayment/ReviewPayment";
import PurchaseSuccessful from "../../Pages/PurchaseSuccessful/PurchaseSuccessful";
import Mysubscription from "../../Pages/MySubscription/Mysubscription";
import Nav from "../Nav/Nav";
import Help from "../../Pages/Help/Help";
import MyAccount from "../../Pages/MyAccount/MyAccount";

import NotFound from "../../Pages/NotFound/NotFound";

function DashboardRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route index element={<Dashboard />} />
          <Route path="/my-subscription" element={<Mysubscription />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/payment-form" element={<PaymentForm />} />
          <Route path="/review-payment" element={<ReviewPayment />} />
          <Route path="/purchase-successful" element={<PurchaseSuccessful />} />
          <Route path="/help" element={<Help />} />
          <Route path="/my-account" element={<MyAccount />} />
          
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default DashboardRoutes;
