import React, { useEffect, useState } from 'react';
import Navbar from './navbar'
import Footer from './footer'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogIn() {
    useEffect(() => {
        import('../css/home.css');

    }, []);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/sigup');
    };
    return (
        <div>
            <Navbar />

            {/* Form Đăng Nhập */}

            <form className="login">
                <h2 style={{textAlign: "center"}}>Chào mừng bạn đến với NEMO SHOP!</h2>
                <p>Vui lòng đăng nhập </p>
                <p style={{ color: '#F44336' }}>(Nếu chưa có tài khoản vui lòng quý khách đăng ký tài khoản!) </p>
                <input type="text" placeholder="Tên đăng nhập..." />
                <input type="password" placeholder="Mật khẩu..." />
                <input type="submit" value="Đăng nhập" />
                <div className="links">
                    <a href="#">Quên mật khẩu</a>
                    <a href="#"
                    onClick={handleLoginClick}>
                        Đăng ký
                    </a>
                </div>
            </form>




            <Footer />
        </div>
    )
}
export default LogIn;