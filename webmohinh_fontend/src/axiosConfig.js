import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/website',
});

api.interceptors.request.use(
  (config) => {
    // 1. Cho phép các request công khai (Thêm /orders vào đây)
    const publicEndpoints = ['/login','/user', '/orders', '/submitOrder', '/updateStatus', '/createAdmin', '/shearchCategory'];
    const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));

    // Nếu là tạo đơn hàng (POST /orders), cho phép đi qua không cần check role/auth ngay lập tức
    if (isPublic) {
      return config;
    }

    const authHeader = sessionStorage.getItem('authHeader');
    const userRole = sessionStorage.getItem('userRole');
    const isWriteRequest = ['post', 'put', 'delete'].includes(config.method.toLowerCase());

    const allowedRoles = ['ADMIN', 'USER'];

    if (isWriteRequest && !allowedRoles.includes(userRole)) {
      // Bạn có thể thêm logic ở đây: Nếu url là /orders thì không chặn, 
      // còn các thao tác khác (như xóa sản phẩm, sửa user) thì mới chặn.
      alert("Bạn không có quyền thực hiện thao tác này!");
      const controller = new AbortController();
      config.signal = controller.signal;
      controller.abort("Insufficient privileges");
      return Promise.reject({ message: "Blocked by Client-side Role Check" });
    }

    if (authHeader) {
      config.headers.Authorization = `Basic ${authHeader}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;