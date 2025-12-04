import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Định nghĩa key cho sessionStorage để kiểm soát việc hiển thị Swal
const SWAL_DISPLAYED_KEY = "vnpay_swal_displayed";

const PaymentResult = () => {
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
                const res = await axios.get(
                    `http://localhost:8080/website/vnpay-return?${queryString}`
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
                        const orderRes = await axios.get(
                            `http://localhost:8080/website/orders/${codeOrder}`
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

    // --- LOGIC HIỂN THỊ (RENDER) ---

    const containerStyle = {
        maxWidth: "900px",
        margin: "20px auto",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    };
    
    const primaryColor = "#f15a22"; 
    const successColor = "#4CAF50";
    const errorColor = "#e53935";

    if (status === "loading") {
        return (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h2>⏳ Đang xử lý thanh toán...</h2>
                <p>Vui lòng không tắt trình duyệt cho đến khi hoàn tất.</p>
            </div>
        );
    }

    if (status === "success" && orderDetails) {
        const formatCurrency = (amount) => {
            if (amount === undefined || amount === null) return '0 ₫';
            return amount.toLocaleString('vi-VN') + ' ₫';
        };

        return (
            <div style={containerStyle}>
                {/* Navigation (Giả lập) */}
                <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: "20px", marginBottom: "20px", borderBottom: "1px solid #eee", color: "#ccc", fontWeight: "500" }}>
                    <span>Giỏ hàng</span>
                    <span>Chi tiết thanh toán</span>
                    <span style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}`, paddingBottom: "20px" }}>Đơn hàng hoàn tất</span>
                </div>

                <div style={{ padding: "10px", backgroundColor: "#fcf0f0", borderLeft: "4px solid #f99", marginBottom: "30px" }}>
                    <p style={{ color: errorColor, margin: "5px 0", fontSize: "0.9em" }}>• Các bạn yên tâm khi mua hàng tại NemoShop</p>
                    <p style={{ color: errorColor, margin: "5px 0", fontSize: "0.9em" }}>• Khuyến khích trước khi mua hãy nhắn tin Zalo/Messenger để shop tư vấn chi tiết nhất</p>
                    <p style={{ color: errorColor, margin: "5px 0", fontSize: "0.9em" }}>• Sản phẩm lỗi, hư hỏng có thể đổi trả</p>
                    <p style={{ color: errorColor, margin: "5px 0", fontSize: "0.9em" }}>• Được kiểm tra hàng trước khi nhận</p>
                    <p style={{ color: errorColor, margin: "5px 0", fontSize: "0.9em" }}>• Thời gian giao hàng sẽ từ 2-3 ngày đồng giá ship là 35k</p>
                </div>

                <h2>Chi tiết đơn hàng</h2>

                <div style={{ border: "1px solid #eee", marginBottom: "30px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", backgroundColor: "#f9f9f9", fontWeight: "600", borderBottom: "1px solid #eee" }}>
                        <div style={{ width: "70%" }}>Sản phẩm</div>
                        <div style={{ width: "30%", textAlign: "right" }}>Tổng</div>
                    </div>
                    
                    {/* Danh sách sản phẩm */}
                    {orderDetails.items?.map((item, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "10px 15px", borderBottom: "1px dashed #eee" }}>
                            <div style={{ width: "70%" }}>{item.name} x {item.quantity}</div>
                            <div style={{ width: "30%", textAlign: "right" }}>{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                    ))}

                    {/* Tổng phụ, Shipping, Payment Method */}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 15px" }}>
                        <div style={{ width: "70%" }}>Tổng số phụ:</div>
                        <div style={{ width: "30%", textAlign: "right" }}>{formatCurrency(orderDetails.subtotal)}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 15px" }}>
                        <div style={{ width: "70%" }}>Giao nhận hàng:</div>
                        <div style={{ width: "30%", textAlign: "right" }}>{formatCurrency(orderDetails.shipping)}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 15px" }}>
                        <div style={{ width: "70%" }}>Phương thức thanh toán:</div>
                        <div style={{ width: "30%", textAlign: "right" }}>{orderDetails.paymentMethod}</div>
                    </div>

                    {/* Tổng cộng */}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", backgroundColor: "#fff", borderTop: "2px solid #ccc", fontWeight: "700", fontSize: "1.1em" }}>
                        <div style={{ width: "70%" }}>Tổng cộng:</div>
                        <div style={{ width: "30%", textAlign: "right", color: errorColor }}>{formatCurrency(orderDetails.totalPrice)}</div>
                    </div>
                </div>

                {/* Thông tin Khách hàng và Địa chỉ */}
                <div style={{ display: "flex", gap: "5%", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ color: errorColor, marginBottom: "15px" }}>Thông tin khách hàng</h3>
                        <p style={{ margin: "5px 0" }}><b>{orderDetails.customer?.name}</b></p>
                        <p style={{ margin: "5px 0" }}>{orderDetails.customer?.email}</p>
                        <p style={{ margin: "5px 0" }}>{orderDetails.customer?.phone}</p>
                        <p style={{ margin: "5px 0" }}>{orderDetails.customer?.address}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ color: errorColor, marginBottom: "15px" }}>Địa chỉ giao hàng</h3>
                        <p style={{ margin: "5px 0" }}><b>{orderDetails.customer?.name}</b></p>
                        <p style={{ margin: "5px 0" }}>{orderDetails.customer?.address}</p>
                        <p style={{ margin: "5px 0" }}>{orderDetails.customer?.phone}</p>
                    </div>
                </div>

                {/* Hộp thông báo xác nhận */}
                <div style={{ backgroundColor: "#f9f0c5", padding: "20px", borderRadius: "4px", border: "1px solid #f7e6a7" }}>
                    <p style={{ fontWeight: "700", fontSize: "1.1em", color: successColor, margin: "5px 0" }}>
                        Cảm ơn bạn đã tin tưởng và đặt hàng bên mình. Đơn hàng của bạn đang chờ xác nhận .
                    </p>
                    <p style={{ margin: "5px 0" }}>Mã đơn hàng: <b>{orderDetails.codeOrder}</b></p>
                    <p style={{ margin: "5px 0" }}>Ngày: {orderDetails.date}</p>
                    <p style={{ margin: "5px 0" }}>Tổng cộng: <b>{formatCurrency(orderDetails.totalPrice)}</b></p>
                    <p style={{ margin: "5px 0" }}>Phương thức thanh toán: {orderDetails.paymentMethod}</p>
                    <p style={{ margin: "5px 0" }}>Trạng thái đơn hàng: <b style={{ color: primaryColor }}>Đã thanh toán / Chờ xác nhận</b></p>
                </div>

                {/* Nút hành động */}
                <div style={{ textAlign: "center", marginTop: "30px" }}>
                    <a href="/" style={{
                        display: "inline-block",
                        backgroundColor: primaryColor,
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
        );
    }

    // ❌ Các trường hợp thất bại / lỗi
    return (
        <div style={{ padding: "40px 0", textAlign: "center" }}>
            <h1 style={{ color: errorColor }}>{message}</h1>
            <p>Vui lòng kiểm tra lại thông tin thanh toán hoặc liên hệ bộ phận hỗ trợ.</p>
            <div style={{ marginTop: "30px" }}>
                <a href="/" style={{
                    backgroundColor: errorColor,
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "600"
                }}>
                    ← Quay lại cửa hàng
                </a>
            </div>
        </div>
    );
};

export default PaymentResult;