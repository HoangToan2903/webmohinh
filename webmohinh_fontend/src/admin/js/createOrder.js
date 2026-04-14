import React, { useState, useEffect, useMemo } from 'react';
import api from '../../axiosConfig';
import {
    Box, Typography, Modal, Table, TableBody, TableCell, TableContainer,
    Paper, TableHead, TableRow, Avatar, Pagination, Stack, TextField, Button
} from '@mui/material';
import Swal from "sweetalert2";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '1200px',
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    maxHeight: '85vh',
    overflowY: 'auto',
};

function CreateOder() {
    // --- STATE ---
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [searchText, setSearchText] = useState("");
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho thông tin khách hàng
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: ''
    });

    useEffect(() => {
        import('../css/admin.css');
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // --- FETCH DATA ---
    const fetchProducts = async () => {
        try {
            const response = await api.get('/productsAll', { params: { page, size } });
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error);
        }
    }

    useEffect(() => { fetchProducts(); }, [page, size]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchText.trim() !== "") fetchVouchersSearch();
            else setVouchers([]);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    const fetchVouchersSearch = async () => {
        try {
            const response = await api.get("/voucher/search", {
                params: { codeVoucher: searchText, page: 0, size: 5 },
            });
            const exactMatch = response.data.content.filter(
                (v) => v.codeVoucher.toLowerCase() === searchText.toLowerCase()
            );
            setVouchers(exactMatch);
        } catch (error) {
            console.error("Lỗi voucher:", error);
        }
    };

    // --- LOGIC TÍNH TOÁN ---
    const subTotal = useMemo(() => {
        return selectedProducts.reduce((sum, item) => sum + (item.finalPrice * (item.orderQuantity || 0)), 0);
    }, [selectedProducts]);

    const activeVoucher = useMemo(() => {
        return vouchers.find(v => v.status === "Đang hoạt động" && subTotal >= v.conditions_apply);
    }, [vouchers, subTotal]);

    const discountValue = activeVoucher ? (subTotal * activeVoucher.reduced_value) / 100 : 0;
    const shippingFee = (subTotal > 3000000 || subTotal === 0) ? 0 : 35000;
    const finalTotal = subTotal - discountValue + shippingFee;

    // --- XỬ LÝ SỰ KIỆN ---
    const handleSelectProduct = (product) => {
        if (selectedProducts.find(item => item.id === product.id)) {
            alert("Sản phẩm này đã được chọn!");
            return;
        }
        const finalPrice = product.sale?.status === 1
            ? product.price * (1 - product.sale.discountPercent / 100)
            : product.price;

        setSelectedProducts([...selectedProducts, { ...product, orderQuantity: 1, finalPrice }]);
        handleClose();
    };

    const handleUpdateQuantity = (id, value) => {
        const qty = value === "" ? "" : parseInt(value);
        setSelectedProducts(selectedProducts.map(item => item.id === id ? { ...item, orderQuantity: qty } : item));
    };

    const userId = sessionStorage.getItem("idUser");
    const handleCreateOrder = async () => {
        // Validation cơ bản
        if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
            alert("Vui lòng nhập đầy đủ Tên, Số điện thoại và Địa chỉ!");
            return;
        }
        if (selectedProducts.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm!");
            return;
        }

        const orderRequest = {
            userId: 1, // ID mặc định hoặc lấy từ Auth Context
            name: customerInfo.name,
            email: customerInfo.email,
            shippingAddress: customerInfo.address,
            phone: customerInfo.phone,
            status: 1,
            notes: customerInfo.notes,
            paymentMethod: paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Đã thanh toán online",
            shipMoney: shippingFee,
            totalPrice: finalTotal,
            userId,
            source: "ADMIN_CREATED",
            voucherId: activeVoucher ? activeVoucher.id : null,
            items: selectedProducts.map(item => ({
                productId: item.id,
                quantity: item.orderQuantity,
                price: item.finalPrice
            }))
        };

        setLoading(true);
        try {
            // Đảm bảo URL /api/orders trùng với @RequestMapping ở Backend
            await api.post('/createAdmin', orderRequest);
            Swal.fire({
                icon: "success",
                title: "Tạo đơn hàng thành công 🎉",
                // text: `Mã đơn hàng: ${codeOrder}`,
                confirmButtonColor: "#4CAF50",
            });

            // Reset form
            setSelectedProducts([]);
            setCustomerInfo({ name: '', phone: '', email: '', address: '', notes: '' });
            setSearchText("");
        } catch (error) {
            console.error("Lỗi tạo đơn:", error);
            alert(error.response?.data?.message || "Lỗi hệ thống khi tạo đơn hàng!");
        } finally {
            setLoading(false);
        }
    };
    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };
    return (
        <div className="order-container" style={{ padding: '20px' }}>
            <header className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Tạo Đơn Hàng Mới</h2>
                <button className="btn-save" onClick={handleCreateOrder} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Lưu Đơn Hàng"}
                </button>
            </header>

            <div className="order-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div className="order-main">
                    {/* Thông tin khách hàng */}
                    <section className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>Thông tin khách hàng</h3>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="text" placeholder="Tên khách hàng *" style={{ flex: 1, padding: '10px' }}
                                    value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} />
                                <input type="text" placeholder="Số điện thoại *" style={{ flex: 1, padding: '10px' }}
                                    value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
                            </div>
                            {/* <input type="email" placeholder="Email (nếu có)" style={{ padding: '10px' }} 
                                value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} /> */}
                            <textarea placeholder="Địa chỉ giao hàng *" style={{ padding: '10px', minHeight: '60px' }}
                                value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} />
                            <textarea placeholder="Ghi chú đơn hàng" style={{ padding: '10px' }}
                                value={customerInfo.notes} onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })} />
                        </div>
                    </section>

                    {/* Danh sách sản phẩm */}
                    <section className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Sản phẩm đã chọn</h3>

                        </div>
                        <button className="btn-add" onClick={handleOpen} style={{ padding: '8px 15px', cursor: 'pointer' }}>+ Thêm sản phẩm</button>
                        <TableContainer sx={{ mt: 2 }}>
                            <Table>
                                <TableBody>
                                    {selectedProducts.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell align="right">{Number(item.finalPrice).toLocaleString()}đ</TableCell>
                                            <TableCell align="center">
                                                <input type="number" value={item.orderQuantity} min="1" style={{ width: '50px', textAlign: 'center' }}
                                                    onChange={(e) => handleUpdateQuantity(item.id, e.target.value)} />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                {(item.finalPrice * (item.orderQuantity || 0)).toLocaleString()}đ
                                            </TableCell>
                                            <TableCell>
                                                <Button color="error" onClick={() => setSelectedProducts(selectedProducts.filter(p => p.id !== item.id))}>Xóa</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </section>
                </div>

                <aside className="order-sidebar">
                    {/* Voucher */}
                    <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>🏷️ Mã ưu đãi</Typography>
                        <input type="text" placeholder="Nhập mã voucher..." value={searchText} onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
                        <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            {activeVoucher ? <span style={{ color: 'green' }}>Áp dụng giảm {activeVoucher.reduced_value}%</span> :
                                searchText && <span style={{ color: 'orange' }}>Chưa áp dụng</span>}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
                        <h3>Tổng kết</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <span>Tạm tính:</span>
                            <span>{subTotal.toLocaleString()} đ</span>
                        </div>
                        {discountValue > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'red' }}>
                                <span>Giảm giá:</span>
                                <span>-{discountValue.toLocaleString()} đ</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <span>Phí ship:</span>
                            <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()} đ`}</span>
                        </div>
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'red', fontSize: '1.2rem' }}>
                            <span>Tổng cộng:</span>
                            <span>{finalTotal.toLocaleString()} đ</span>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <p style={{ fontWeight: 'bold' }}>Thanh toán:</p>
                            <label style={{ display: 'block' }}><input type="radio" name="pay" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> Thanh toán khi nhận hàng</label>
                            <label style={{ display: 'block' }}><input type="radio" name="pay" checked={paymentMethod === "PAID"} onChange={() => setPaymentMethod("PAID")} /> Đã thanh toán</label>
                        </div>

                        <button className="create_order" onClick={handleCreateOrder} disabled={loading}
                            style={{ width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                            TẠO ĐƠN HÀNG
                        </button>
                    </div>
                </aside>
            </div>

            {/* Modal Chọn Sản Phẩm (Giữ nguyên logic của bạn) */}
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant="h6" gutterBottom>Chọn sản phẩm</Typography>
                    <hr />
                    <Box sx={{ mt: 2 }}>
                        <TableContainer component={Paper} sx={{ maxHeight: '50vh' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Hình ảnh</TableCell>
                                        <TableCell>Tên sản phẩm</TableCell>
                                        <TableCell align="right">Giá bán</TableCell>
                                        <TableCell align="center">Tồn kho</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell align="center">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.length > 0 ? (
                                        products.map((product, index) => (
                                            <TableRow key={product.id} hover>
                                                <TableCell>{page * size + index + 1}</TableCell>
                                                <TableCell>
                                                    <Avatar variant="rounded" src={product.images?.[0]?.imageUrl || ''} sx={{ width: 50, height: 50 }}>N/A</Avatar>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                                                <TableCell align="right" sx={{ color: 'red', fontWeight: 'bold' }}>
                                                    {Number(product.sale?.status === 1 ? product.price * (1 - product.sale.discountPercent / 100) : product.price).toLocaleString('vi-VN')} đ
                                                </TableCell>
                                                <TableCell align="center">{product.quantity}</TableCell>
                                                <TableCell>
                                                    <span style={{
                                                        color: product.status === "Còn hàng" ? "green" : "red",
                                                        backgroundColor: product.status === "Còn hàng" ? "#edf7ed" : "#fdeded",
                                                        padding: '4px 8px', borderRadius: '4px'
                                                    }}>
                                                        {product.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {product.status === "Còn hàng" ? (
                                                        <button
                                                            className="btn-select"
                                                            style={{
                                                                padding: '5px 15px',
                                                                backgroundColor: '#1976d2',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => handleSelectProduct(product)} // Gọi hàm xử lý chọn
                                                        >
                                                            Chọn
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: '#999', fontSize: '0.8rem' }}>Hết hàng</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={7} align="center">Đang tải dữ liệu...</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                        <Pagination count={totalPages} page={page + 1} onChange={handlePageChange} color="primary" />
                    </Stack>
                </Box>
            </Modal>
        </div>
    );
}

export default CreateOder;