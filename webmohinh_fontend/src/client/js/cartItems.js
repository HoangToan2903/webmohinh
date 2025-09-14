import React, { useEffect, useState } from 'react';
import { getCart, removeFromCart } from './addCart';
import Navbar from './navbar'
import Footer from './footer'
import slugify from "./utils/slugify";
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Typography, TextField, Stack } from "@mui/material";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from "axios";
import { Alert, Slide } from '@mui/material';


const PAGE_SIZE = 10;

function CartItems() {
    useEffect(() => {
        import('../css/home.css');

    }, []);

    const navigate = useNavigate();

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
    const tabs = document.querySelectorAll(".tab");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            const selected = tab.getAttribute("data-tab");
            contents.forEach((c) => {
                c.style.display = c.id === selected ? "block" : "none";
            });
        });
    });


    const handleIncrease = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const [method, setMethod] = useState("Thanh toán khi nhận hàng"); // <-- không có <string> nếu là JS

    const handleChange = (e) => {
        setMethod(e.target.value);
    };
    const shipping = 35000;


    // tìm kiếm
    const [searchText, setSearchText] = useState("");
    const [vouchers, setVouchers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    // Gọi API khi searchText hoặc page thay đổi (debounce 300ms)
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchText.trim() !== "") {
                fetchVouchersSearch();
            } else {
                setVouchers([]); // clear nếu trống
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchText, page]);

    const fetchVouchersSearch = async () => {
        try {
            const response = await axios.get("http://localhost:8080/website/voucher/search", {
                params: { codeVoucher: searchText, page, size: PAGE_SIZE },
            });

            // Lọc lại: chỉ lấy voucher có mã trùng khớp hoàn toàn
            const exactMatch = response.data.content.filter(
                (v) => v.codeVoucher.toLowerCase() === searchText.toLowerCase()
            );

            setVouchers(exactMatch);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };

    const [successAlertAdd, setSuccessAlertAdd] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState('');
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    // const [method, setMethod] = useState("cod");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [orderDetails, setOrderDetails] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(index);
    };
    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!value.trim()) {
            setEmailError("Vui lòng nhập email!");
        } else if (!validateEmail(value)) {
            setEmailError("Email không đúng định dạng. Ví dụ: example@gmail.com");
        } else {
            setEmailError("");
        }
    };

    const handlePhoneChange = (event) => {
        const value = event.target.value;

        // Chỉ giữ lại các ký tự số 0-9
        const numericValue = value.replace(/\D/g, '');

        setPhone(numericValue);

        // Validate số điện thoại Việt Nam (10 số, bắt đầu từ 0)
        const phoneRegex = /^0\d{9}$/;

        if (!numericValue) {
            setPhoneError('Vui lòng nhập số điện thoại');
        } else if (!phoneRegex.test(numericValue)) {
            setPhoneError('Số điện thoại không hợp lệ. Phải đủ 10 số và bắt đầu bằng 0');
        } else {
            setPhoneError('');
        }
    };
    const validateForm = () => {
        return (
            name.trim() !== "" &&
            email.trim() !== "" &&
            phone.trim() !== "" &&
            address.trim() !== ""
        );
    };
    const finalTotal = (() => {
        const baseTotal = (Number(subtotal) || 0) + (Number(shipping) || 0);
        const discountPercent =
            vouchers.length > 0 && vouchers[0].status === "Đang hoạt động"
                ? vouchers[0].reduced_value
                : 0;
        return baseTotal - (baseTotal * discountPercent) / 100;
    })();
    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            setMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        const orderRequest = {
            name,
            email,
            shippingAddress: address,
            phone,
            notes,
            paymentMethod: method,
            shipMoney: shipping,
            totalPrice: finalTotal,
            voucherId: vouchers.length > 0 ? vouchers[0].id : null,
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8080/website/orders", orderRequest);

            // Lưu dữ liệu đơn hàng vào state
            setOrderDetails({
                codeOrder: response.data.codeOrder,
                date: new Date().toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                shipping: shipping,
                paymentMethod: method,
                items: cartItems,
                subtotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + shipping,
                customer: {
                    name,
                    email,
                    phone,
                    address,
                    notes
                }
            });

            setMessage("Đặt hàng thành công! Mã đơn hàng: " + response.data.codeOrder);

            // Reset form
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            setNotes("");
            setSuccessAlertAdd(true);
            setTimeout(() => setSuccessAlertAdd(false), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Đặt hàng thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <br></br>

            {successAlertAdd && (
                <Slide
                    direction="left"
                    in={successAlertAdd}
                    mountOnEnter
                    unmountOnExit
                >
                    <Alert
                        sx={{
                            width: '500px', // hoặc tùy chỉnh
                            position: 'fixed',
                            top: 16, // cách mép trên 16px
                            right: 16, // cách mép phải 16px
                            zIndex: 9999, // đảm bảo hiển thị trên các thành phần khác
                        }}
                        severity="success"
                    >
                        Đặt hàng thành công !!!
                    </Alert>
                </Slide>
            )}
            <div className="tab-wrapper ">
                <div className="tabs">
                    <button className="tab active" data-tab="home">Giỏ hàng</button>
                    <button className="tab " disabled >Chi tiết thanh toán</button>
                    <button className="tab" disabled>Đơn hàng hoàn tất</button>
                </div>

                <div className="tab-content" id="home">
                    <h4>- Ưu đãi đọc biệt</h4>
                    <h4>- Đồng giá phí ship 35k toàn quốc (không áp dụng đơn hỏa tốc)</h4>

                    <h1 style={{ color: "#e74c3c" }}>🛒 Giỏ hàng của bạn</h1>
                    <div className="grid-tab" id="product-section">
                        <div className="grid-item-tab">
                            {cartItems.length === 0 ? (
                                <p>Chưa có sản phẩm nào trong giỏ hàng.</p>,
                                <button className="checkout-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClick(0);
                                        navigate('/home');
                                    }} >Quay trở lại cửa hàng</button>


                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Ảnh</th>
                                            <th style={{ width: '25%', textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Sản phẩm</th>
                                            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Giá</th>
                                            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Số lượng</th>
                                            <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}></th>
                                            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ccc' }}>Tổng tiền</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px' }}>
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            style={{
                                                                width: 80,
                                                                height: 80,
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px', verticalAlign: 'top' }}>
                                                    <strong
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {
                                                            localStorage.setItem("productsId", item.id);
                                                            localStorage.setItem("productImages", JSON.stringify(item.images || []));
                                                            navigate(`/shopNemo/${slugify(item.name)}`);
                                                        }}
                                                    >{item.name}</strong>
                                                </td>
                                                <td style={{ padding: '10px', verticalAlign: 'top' }}>
                                                    {Number(item.price).toLocaleString('vi-VN')} đ
                                                </td>
                                                <td style={{ verticalAlign: 'top' }}>
                                                    <div style={{ marginTop: 8 }}>
                                                        <div style={styles.quantityBox}>
                                                            <button onClick={() => handleDecrease(item.id)} style={styles.button}>−</button>
                                                            <div style={styles.value}>{item.quantity}</div>
                                                            <button onClick={() => handleIncrease(item.id)} style={styles.button}>＋</button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '10px', verticalAlign: 'top' }}>
                                                    <button
                                                        onClick={() => handleRemove(item.id)}
                                                        style={{
                                                            backgroundColor: 'red',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '6px 12px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                                <td style={{ padding: '10px', verticalAlign: 'top' }}>
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {/* <a style={{float:"right"}}  className="view">Cập nhập giỏ hàng</a> */}
                        </div>
                        <div className="vertical-line"></div>
                        {cartItems.length === 0 ? (
                            <p></p>
                        ) : (
                            <div className="grid-item">
                                <div className="cart-summary">
                                    <h3 className="cart-heading">CỘNG GIỎ HÀNG</h3>

                                    <div className="cart-row">
                                        <span>Tạm tính</span>
                                        <strong>{subtotal.toLocaleString('vi-VN')} ₫</strong>
                                    </div>

                                    <div className="cart-row">
                                        <div>
                                            <div>Giao Hàng Trong 2-3 Ngày:</div>
                                            <div className="shipping-note">
                                                Tùy chọn giao hàng sẽ được cập nhật trong quá trình thanh toán.
                                                <br />
                                                <span className="shipping-fee">Tính phí giao hàng</span>
                                            </div>
                                        </div>
                                        <span>35,000 ₫</span>
                                    </div>

                                    <hr className="cart-divider" />

                                    <div className="cart-row total-row">
                                        <span>Tổng</span>
                                        <strong>{(subtotal + shipping).toLocaleString('vi-VN')} ₫</strong>

                                    </div>
                                    <button className="tab checkout-button " data-tab="profile">TIẾN HÀNH THANH TOÁN</button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="tab-content" id="profile" style={{ display: 'none' }}>
                    <div className="grid-tab" id="product-section">
                        <div className="grid-item-tab">
                            <h1 style={{ color: "#e74c3c" }}> Thông tin thanh toán </h1>
                            <b style={{ color: "#e74c3c" }}>* Vui lòng nhập đầy đủ thông tin thanh toán</b>
                            <br></br>
                            <br></br>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên *"
                                    variant="filled"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="Email *"
                                    variant="filled"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={!!emailError}
                                    helperText={emailError}
                                    placeholder="Nhập email của bạn"
                                />
                                <TextField
                                    fullWidth
                                    label="Số điện thoại *"
                                    variant="filled"
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    error={!!phoneError}
                                    helperText={phoneError} // Hiển thị lỗi bên dưới
                                    placeholder="Nhập số điện thoại của bạn"
                                    inputProps={{
                                        inputMode: 'numeric', // Gợi ý bàn phím số trên mobile
                                        pattern: '[0-9]*',   // HTML validation cơ bản
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Địa chỉ *"
                                    variant="filled"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <TextareaAutosize
                                    placeholder="Ghi chú đơn hàng..."
                                    minRows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px"
                                    }}
                                />
                            </Stack>

                        </div>
                        <div className="vertical-line"></div>
                        <div className="grid-item">
                            <div className="cart-summary">
                                <h3 className="cart-heading">ĐƠN HÀNG CỦA BẠN</h3>
                                <div className="discount-section">
                                    <label className="discount-label">🔖 Mã ưu đãi</label>

                                    <input
                                        type="text"
                                        placeholder="Mã ưu đãi"
                                        className="discount-input"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />

                                    {
                                        /* <button className="apply-button" onClick={fetchVouchersSearch}>
                                            Áp dụng
                                        </button> */
                                    }
                                </div>
                                <hr className="cart-divider" />

                                <div className="cart-row">
                                    <span>Sản phẩm</span>
                                    <strong>Tạm tính</strong>
                                </div>
                                {cartItems.map((item, index) => (
                                    <div className="cart-row" key={index}>
                                        <div>
                                            <div className="shipping-note" style={{ fontSize: "15px" }}>
                                                {item.name}
                                                <br />
                                                <span className="shipping-fee">Số lượng: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <span>{Number(item.price).toLocaleString('vi-VN')} đ</span>
                                    </div>
                                ))}

                                <hr className="cart-divider" />
                                <div className="cart-row">
                                    <div>
                                        <div className="shipping-note" style={{ fontSize: "15px" }}>
                                            Tạm tính
                                            <br />

                                        </div>
                                    </div>
                                    <span> {(subtotal).toLocaleString('vi-VN')} ₫</span>
                                </div>

                                <hr className="cart-divider" />
                                <div className="cart-row">
                                    <div>
                                        <div className="shipping-note" style={{ fontSize: "15px" }}>
                                            Giao hàng
                                            <br />

                                        </div>
                                    </div>
                                    <span> Giao Hàng Trong 2-3 Ngày: 35,000 ₫</span>
                                </div>

                                {/* Hiển thị kết quả voucher xuống dưới */}
                                <div className="voucher-results">
                                    {vouchers.length > 0 ? (
                                        <ul>
                                            {vouchers.map((v) => (
                                                <ul
                                                    key={v.id}

                                                    style={{
                                                        cursor: v.status === "Đang hoạt động" ? "pointer" : "not-allowed",
                                                        opacity: v.status === "ACTIVE",
                                                    }}
                                                >
                                                    <hr className="cart-divider" />
                                                    <div className="cart-row" style={{ color: "#e53935" }}>

                                                        {v.status === "Đang hoạt động" ? (
                                                            <>

                                                                <span>Phần trăm giảm</span>
                                                                <strong> {v.reduced_value}%</strong>
                                                            </>
                                                        ) : (
                                                            <span style={{ color: "#e53935" }}>
                                                                Voucher hết hạn sử dụng</span>
                                                        )}
                                                    </div>
                                                </ul>
                                            ))}
                                        </ul>
                                    ) : (
                                        searchText && <p style={{ color: "#e53935" }}>Không tìm thấy mã phù hợp.</p>
                                    )}
                                </div>



                                <hr className="cart-divider" />

                                <div className="cart-row total-row">
                                    <span>Tổng</span>
                                    <strong>
                                        {(() => {
                                            const baseTotal =
                                                (Number(subtotal) || 0) + (Number(shipping) || 0);

                                            // Nếu voucher đầu tiên đang hoạt động thì mới giảm, ngược lại giữ nguyên
                                            const discountPercent =
                                                vouchers.length > 0 && vouchers[0].status === "Đang hoạt động"
                                                    ? vouchers[0].reduced_value
                                                    : 0;

                                            const finalTotal = baseTotal - (baseTotal * discountPercent) / 100;

                                            return finalTotal.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                                minimumFractionDigits: 0,
                                            });
                                        })()}
                                    </strong>
                                </div>



                                <hr className="cart-divider" />


                                <Box className="p-4 max-w-xl">
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend" className="mb-2 text-lg font-semibold">
                                            Chọn phương thức thanh toán
                                        </FormLabel>
                                        <RadioGroup value={method} onChange={handleChange}>
                                            <FormControlLabel value="Thanh toán trước" control={<Radio />} label="Chuyển khoản ngân hàng" />
                                            <FormControlLabel value="Thanh toán khi nhận hàng" control={<Radio />} label=" Thanh toán khi nhận hàng" />
                                        </RadioGroup>
                                    </FormControl>

                                    <Box className="mt-4 p-3 border rounded-md shadow-sm bg-white">
                                        {method === "Thanh toán trước" && (
                                            <>
                                                <h4>Thông tin chuyển khoản</h4>
                                                <Typography component="p">- Tên tài khoản: Hoàng Đức Toản</Typography>
                                                <Typography component="p">- Ngân hàng: Vietcombank</Typography>
                                                <Typography component="p">- Số tài khoản: 0000000000000000</Typography>
                                                <Typography component="p" className="mt-2 font-medium">
                                                    * Chú ý: Liên hệ với shop qua Zalo/Messenger để xác nhận đơn trước khi chuyển khoản
                                                </Typography>
                                            </>
                                        )}

                                        {method === "Thanh toán khi nhận hàng" && (
                                            <>
                                                <Typography component="p">- Ship COD thông qua GHTK khi giao hàng được kiểm tra hàng</Typography>
                                                <Typography component="p">- Thời gian giao hàng từ 2-3 ngày mọi vùng</Typography>
                                                <Typography component="p">- Miễn phí ship khi mua 2 đơn</Typography>
                                                <Typography component="p">- Nhận đổi trả khi sản phẩm bị lỗi</Typography>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                                <br></br>
                                <b style={{ color: "#e74c3c" }}>* Vui lòng nhập đầy đủ thông tin trước khi thanh toán</b>
                                <button className="checkout-button tab" data-tab="settings" onClick={handlePlaceOrder}
                                    disabled={!validateForm() || loading} // disabled nếu chưa đủ dữ liệu hoặc đang gửi
                                    style={{
                                        backgroundColor: !validateForm() ? "#ccc" : "#e74c3c",
                                        cursor: !validateForm() ? "not-allowed" : "pointer",
                                    }}>   {loading ? "Đang xử lý..." : "ĐẶT HÀNG"}
                                </button>


                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-content" id="settings" style={{ display: orderDetails ? 'block' : 'none' }}>
                    {orderDetails && (
                        <>
                            <div className="notes">
                                <p>• Các bạn yên tâm khi mua hàng tại NemoShop</p>
                                <p>• Khuyến khích trước khi mua hãy nhắn tin Zalo/Messenger để shop tư vấn chi tiết nhất</p>
                                <p>• Sản phẩm lỗi, hư hỏng có thể đổi trả</p>
                                <p>• Được kiểm tra hàng trước khi nhận</p>
                                <p>• Thời gian giao hàng sẽ từ 2-3 ngày đồng giá ship là 35k</p>
                            </div>

                            <b style={{ fontSize: "24px", color: "#e53935" }}>Chi tiết đơn hàng</b>

                            <table className="table_product">
                                <thead>
                                    <tr>
                                        <td><b>Sản phẩm</b></td>
                                        <td className="right"><b>Tổng</b></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.items.map((item, index) => (
                                        <tr key={index} >
                                            <td style={{ color: "#e53935" }}>{item.name} x {item.quantity}</td>
                                            <td className="right">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Tổng phụ - chỉ tiền sản phẩm */}
                                    <tr>
                                        <td><b>Tổng số phụ:</b></td>
                                        <td className="right">
                                            {orderDetails.subtotal.toLocaleString('vi-VN')} ₫
                                        </td>
                                    </tr>

                                    {/* Phí ship */}
                                    <tr>
                                        <td><b>Giao nhận hàng:</b></td>
                                        <td className="right">
                                            {orderDetails.shipping.toLocaleString('vi-VN')} ₫
                                        </td>
                                    </tr>

                                    {/* Phương thức thanh toán */}
                                    <tr>
                                        <td><b>Phương thức thanh toán:</b></td>
                                        <td className="right">{orderDetails.paymentMethod}</td>
                                    </tr>
                                </tbody>

                                {/* Tổng cộng = subtotal + shipping */}
                                <tfoot>
                                    <tr>
                                        <td><b>Tổng cộng:</b></td>
                                        <td className="right total">
                                            {orderDetails.totalPrice.toLocaleString('vi-VN')} ₫
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>


                            <div className="address">
                                <div>
                                    <h3>Thông tin khách hàng </h3>
                                    <p>{orderDetails.customer.name}</p>
                                    <p>{orderDetails.customer.email}</p>
                                    <p>{orderDetails.customer.phone}</p>
                                    <p>{orderDetails.customer.address}</p>
                                </div>
                                <div>
                                    <h3>Địa chỉ giao hàng</h3>
                                    <p>{orderDetails.customer.name}</p>
                                    <p>{orderDetails.customer.address}</p>
                                    <p>{orderDetails.customer.phone}</p>
                                </div>
                            </div>

                            <div className="confirm-box">
                                <p>Cảm ơn bạn đă tin tưởng và đặt hàng bên mình. Đơn hàng của bạn đang chờ xác nhận .</p>
                                <ul>
                                    <li><b>Mã đơn hàng:</b> {orderDetails.codeOrder}</li>
                                    <li><b>Ngày:</b> {orderDetails.date}</li>
                                    <li><b>Tổng cộng:</b> {orderDetails.totalPrice.toLocaleString('vi-VN')} ₫</li>
                                    <li><b>Phương thức thanh toán:</b> {orderDetails.paymentMethod}</li>
                                    <li><b>Trạng thái đơn hàng :</b> Chờ xác nhận </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>


            </div>
            <br></br>


            <Footer />
        </div>
    );
}
const styles = {
    container: {
        // height: '100vh',
        // backgroundColor: '#e3e2e0',
        display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        fontFamily: 'sans-serif'
    },
    title: {
        marginBottom: '20px',
        color: '#333'
    },
    quantityBox: {
        display: 'flex',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '40px',
        height: '50px',
        border: 'none',
        backgroundColor: '#f7f7f7',
        fontSize: '24px',
        cursor: 'pointer',
        outline: 'none',
    },
    value: {
        width: '40px',
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        fontSize: '18px',
        backgroundColor: '#fff',
        // fontWeight: 'bold',
        userSelect: 'none'
    }
};
export default CartItems;
