import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Dùng để điều hướng
import axios from 'axios'; // Đảm bảo bạn đã: npm install axios
import api from '../../axiosConfig';

function LoginManager() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    import('../css/admin.css');
  }, []);
  // ... các phần import giữ nguyên

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { username, password });
      const userData = response.data;
      if (userData.status !== 0) {
        setError("Tài khoản của bạn không khả dụng hoặc đã bị cấm!!");
        return;
      }
      // Lấy idUser từ data trả về (Back-end của bạn đã có response.put("idUser", ...))
      const { role, idUser, username: fetchedUsername } = response.data;

      if (role === "ADMIN" || role === "STAFF") {
        const authHeader = window.btoa(`${username}:${password}`);

        // LƯU ID USER VÀO ĐÂY
        sessionStorage.setItem("idUser", idUser);
        sessionStorage.setItem("authHeader", authHeader);
        sessionStorage.setItem("userRole", role);
        sessionStorage.setItem("username", fetchedUsername || username);

        alert(`Đăng nhập thành công!`);
        window.location.href = "/admin/dashboard";
      } else {
        setError("Tài khoản không có quyền truy cập quản trị!");
        sessionStorage.clear();
      }
    } catch (error) {
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };;
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Chào mừng trở lại!</h2>
        <p>Vui lòng đăng nhập vào hệ thống quản trị</p>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

        <div className="input-group">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            placeholder="Nhập tên đăng nhập..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="options">
          <label>
            <input type="checkbox" /> Ghi nhớ tôi
          </label>
        </div>

        <button type="submit" className="login-button">Đăng Nhập</button>
      </form>
    </div>
  );
}

export default LoginManager;