// 💥 Component Result nhận orderDetails qua props
function Result({ orderDetails }) {
    // KHÔNG CẦN useLocation NỮA vì dữ liệu đã được truyền từ Checkout.jsx

    // Nếu không có dữ liệu, không hiển thị gì (hoặc hiển thị thông báo lỗi)
    if (!orderDetails) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Không có thông tin đơn hàng.</div>;
    }

    return (
        <div style={{ maxWidth: '100%', margin: 'auto' }}>

            <h2 style={{ textAlign: 'center', color: '#00c853', marginBottom: '15px' }}>🎉 ĐẶT HÀNG THÀNH CÔNG! 🎉</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                Cảm ơn bạn đã tin tưởng và đặt hàng tại NemoShop. Đơn hàng của bạn đang chờ xác nhận.
            </p>

            <div className="notes" style={{ border: '1px solid #ffcc80', padding: '15px', backgroundColor: '#fff3e0' }}>
                <h3>Lưu ý về Đơn hàng:</h3>
                <p>• Các bạn yên tâm khi mua hàng tại NemoShop</p>
                <p>• Khuyến khích trước khi mua hãy nhắn tin Zalo/Messenger để shop tư vấn chi tiết nhất</p>
                <p>• Sản phẩm lỗi, hư hỏng có thể đổi trả</p>
                <p>• Được kiểm tra hàng trước khi nhận</p>
                <p>• Thời gian giao hàng sẽ từ 2-3 ngày đồng giá ship là: {orderDetails.shipping.toLocaleString('vi-VN')} ₫</p>
            </div>

            <b style={{ fontSize: "24px", color: "#fc6b4c", display: 'block', margin: '20px 0 10px 0' }}>Chi tiết đơn hàng</b>

            <table className="table_product" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #b4b4b4ff' }}>
                        <td style={{ padding: '10px', textAlign: 'left' }}><b>Sản phẩm</b></td>
                        <td className="right" style={{ padding: '10px', textAlign: 'right' }}><b>Tổng</b></td>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ color: "#fc6b4c", padding: '10px' }}>{item.name} x {item.quantity}</td>
                            <td className="right" style={{ padding: '10px', textAlign: 'right' }}>
                               <b> {(item.price * item.quantity).toLocaleString('vi-VN')} ₫</b>
                            </td>
                        </tr>
                    ))}

                    <tr><td style={{ padding: '10px' }}><b>Tổng số phụ:</b></td><td className="right" style={{ padding: '10px', textAlign: 'right' }}><b>{orderDetails.subtotal.toLocaleString('vi-VN')} ₫</b></td></tr>
                    <tr><td style={{ padding: '10px' }}><b>Chi phí vận chuyển:</b></td><td className="right" style={{ padding: '10px', textAlign: 'right' }}><b>{orderDetails.shipping.toLocaleString('vi-VN')} ₫</b></td></tr>
                    <tr><td style={{ padding: '10px' }}><b>Phương thức thanh toán:</b></td><td className="right" style={{ padding: '10px', textAlign: 'right' }}><b>{orderDetails.paymentMethod}</b></td></tr>
                </tbody>

                <tfoot>
                    <tr style={{ borderTop: '2px solid #b4b4b4ff' }}>
                        <td style={{ padding: '10px', fontSize: '1.2em' }}><b>Tổng cộng:</b></td>
                        <td className="right total" style={{ padding: '10px', fontSize: '1.2em', textAlign: 'right', color: '#e53935' }}>
                            {orderDetails.totalPrice.toLocaleString('vi-VN')} ₫
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="address" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
                    <h3>Thông tin khách hàng </h3>
                    <p><b>Họ tên:</b> {orderDetails.customer.name}</p>
                    <p><b>Email:</b> {orderDetails.customer.email}</p>
                    <p><b>Điện thoại:</b> {orderDetails.customer.phone}</p>
                    <p><b>Ghi chú:</b> {orderDetails.customer.notes || "(Không có)"}</p>
                </div>
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px' }}>
                    <h3>Địa chỉ giao hàng</h3>
                    <p><b>Người nhận:</b> {orderDetails.customer.name}</p>
                    <p><b>Địa chỉ:</b> {orderDetails.customer.address}</p>
                    <p><b>Điện thoại:</b> {orderDetails.customer.phone}</p>
                </div>
            </div>

            <div className="confirm-box" style={{ border: '1px solid #ccc', padding: '15px', backgroundColor: '#f9f9f9' }}>
                <b style={{ color: '#339933' }}>Cảm ơn bạn. Đơn hàng của bạn đã được nhận</b>
                <ul>
                    <li>Mã đơn hàng: <b>{orderDetails.codeOrder}</b></li>
                    <li>Ngày: <b>{orderDetails.date}</b></li>
                    <li>Tổng cộng: <b style={{ color: '#fc6b4c' }}>{orderDetails.totalPrice.toLocaleString('vi-VN')} ₫</b></li>
                    <li>Phương thức thanh toán: <b>{orderDetails.paymentMethod}</b></li>
                    <li>Trạng thái đơn hàng: <b style={{ color: '#ff9800' }}>Chờ xác nhận</b></li>
                </ul>
            </div>
        </div>
    )
}
export default Result;