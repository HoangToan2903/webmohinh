import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig';
import Swal from "sweetalert2";

function LogIn() {
    // 1. Khai báo state để lưu thông tin đăng nhập
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        import('../css/home.css');
    }, []);

    // 2. Hàm cập nhật dữ liệu khi người dùng gõ phím
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    // 3. Hàm xử lý gửi form lên Backend
    // Bên trong hàm handleSubmit của LogIn.js

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset thông báo lỗi cũ

        try {
            const response = await api.post('/login', loginData);

            // Nếu API trả về 200 OK
            const userData = response.data;

            // Kiểm tra lại một lần nữa ở client cho chắc chắn
            if (userData.status !== 0) {
                setError("Tài khoản của bạn không khả dụng hoặc đã bị cấm!!");
                return;
            }

            // Kiểm tra quyền USER
            if (userData.role === "USER") {
                // Tạo Auth Header (Basic Auth)
                const authString = `${loginData.username}:${loginData.password}`;
                const authHeader = window.btoa(unescape(encodeURIComponent(authString)));

                // Lưu vào sessionStorage
                sessionStorage.setItem("authHeader", authHeader);
                sessionStorage.setItem('username', userData.username);
                sessionStorage.setItem('userEmail', userData.email);
                sessionStorage.setItem('userRole', userData.role);
                sessionStorage.setItem('idUser', userData.idUser);

                Swal.fire({
                    title: "Thành công!",
                    text: "Chào mừng bạn quay trở lại.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "/home";
                });
            } else {
                Swal.fire("Lỗi phân quyền", "Bạn không có quyền truy cập khu vực này!", "error");
                sessionStorage.clear();
            }

        } catch (err) {
            // Bắt lỗi 401, 403, 500 từ server trả về          
            // Xóa sạch session để đảm bảo an toàn
            sessionStorage.clear();
        }
    };
    const handleRegisterRedirect = (e) => {
        e.preventDefault();
        navigate('/sigup');
    };

    return (
        <div>
            <Navbar />

            {/* Form Đăng Nhập */}
            <form className="login" onSubmit={handleSubmit}>
                <h2 style={{ textAlign: "center" }}>Chào mừng bạn đến với NEMO SHOP!</h2>
                <p>Vui lòng đăng nhập </p>
                <p style={{ color: '#F44336' }}>(Nếu chưa có tài khoản vui lòng quý khách đăng ký tài khoản!) </p>

                {/* Hiển thị lỗi nếu có */}
                {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

                <input
                    type="text"
                    name="username" // Phải khớp với key trong loginData
                    placeholder="Tên đăng nhập..."
                    value={loginData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password" // Phải khớp với key trong loginData
                    placeholder="Mật khẩu..."
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />

                <input type="submit" value="Đăng nhập" />

                <div className="links">
                    <a href="#">Quên mật khẩu</a>
                    <a href="#" onClick={handleRegisterRedirect}>
                        Đăng ký
                    </a>
                </div>
            </form>

            <Footer />
        </div>
    );
}

export default LogIn;