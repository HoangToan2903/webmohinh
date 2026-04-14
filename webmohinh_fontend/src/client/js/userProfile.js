import * as React from 'react';
import {
    Tabs, Tab, Box, Paper, Typography, Grid, Divider,
    Modal, TextField, Button, IconButton, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Navbar from './navbar';
import Footer from './footer';
import api from '../../axiosConfig';
import Swal from "sweetalert2";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 450 },
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} {...other}>
            {value === index && (
                <Paper elevation={0} sx={{ p: 4, mt: 2, borderRadius: '12px', border: '1px solid #e0e0e0', minHeight: '400px', bgcolor: '#fff' }}>
                    {children}
                </Paper>
            )}
        </div>
    );
}

export default function UserProfile() {
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [orders, setOrders] = React.useState([]); // State lưu danh sách đơn hàng

    const [userData, setUserData] = React.useState({
        username: '',
        email: '',
        password: '',
        idUser:''
    });

    // Lấy thông tin user khi vào trang
    React.useEffect(() => {
        const username = sessionStorage.getItem('username');
        const email = sessionStorage.getItem('userEmail');
        const idUser = sessionStorage.getItem('idUser');

        setUserData(prev => ({
            ...prev,
            username: username || '',
            idUser: idUser || '',
            email: email || "Chưa cập nhật",
        }));
    }, []);

    // Lấy danh sách đơn hàng khi chuyển sang Tab 1
    React.useEffect(() => {
        if (value === 1 && userData.username) {
            fetchUserOrders();
        }
    }, [value, userData.username]);

    const fetchUserOrders = async () => {
        try {
            const response = await api.get(`/users/${userData.idUser}`);
            setOrders(response.data);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChangeTab = (event, newValue) => setValue(newValue);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        console.log("Dữ liệu cập nhật:", userData);
        alert("Cập nhật thông tin thành công!");
        handleClose();
    };
    const renderStatus = (status) => {
        switch (status) {
            case 0:
                return <Chip label="Chờ xác nhận" sx={{ bgcolor: '#f1c40f', color: '#fff', fontWeight: 'bold' }} />;
            case 1:
                return <Chip label="Đang giao hàng" color="primary" sx={{ fontWeight: 'bold' }} />;
            case 2:
                return <Chip label="Giao thành công" color="success" sx={{ fontWeight: 'bold' }} />;
            case 3:
                return <Chip label="Đã hủy" color="error" sx={{ fontWeight: 'bold' }} />;
            default:
                return <Chip label="Không xác định" />;
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

        try {
            await api.put(`/updateStatus/${id}`, null, {
                params: { status: newStatus }
            });

            Swal.fire({ icon: "success", title: "Hủy đơn hàng thành công!" });
            fetchUserOrders();
        } catch (error) {
            alert("Lỗi: " + (error.response?.data || error.message));
        }
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <Navbar />

            <Box sx={{ flex: 1, mx: { xs: '20px', md: '100px' }, my: 3, display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ marginBottom: '20px', color: '#e74c3c' }}>Hồ sơ của bạn</h1>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChangeTab} textColor="primary" indicatorColor="primary">
                        <Tab label="Thông tin cá nhân" id="tab-0" />
                        <Tab label="Đơn hàng" id="tab-1" />
                        {/* <Tab label="Cài đặt" id="tab-2" /> */}
                    </Tabs>
                </Box>

                {/* TAB 0: THÔNG TIN CÁ NHÂN */}
                <CustomTabPanel value={value} index={0}>
                    <Typography variant="h5" sx={{ mb: 3, color: '#2c3e50', fontWeight: 'bold' }}>Thông tin tài khoản</Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Tên đăng nhập</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userData.username}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" color="textSecondary">Email liên hệ</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>{userData.email}</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4 }}>
                        <Button variant="contained" color="error" onClick={handleOpen} sx={{ fontWeight: 'bold', textTransform: 'none' }}>
                            Chỉnh sửa hồ sơ
                        </Button>
                    </Box>
                </CustomTabPanel>

                {/* TAB 1: DANH SÁCH ĐƠN HÀNG (FULL THÔNG TIN) */}
                <CustomTabPanel value={value} index={1}>
                    <Typography variant="h5" sx={{ mb: 3, color: '#2c3e50', fontWeight: 'bold' }}>Lịch sử đơn hàng</Typography>
                    {orders.length === 0 ? (
                        <Typography>Bạn chưa có đơn hàng nào.</Typography>
                    ) : (
                        orders.map((order) => (
                            <Paper key={order.codeOrder} sx={{ p: 3, mb: 3, border: '1px solid #eee', borderRadius: '12px' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                        Mã đơn: #{order.codeOrder}
                                    </Typography>

                                    {/* GỌI HÀM HIỂN THỊ TRẠNG THÁI TẠI ĐÂY */}
                                    {renderStatus(order.status)}
                                </Box>

                                <Grid container spacing={2} sx={{ mb: 2, bgcolor: '#f9f9f9', p: 2, borderRadius: '8px' }}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2"><b>Người nhận:</b> {order.name}</Typography>
                                        <Typography variant="body2"><b>Địa chỉ:</b> {order.shippingAddress}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2"><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString('vi-VN')}</Typography>
                                        <Typography variant="body2"><b>Thanh toán:</b> {order.paymentMethod}</Typography>
                                    </Grid>
                                </Grid>

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#eee' }}>
                                            <TableRow>
                                                <TableCell>Ảnh</TableCell>
                                                <TableCell>Sản phẩm</TableCell>
                                                <TableCell align="center">SL</TableCell>
                                                <TableCell align="right">Giá</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {order.items?.map((item, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>
                                                        <img src={item.images} alt="product" width="50" style={{ borderRadius: '4px' }} />
                                                    </TableCell>
                                                    <TableCell><b>{item.productName}</b></TableCell>
                                                    <TableCell align="center">{item.quantity}</TableCell>
                                                    <TableCell align="right">  {(item.price * item.quantity).toLocaleString('vi-VN')} đ</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box sx={{ textAlign: 'right', mt: 2 }}>
                                    {order.voucherId && (
                                        <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                                            Voucher giảm giá: {order.voucherDiscount}%
                                        </Typography>
                                    )}
                                    <Typography variant="body2">Phí giao hàng: {order.shipMoney?.toLocaleString()} đ</Typography>
                                    <Typography variant="h6" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                                        Tổng: {order.totalPrice?.toLocaleString()} đ
                                    </Typography>
                                </Box>
                                {order.status === 0 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        // Truyền cả mã đơn và trạng thái muốn cập nhật (3 là hủy)
                                        onClick={() => handleUpdateStatus(order.id, 3)}
                                        sx={{ fontWeight: 'bold', textTransform: 'none' }}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                )}
                            </Paper>
                        ))
                    )}
                </CustomTabPanel>

                {/* <CustomTabPanel value={value} index={2}>
                    <h3>Cài đặt hệ thống</h3>
                </CustomTabPanel> */}

                {/* MODAL CHỈNH SỬA */}
                <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Cập nhật thông tin</Typography>
                        <TextField fullWidth label="Tên đăng nhập" name="username" value={userData.username} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Email" name="email" value={userData.email} onChange={handleInputChange} sx={{ mb: 2 }} />
                        <TextField
                            fullWidth label="Mật khẩu mới" name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={userData.password} onChange={handleInputChange}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button onClick={handleClose} variant="outlined">Hủy</Button>
                            <Button onClick={handleUpdate} variant="contained" color="error">Lưu</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
            <Footer />
        </Box>
    );
}