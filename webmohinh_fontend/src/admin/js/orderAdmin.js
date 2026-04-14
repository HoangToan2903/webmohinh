import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button,
    Tabs, Tab, TextField, Badge, Pagination, Chip, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import api from '../../axiosConfig';
import Swal from "sweetalert2";

export default function OrderAdmin() {
    const [orders, setOrders] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [counts, setCounts] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
    const [selectedSource, setSelectedSource] = useState('ALL');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // STATE CHO CHỨC NĂNG CHỌN HÀNG LOẠT - Lưu trữ ID (Long/String tùy DB)
    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        fetchOrders();
        fetchCounts();
        // Reset danh sách chọn khi đổi bất kỳ bộ lọc nào để tránh gửi nhầm ID không hiển thị
        setSelectedIds([]);
    }, [page, selectedDate, tabValue, selectedSource]);

    const fetchOrders = async () => {
        try {
            const res = await api.get(`/orderAdmin`, {
                params: {
                    page: page - 1,
                    size: 10,
                    status: tabValue,
                    date: selectedDate,
                    source: selectedSource
                }
            });
            setOrders(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (error) {
            console.error("Lỗi tải đơn:", error);
        }
    };

    const fetchCounts = async () => {
        try {
            const res = await api.get(`/orderAdmin/counts`, {
                params: {
                    date: selectedDate,
                    source: selectedSource
                }
            });
            setCounts(res.data);
        } catch (error) {
            console.error("Lỗi tải số lượng:", error);
        }
    };

    // CẬP NHẬT 1 ĐƠN HÀNG
    const handleUpdateStatus = async (id, newStatus) => {
        const messages = {
            1: "Bạn có xác nhận DUYỆT đơn hàng này không?",
            2: "Xác nhận đơn hàng đã GIAO THÀNH CÔNG?",
            3: "Bạn có chắc chắn muốn HỦY đơn hàng này không?"
        };
        const confirmMessage = messages[newStatus];
        
        const result = await Swal.fire({
            title: 'Xác nhận',
            text: confirmMessage,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await api.put(`/updateStatus/${id}`, null, {
                    params: { status: newStatus }
                });
                Swal.fire("Thành công!", "Đã cập nhật trạng thái đơn hàng.", "success");
                fetchOrders();
                fetchCounts();
            } catch (error) {
                console.error("Lỗi:", error);
                Swal.fire("Lỗi", "Không thể cập nhật đơn hàng này.", "error");
            }
        }
    };

    // CẬP NHẬT HÀNG LOẠT (SỬA LỖI TẠI ĐÂY)
    const handleUpdateMultipleStatus = async (newStatus) => {
        if (selectedIds.length === 0) {
            Swal.fire("Thông báo", "Vui lòng chọn ít nhất một đơn hàng!", "warning");
            return;
        }

        const actionText = newStatus === 1 ? "duyệt" : (newStatus === 3 ? "hủy" : "hoàn thành");
        
        const result = await Swal.fire({
            title: `Xác nhận ${actionText}`,
            text: `Bạn có chắc chắn muốn ${actionText} ${selectedIds.length} đơn hàng đã chọn?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus === 3 ? '#d33' : '#3085d6',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Quay lại'
        });

        if (result.isConfirmed) {
            try {
                // Gửi mảng ID (selectedIds đã chứa order.id)
                await api.put(`/updateStatus/multiple`, selectedIds, {
                    params: { status: newStatus }
                });

                Swal.fire({ icon: "success", title: "Cập nhật thành công!" });
                
                // QUAN TRỌNG: Reset mảng chọn và load lại data
                setSelectedIds([]); 
                fetchOrders();
                fetchCounts();
            } catch (error) {
                console.error("Lỗi cập nhật hàng loạt:", error);
                Swal.fire("Lỗi", error.response?.data || "Không tìm thấy dữ liệu để cập nhật", "error");
            }
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === orders.length) {
            setSelectedIds([]);
        } else {
            // Lưu id của đơn hàng thay vì codeOrder
            setSelectedIds(orders.map(o => o.id));
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Paper sx={{ p: 3, borderRadius: '15px', boxShadow: 3, bgcolor: '#fdfdfd' }}>
            <Typography variant="h4" color="error" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
                HỆ THỐNG QUẢN LÝ ĐƠN HÀNG
            </Typography>

            {/* Bộ lọc */}
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', p: 2, bgcolor: '#f1f3f4', borderRadius: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Lọc theo ngày:</Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={selectedDate}
                        onChange={(e) => { setSelectedDate(e.target.value); setPage(1); }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>Nguồn đơn:</Typography>
                    <TextField
                        select
                        size="small"
                        value={selectedSource}
                        onChange={(e) => { setSelectedSource(e.target.value); setPage(1); }}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="ALL">Tất cả nguồn</MenuItem>
                        <MenuItem value="CUSTOMER_ORDER">Khách tự đặt</MenuItem>
                        <MenuItem value="ADMIN_CREATED">Nhân viên tạo</MenuItem>
                    </TextField>
                </Box>
            </Box>

            {/* Thanh công cụ hàng loạt */}
            {selectedIds.length > 0 && (
                <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #90caf9', animation: 'fadeIn 0.3s' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        Đang chọn: {selectedIds.length} đơn hàng
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {tabValue === 0 && (
                            <>
                                <Button variant="contained" color="success" onClick={() => handleUpdateMultipleStatus(1)}>Duyệt đơn hàng</Button>
                                <Button variant="contained" color="error" onClick={() => handleUpdateMultipleStatus(3)}>Hủy đơn hàng</Button>
                            </>
                        )}
                        {tabValue === 1 && (
                            <Button variant="contained" color="primary" onClick={() => handleUpdateMultipleStatus(2)}>Xác định giao hoàn tất </Button>
                        )}
                        <Button variant="outlined" color="inherit" onClick={() => setSelectedIds([])}>Bỏ chọn</Button>
                    </Box>
                </Paper>
            )}

            <Tabs
                value={tabValue}
                onChange={(e, v) => { setTabValue(v); setPage(1); }}
                variant="fullWidth"
                sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
                <Tab label={<Badge badgeContent={counts[0] || 0} color="warning" sx={{ px: 1 }}>Chờ xác nhận</Badge>} />
                <Tab label={<Badge badgeContent={counts[1] || 0} color="info" sx={{ px: 1 }}>Đang giao</Badge>} />
                <Tab label={<Badge badgeContent={counts[2] || 0} color="success" sx={{ px: 1 }}>Thành công</Badge>} />
                <Tab label={<Badge badgeContent={counts[3] || 0} color="error" sx={{ px: 1 }}>Đã hủy</Badge>} />
            </Tabs>

            {orders.length > 0 && (
                <Box sx={{ px: 2, mb: 1 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                indeterminate={selectedIds.length > 0 && selectedIds.length < orders.length}
                                checked={orders.length > 0 && selectedIds.length === orders.length}
                                onChange={handleSelectAll}
                            />
                        }
                        label="Chọn tất cả đơn hàng trong trang này"
                    />
                </Box>
            )}

            <Box sx={{ mt: 1 }}>
                {orders.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', py: 10, color: 'gray' }}>
                        Không có đơn hàng nào khớp với điều kiện lọc.
                    </Typography>
                ) : (
                    orders.map((order) => (
                        <Paper key={order.id} variant="outlined" sx={{
                            p: 3, mb: 3, borderRadius: '12px',
                            border: selectedIds.includes(order.id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                            position: 'relative',
                            transition: '0.2s ease-in-out',
                            '&:hover': { boxShadow: 2 }
                        }}>
                            <Box sx={{ position: 'absolute', top: 15, left: 10 }}>
                                <Checkbox
                                    checked={selectedIds.includes(order.id)}
                                    onChange={() => handleSelectOne(order.id)}
                                />
                            </Box>

                            <Box sx={{ ml: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                            #{order.codeOrder}
                                            <Chip
                                                label={order.source === 'CUSTOMER_ORDER' ? 'Khách đặt' : `Admin: ${order.userName || 'N/A'}`}
                                                color={order.source === 'CUSTOMER_ORDER' ? 'secondary' : 'default'}
                                                size="small"
                                                sx={{ ml: 1, fontSize: '0.7rem' }}
                                            />
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        {order.status === 0 && <Chip label="Chờ xác nhận" color="warning" />}
                                        {order.status === 1 && <Chip label="Đang giao" color="primary" />}
                                        {order.status === 2 && <Chip label="Thành công" color="success" />}
                                        {order.status === 3 && <Chip label="Đã hủy" color="error" />}
                                    </Box>
                                </Box>

                                <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '8px' }}>
                                    <Typography variant="body1"><strong>Khách hàng:</strong> {order.name} - {order.phone}</Typography>
                                    <Typography variant="body1"><strong>Địa chỉ:</strong> {order.shippingAddress}</Typography>
                                    <Typography variant="body2" color="textSecondary"><strong>Thanh toán:</strong> {order.paymentMethod}</Typography>
                                </Box>

                                <TableContainer component={Box} sx={{ mt: 2 }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                            <TableRow>
                                                <TableCell>Sản phẩm</TableCell>
                                                <TableCell align="center">SL</TableCell>
                                                <TableCell align="right">Giá</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {order.items?.map((item, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell align="center">{item.quantity}</TableCell>
                                                    <TableCell align="right">{item.price?.toLocaleString()}đ</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Box>
                                        {order.voucherDiscount > 0 && (
                                            <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                                                Voucher: -{order.voucherDiscount}%
                                            </Typography>
                                        )}
                                        <Typography variant="body2">Phí ship: {order.shipMoney?.toLocaleString()}đ</Typography>
                                        <Typography variant="h6" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                            Tổng: {order.totalPrice?.toLocaleString()}đ
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {order.status === 0 && (
                                            <>
                                                <Button size="small" variant="contained" color="success" onClick={() => handleUpdateStatus(order.id, 1)}>Duyệt</Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateStatus(order.id, 3)}>Hủy</Button>
                                            </>
                                        )}
                                        {order.status === 1 && (
                                            <Button size="small" variant="contained" color="primary" onClick={() => handleUpdateStatus(order.id, 2)}>Hoàn tất</Button>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    ))
                )}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange} 
                    color="error" 
                    size="large"
                />
            </Box>
        </Paper>
    );
}