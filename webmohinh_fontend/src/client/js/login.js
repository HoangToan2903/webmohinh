import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig';

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
        try {
            const response = await api.post('/login', loginData);

            if (response.status === 200) {
                // Lấy dữ liệu từ response.data
                const userData = response.data;
                const userRole = userData.role;

                // 1. Xử lý Auth Header
                const authString = `${loginData.username}:${loginData.password}`;
                const authHeader = window.btoa(unescape(encodeURIComponent(authString)));
                sessionStorage.setItem("authHeader", authHeader);

                if (userRole === "USER") {
                    // 2. Lưu thông tin vào sessionStorage
                    sessionStorage.setItem('username', loginData.username);
                    sessionStorage.setItem('password', loginData.password);
                    sessionStorage.setItem('userEmail', userData.email || "");
                    sessionStorage.setItem('userRole', userRole);

                    // SỬA TẠI ĐÂY: Lấy idUser từ userData (tức response.data)
                    sessionStorage.setItem('idUser', userData.idUser);

                    alert("Đăng nhập thành công!");
                    window.location.href = "/home";
                } else {
                    setError("Tài khoản không tồn tại!");
                    sessionStorage.clear();
                }
            }
        } catch (err) {
            setError("Tên đăng nhập hoặc mật khẩu không đúng.");
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