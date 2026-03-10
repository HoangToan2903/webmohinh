import React, { useEffect, useState } from 'react';
import Navbar from './navbar'
import Footer from './footer'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import api from '../../axiosConfig';

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
            // 1. Validation: Kiểm tra các trường trống
            if (!newUsers.username.trim()) {
                window.alert("Vui lòng nhập username!");
                return;
            }

            if (!newUsers.email.trim()) {
                window.alert("Vui lòng nhập email!");
                return;
            }

            // 2. Kiểm tra định dạng email bằng Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newUsers.email.trim())) {
                window.alert("Email không đúng định dạng!");
                return;
            }

            // 3. Kiểm tra Password
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

            // 4. Kiểm tra trùng lặp username cục bộ (nếu cần)
            const isDuplicate = users.some(user => user.username === newUsers.username.trim());
            if (isDuplicate) {
                window.alert("Username này đã tồn tại!");
                return;
            }

            // --- PHẦN QUAN TRỌNG: GÁN ROLE TỪ FRONTEND ---
            const userPayload = {
                username: newUsers.username.trim(),
                email: newUsers.email.trim(),
                password: newUsers.password,
                role: "USER" // Gửi trực tiếp Role sang Backend
            };

            // 5. Gửi API
            const response = await api.post('/users', userPayload);

            // 6. Cập nhật UI sau khi thành công
            setUsers([response.data, ...users]);

            // Reset form về trạng thái ban đầu
            setNewUsers({
                username: '',
                password: '',
                email: '',
                role: ''
            });
            setConfirmPassword(''); // Đừng quên reset cả ô confirm password

            // Thông báo xịn xò với SweetAlert2
            Swal.fire({
                icon: "success",
                title: "Đăng ký tài khoản thành công 🎉",
                text: `Chào mừng ${response.data.username} đã gia nhập!`,
                confirmButtonColor: "#4CAF50",
            });

        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);

            // Xử lý thông báo lỗi từ Server (ví dụ: trùng email ở DB)
            const errorMessage = error.response?.data?.message || "Lỗi hệ thống!"; Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: errorMessage,
            });
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
                    type="text"
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