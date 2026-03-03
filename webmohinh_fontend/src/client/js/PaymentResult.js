import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from './navbar';
import Footer from './footer';
import api from '../../axiosConfig';
const SWAL_DISPLAYED_KEY = "vnpay_swal_displayed";


const PaymentResult = () => {
    useEffect(() => {
        import('../css/home.css');

    }, []);
    // Khôi phục state orderDetails để lưu chi tiết đơn hàng cho việc hiển thị
    const [orderDetails, setOrderDetails] = useState(null);
    const [status, setStatus] = useState("loading"); // loading, success, fail, error
    const [message, setMessage] = useState("Đang xử lý thanh toán...");

    useEffect(() => {
        // Xóa trạng thái hiển thị pop-up nếu người dùng truy cập trang này lần đầu tiên
        // (Đây là một biện pháp an toàn, nhưng thông thường bạn chỉ nên xóa nó khi bắt đầu thanh toán)
        // Tuy nhiên, vì mục đích hiện tại là ngăn chặn reload, ta sẽ giữ nguyên logic kiểm tra.

        const handleVNPayReturn = async () => {
            try {
                // Lấy toàn bộ query string gốc VNPay trả về
                const queryString = window.location.search.startsWith("?")
                    ? window.location.search.substring(1)
                    : window.location.search;

                // 1. Gọi backend để xác thực kết quả thanh toán và lưu DB
                const res = await api.get(
                    `/vnpay-return?${queryString}`
                );

                console.log("VNPay return response:", res.data);

                // ✅ Nếu Backend xác nhận đã lưu đơn hàng thành công (hoặc xử lý lại thành công)
                if (res.data.status === "success") {
                    const codeOrder = res.data.codeOrder;

                    if (!codeOrder) {
                        setStatus("fail");
                        setMessage("❌ Không tìm thấy mã đơn hàng.");

                        if (sessionStorage.getItem(SWAL_DISPLAYED_KEY) !== 'true') {
                            Swal.fire({
                                icon: "error",
                                title: "Lỗi",
                                text: "Không tìm thấy mã đơn hàng."
                            });
                            sessionStorage.setItem(SWAL_DISPLAYED_KEY, 'true');
                        }
                        return;
                    }

                    // 2. Lấy thông tin chi tiết đơn hàng theo mã
                    try {
                        const orderRes = await api.get(
                            `/orders/${codeOrder}`
                        );

                        if (orderRes.data) {
                            setOrderDetails(orderRes.data);
                            setStatus("success");
                            setMessage("🎉 Thanh toán thành công!");

                            Swal.fire({
                                icon: "success",
                                title: "Thanh toán thành công 🎉",
                                text: `Mã đơn hàng: ${codeOrder}`,
                                confirmButtonText: "OK",
                                confirmButtonColor: "#4CAF50",
                            });
                        } else {
                            setStatus("fail");
                            setMessage("❌ Đã thanh toán, nhưng không lấy được chi tiết đơn hàng.");
                            if (sessionStorage.getItem(SWAL_DISPLAYED_KEY) !== 'true') {
                                Swal.fire({ icon: "error", title: "Lỗi", text: "Lỗi truy xuất chi tiết đơn hàng." });
                            }
                            sessionStorage.setItem(SWAL_DISPLAYED_KEY, 'true');
                        }
                    } catch (detailError) {
                        console.error("Lỗi khi lấy chi tiết đơn hàng:", detailError);
                        setStatus("success");
                        setMessage("✅ Thanh toán thành công! Nhưng lỗi khi lấy chi tiết đơn hàng.");
                        if (sessionStorage.getItem(SWAL_DISPLAYED_KEY) !== 'true') {
                            Swal.fire({ icon: "warning", title: "Cảnh báo", text: "Thanh toán thành công nhưng không lấy được chi tiết. Vui lòng kiểm tra lại đơn hàng." });
                        }
                        sessionStorage.setItem(SWAL_DISPLAYED_KEY, 'true');
                    }

                } else {
                    // ❌ VNPay phản hồi hoặc Backend trả về thất bại/lỗi
                    setStatus("fail");
                    const errorMessage = res.data.message || "Thanh toán thất bại.";
                    setMessage(`❌ ${errorMessage}`);

                    if (sessionStorage.getItem(SWAL_DISPLAYED_KEY) !== 'true') {
                        Swal.fire({
                            icon: "error",
                            title: "Thanh toán thất bại ❌",
                            text: errorMessage,
                            confirmButtonText: "Quay lại cửa hàng",
                            confirmButtonColor: "#e53935",
                        });
                        sessionStorage.setItem(SWAL_DISPLAYED_KEY, 'true');
                    }
                }
            } catch (error) {
                console.error("VNPay return error:", error);
                setStatus("error");
                setMessage("⚠️ Có lỗi xảy ra khi xử lý thanh toán.");

                if (sessionStorage.getItem(SWAL_DISPLAYED_KEY) !== 'true') {
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi hệ thống ⚠️",
                        text: "Không thể xử lý kết quả thanh toán. Vui lòng kiểm tra lại đơn hàng sau.",
                    });
                    sessionStorage.setItem(SWAL_DISPLAYED_KEY, 'true');
                }
            }
        };

        handleVNPayReturn();
    }, []);

    const voucherId = orderDetails?.voucherId;
    const [vouchers, setVoucher] = useState([]);

    console.log(voucherId)
    useEffect(() => {
        // 1. Check if voucherId exists before making the request
        if (voucherId) {

            api.get(`/voucher/${voucherId}`)
                .then(response => {
                    setVoucher(response.data);
                    console.log(response.data)
                })
                .catch(error => console.error(error));
        } else {
            // Handle the case where voucherId is not available if necessary
            console.log("No voucherId available, skipping API call.");
        }
    }, [voucherId]);
    const containerStyle = {
        maxWidth: "1300px",
        margin: "20px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    };

    if (status === "loading") {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>⏳ Đang xử lý thanh toán...</h2>
                <p>Vui lòng không tắt trình duyệt cho đến khi hoàn tất.</p>
            </div>
        );
    }
    const subtotal = orderDetails.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    if (status === "success" && orderDetails) {
        const formatCurrency = (amount) => {
            if (amount === undefined || amount === null) return '0 ₫';
            return amount.toLocaleString('vi-VN') + ' ₫';
        };

        return (
            <div>
                <Navbar />
                <div style={containerStyle}>


                    <h2 style={{ textAlign: 'center', color: '#00c853', marginBottom: '15px' }}>
                        🎉 ĐẶT HÀNG THÀNH CÔNG! 🎉
                    </h2>

                    <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                        Cảm ơn bạn đã tin tưởng và đặt hàng tại NemoShop. Đơn hàng của bạn đã được đặt thành công!
                    </p>

                    <div className="notes" style={{ border: '1px solid #ffcc80', padding: '15px', backgroundColor: '#fff3e0' }}>
                        <h3>Lưu ý về Đơn hàng:</h3>
                        <p>• Các bạn yên tâm khi mua hàng tại NemoShop</p>
                        <p>• Khuyến khích trước khi mua hãy nhắn tin Zalo/Messenger để shop tư vấn chi tiết nhất</p>
                        <p>• Sản phẩm lỗi, hư hỏng có thể đổi trả</p>
                        <p>• Được kiểm tra hàng trước khi nhận</p>
                        <p>• Thời gian giao hàng là 2-3 ngày. Phí ship: 15.0000 ₫</p>
                    </div>

                    <b style={{ fontSize: "24px", color: "#fc6b4c", display: 'block', margin: '20px 0 10px 0' }}>
                        Chi tiết đơn hàng
                    </b>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #b4b4b4ff' }}>
                                <td style={{ padding: '10px' }}><b>Sản phẩm</b></td>
                                <td style={{ padding: '10px', textAlign: 'right' }}><b>Tổng</b></td>
                            </tr>
                        </thead>

                        <tbody>
                            {orderDetails.items.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ color: "#fc6b4c", padding: '10px' }}>
                                        {item.productId} × {item.quantity}
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'right' }}>
                                        <b> {formatCurrency(item.price * item.quantity)}</b>

                                    </td>
                                </tr>
                            ))}

                            {/* Tách thành 3 hàng riêng */}
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}><b>Tổng tiền sản phẩm:</b></td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                    <b>{formatCurrency(subtotal)}</b>
                                </td>
                            </tr>

                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}><b>Phí ship:</b></td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                    
                                    {subtotal < 3000000 && (
                                        <><span> Giao Hàng Trong 2-3 Ngày: 35,000 ₫</span></>
                                    )}
                                    {subtotal > 3000000 && (
                                        <><span> Miễn phí giao hàng</span></>
                                    )}
                                   

                                </td>
                            </tr>
                            {vouchers && vouchers.reduced_value > 0 && (
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px', color: "#e53935" }}><b>Phần trăm giảm:</b></td>
                                    <td style={{ padding: '10px', textAlign: 'right', color: "#e53935" }}>
                                        {/* Chỉ hiển thị nếu giá trị giảm giá > 0 */}
                                        <b>{vouchers.reduced_value}%</b>
                                    </td>
                                </tr>
                            )}
                            <tr style={{ borderBottom: '1px solid #b4b4b4ff' }}>
                                <td style={{ padding: '10px' }}><b>Phương thức thanh toán:</b></td>
                                <td style={{ padding: '10px', textAlign: 'right' }}>
                                    <b>{orderDetails.paymentMethod}</b>

                                </td>
                            </tr>
                        </tbody>


                        <tfoot>
                            <tr>
                                <td style={{ padding: '10px', fontSize: '1.2em' }}><b>Tổng cộng:</b></td>
                                <td style={{ textAlign: 'right', fontSize: '1.2em', color: '#e53935' }}>
                                    {orderDetails.totalPrice.toLocaleString('vi-VN')} ₫
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Thông tin Khách hàng và Địa chỉ */}
                    <div className="address" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
                            <h3>Thông tin khách hàng</h3>
                            <p><b>Họ tên:</b> {orderDetails.name}</p>
                            <p><b>Email:</b> {orderDetails.email}</p>
                            <p><b>Điện thoại:</b> {orderDetails.phone}</p>
                            <p><b>Ghi chú:</b> {orderDetails.notes || "(Không có)"}</p>
                        </div>

                        <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
                            <h3>Địa chỉ giao hàng</h3>
                            <p><b>Người nhận:</b> {orderDetails.name}</p>
                            <p><b>Địa chỉ:</b> {orderDetails.shippingAddress}</p>
                            <p><b>Điện thoại:</b> {orderDetails.phone}</p>
                        </div>
                    </div>

                    {/* Hộp thông báo xác nhận */}
                    <div className="confirm-box" style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: '#f9f9f9' }}>
                        <b style={{ color: '#339933' }}>Cảm ơn bạn. Đơn hàng của bạn đã được đặt thành công.</b>
                        <ul>
                            <li>Mã đơn hàng: <b>{orderDetails.codeOrder}</b></li>
                            <li>
                                Ngày: <b>{new Date(orderDetails.createdAt).toLocaleDateString("vi-VN")}</b>
                            </li>
                            <li>Tổng cộng: <b style={{ color: '#fc6b4c' }}>{orderDetails.totalPrice.toLocaleString('vi-VN')} ₫</b></li>
                            <li>Phương thức thanh toán: <b>{orderDetails.paymentMethod}</b></li>
                            <li>Trạng thái: <b style={{ color: '#339933' }}>Đặt hàng thành công(Chờ vận chuyển)</b></li>
                        </ul>
                    </div>

                    {/* Nút hành động */}
                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                        <a href="/home" style={{
                            display: "inline-block",
                            // backgroundColor: primaryColor,
                            backgroundColor: "#fc6b4c",
                            color: "#fff",
                            padding: "12px 30px",
                            borderRadius: "4px",
                            textDecoration: "none",
                            fontWeight: "600"
                        }}>
                            ← Quay lại cửa hàng
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ❌ Các trường hợp thất bại / lỗi
    // return (
    //     <div style={{ padding: "40px 0", textAlign: "center" }}>
    //         <h1 style={{ color: errorColor }}>{message}</h1>
    //         <p>Vui lòng kiểm tra lại thông tin thanh toán hoặc liên hệ bộ phận hỗ trợ.</p>
    //         <div style={{ marginTop: "30px" }}>
    //             <a href="/" style={{
    //                 backgroundColor: errorColor,
    //                 color: "#fff",
    //                 padding: "10px 20px",
    //                 borderRadius: "8px",
    //                 textDecoration: "none",
    //                 fontWeight: "600"
    //             }}>
    //                 ← Quay lại cửa hàng
    //             </a>
    //         </div>
    //     </div>
    // );
};

export default PaymentResult;