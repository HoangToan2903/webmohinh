import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const username = sessionStorage.getItem('username');
    const userRole = sessionStorage.getItem('userRole');

    // Kiểm tra: Nếu chưa đăng nhập HOẶC không phải ADMIN/STAFF
    if (!username || (userRole !== 'ADMIN' && userRole !== 'STAFF')) {
        // Chuyển hướng về trang đăng nhập dành cho quản lý
        return <Navigate to="/loginManager" replace />;
    }

    // Nếu hợp lệ, render các Route con bên trong
    return <Outlet />;
};

export default ProtectedRoute;