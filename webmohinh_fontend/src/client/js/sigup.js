import React, { useEffect, useState } from 'react';
import Navbar from './navbar'
import Footer from './footer'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SigUp() {
    useEffect(() => {
        import('../css/home.css');

    }, []);
    const navigate = useNavigate();

    // add
    const [successAlertAdd, setSuccessAlertAdd] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUsers, setNewUsers] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault(); // Ngăn reload trang

        try {
            if (!newUsers.username.trim()) {
                window.alert("Vui lòng nhập username!");
                return;
            }
           
            if (!newUsers.email.trim()) {
                window.alert("Vui lòng nhập email!");
                return;
            }

            // Kiểm tra định dạng email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newUsers.email.trim())) {
                window.alert("Email không đúng định dạng!");
                return;
            }

            if (!newUsers.password.trim()) {
                window.alert("Vui lòng nhập password!");
                return;
            }
            if (newUsers.password.length < 8) {
                window.alert("Mật khẩu phải có ít nhất 8 ký tự!");
                return;
            }
            if (newUsers.password !== confirmPassword) {
                window.alert("Mật khẩu nhập lại không khớp!");
                return;
            }
            const isDuplicate = users.some(user => user.username === newUsers.username.trim());
            if (isDuplicate) {
                window.alert("username này đã tồn tại!");
                return;
            }

            const response = await axios.post('http://localhost:8080/website/users', newUsers);

            setUsers([response.data, ...users]);
            setNewUsers({ username: '', password: '', email: '' });

            alert("Đăng ký thành công!!")
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUsers((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginClick = () => {
        navigate('/login');
    };
    return (
        <div>
            <Navbar />



            {/* Form Đăng Ký */}

            <form className="login">
                <h2>Chào mừng bạn đến với NEMO SHOP!</h2>
                <p>Vui lòng đăng ký!</p>
                <input
                    type="text"
                    name='username'
                    value={newUsers.username}
                    onChange={handleChange}
                    placeholder="Tên đăng nhập..." />

                <input
                    type="email"
                    name='email'
                    value={newUsers.email}
                    onChange={handleChange}
                    placeholder="Email..." />

                <input
                    type="password"
                    name='password'
                    value={newUsers.password}
                    onChange={handleChange}
                    placeholder="Mật khẩu..." />

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu..."
                />
                <input type="submit" value="Đăng ký" onClick={(e) => handleAdd(e)} />
                <div className="links">
                    <a href="#" onClick={handleLoginClick}>
                        Đăng nhập
                    </a>
                </div>
            </form>

            <Footer />
        </div>
    )
}
export default SigUp;