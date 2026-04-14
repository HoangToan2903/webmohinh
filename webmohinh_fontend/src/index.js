import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

// Admin Components
import Admin from './admin/js/admin';
import LoginManager from './admin/js/loginAdmin';
import ProtectedRoute from './admin/js/checkLogin';

// Client Components
import Home from './client/js/shop';
import Login from './client/js/login';
import SigUp from './client/js/sigup';
import Detail from './client/js/detail';
import ProductsCategories from './client/js/productsCategories';
import CartItems from './client/js/cartItems';
import PaymentResult from './client/js/PaymentResult';
import UserProfile from './client/js/userProfile';
import SearchPage from './client/js/searchPage'
import ScrollToTop from "./client/js/scrollToTop";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ScrollToTop />
      <Routes>
        {/* --- VÙNG PUBLIC (Dành cho khách hàng) --- */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sigup" element={<SigUp />} />
        <Route path="/shopNemo/:slug" element={<Detail />} />
        <Route path="/collections/:nameCategories" element={<ProductsCategories />} />
        <Route path="/cart" element={<CartItems />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/userProfile" element={<UserProfile />} />
        {/* Trang đăng nhập của Admin/Staff */}
        <Route path="/loginManager" element={<LoginManager />} />

        {/* --- VÙNG BẢO VỆ (Chỉ dành cho Admin/Staff đã login) --- */}
        <Route element={<ProtectedRoute />}>
          {/* Khi gõ /admin sẽ tự động vào statistics */}
          <Route path="/admin" element={<Navigate to="/admin/statistics" replace />} />
          {/* Các tab như /admin/products, /admin/orders... */}
          <Route path="/admin/:tab" element={<Admin />} />
        </Route>

        {/* Điều hướng mặc định nếu gõ sai URL hoặc trang chủ */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();