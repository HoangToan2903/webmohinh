import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            const response = await axios.post('http://localhost:8080/website/login', loginData);

            if (response.status === 200) {
                // LƯU TÊN USER VÀO ĐÂY
                localStorage.setItem('username', loginData.username);
                localStorage.setItem('userEmail', response.data.email || ""); 
                alert("Đăng nhập thành công!");
                window.location.href = "/home"; // Dùng window.location để load lại trang và cập nhật Header
            }
        } catch (err) {
            setError(err.response?.data || "Lỗi đăng nhập");
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