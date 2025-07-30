import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart } from './addCart';

function CartItems() {
    useEffect(() => {
        import('../css/home.css');

    }, []);

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // ✅ Hàm cập nhật giỏ hàng từ cookie
        const updateCart = () => {
            const items = getCart();
            console.log("🧾 Dữ liệu giỏ hàng:", items);
            setCartItems(items);
        };

        // ✅ Gọi ngay khi component được load lần đầu
        updateCart();

        // ✅ Đăng ký lắng nghe sự kiện cartUpdated (mỗi lần thêm / xoá)
        window.addEventListener("cartUpdated", updateCart);

        // ✅ Gỡ sự kiện khi component bị huỷ
        return () => {
            window.removeEventListener("cartUpdated", updateCart);
        };
    }, []);

    const handleRemove = (id) => {
        if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
            removeFromCart(id); // Hàm này đã gọi dispatchEvent("cartUpdated")
        }
    };

    return (
        <div>
            <h1>🛒 Giỏ hàng của bạn</h1>
            {cartItems.length === 0 ? (
                <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {cartItems.map((item, index) => (
                        <li key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}>
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 10 }}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <strong>{item.name}</strong><br />
                                {Number(item.price).toLocaleString('vi-VN')} đ × {item.quantity}
                            </div>
                            <button onClick={() => handleRemove(item.id)}
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    cursor: 'pointer'
                                }}>
                                🗑️ Xoá
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CartItems;
