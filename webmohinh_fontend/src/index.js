import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Admin from './admin/js/admin';
import Home from './client/js/shop'
import Login from './client/js/login'
import SigUp from './client/js/sigup'
import Detail from './client/js/detail'
import ProductsCategories from './client/js/productsCategories'
import CartItems from './client/js/cartItems'
import PaymentResult from './client/js/PaymentResult';
import Result from './client/js/result';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/admin/:tab" element={<Admin />} />
        <Route path="/admin" element={<Navigate to="/admin/statistics" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sigup" element={<SigUp />} />
        <Route path="/shopNemo/:slug" element={< Detail />} />
        <Route path="/collections/:nameCategories" element={<ProductsCategories />} />
        <Route path="/cart" element={<CartItems />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
