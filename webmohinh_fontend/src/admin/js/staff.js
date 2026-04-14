import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Button, Stack, Pagination, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import api from '../../axiosConfig';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Swal from "sweetalert2";
import {
    TextField, Grid
} from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
};
function Staff() {
    const [staffs, setStaffs] = useState([]);
    const [page, setPage] = useState(0); // Lưu index trang (0-based cho API)
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // Hàm gọi API lấy dữ liệu
    const fetchStaffs = async (pageIndex) => {
        try {
            const response = await api.get(`/staff?page=${pageIndex}&size=${pageSize}`);

            // Dữ liệu trả về từ Page của Spring Boot
            setStaffs(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
        }
    };

    // Gọi lại API mỗi khi trang thay đổi
    useEffect(() => {
        fetchStaffs(page);
    }, [page]);

    // Xử lý khi nhấn vào số trang hoặc mũi tên
    const handlePageChange = (event, value) => {
        // value là trang người dùng thấy (1, 2, 3...)
        // API cần trang bắt đầu từ 0 nên ta trừ đi 1
        setPage(value - 1);
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);

    };
    const [successAlertAdd, setSuccessAlertAdd] = useState(false);
    const [users, setUsers] = useState([]);
    const [newUsers, setNewUsers] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleAdd = async (e) => {
        e.preventDefault(); // Ngăn reload trang

        try {
            // 1. Validation: Kiểm tra các trường trống
            if (!newUsers.username.trim()) {
                window.alert("Vui lòng nhập username!");
                return;
            }

            if (!newUsers.email.trim()) {
                window.alert("Vui lòng nhập email!");
                return;
            }

            // 2. Kiểm tra định dạng email bằng Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newUsers.email.trim())) {
                window.alert("Email không đúng định dạng!");
                return;
            }

            // 3. Kiểm tra Password
            if (!newUsers.password.trim()) {
                window.alert("Vui lòng nhập password!");
                return;
            }
            if (newUsers.password.length < 8) {
                window.alert("Mật khẩu phải có ít nhất 8 ký tự!");
                return;
            }
            if (newUsers.password !== confirmPassword) {
                window.alert("Mật khẩu nhập lại không khớp!");
                return;
            }

            // 4. Kiểm tra trùng lặp username cục bộ (nếu cần)
            const isDuplicate = users.some(user => user.username === newUsers.username.trim());
            if (isDuplicate) {
                window.alert("Username này đã tồn tại!");
                return;
            }

            // --- PHẦN QUAN TRỌNG: GÁN ROLE TỪ FRONTEND ---
            const userPayload = {
                username: newUsers.username.trim(),
                email: newUsers.email.trim(),
                password: newUsers.password,
                role: "STAFF" // Gửi trực tiếp Role sang Backend
            };

            // 5. Gửi API
            const response = await api.post('/users', userPayload);

            // 6. Cập nhật UI sau khi thành công
            setUsers([response.data, ...users]);
            // Reset form về trạng thái ban đầu
            setNewUsers({
                username: '',
                password: '',
                email: '',
                role: ''
            });
            setConfirmPassword(''); // Đừng quên reset cả ô confirm password

            // Thông báo xịn xò với SweetAlert2
            Swal.fire({
                icon: "success",
                title: "Đăng ký tài khoản thành công 🎉",
                // text: `Chào mừng ${response.data.username} đã gia nhập!`,
                confirmButtonColor: "#4CAF50",
            });
            // Reload lại dữ liệu:
            if (page === 0) {
                fetchStaffs(0); // Nếu đang ở trang 0 thì gọi fetch trực tiếp
            } else {
                setPage(0); // Nếu đang ở trang khác, đổi page về 0, useEffect sẽ tự chạy fetchStaffs
            }
            setNewUsers({ username: '', email: '', password: '' });
            handleClose?.();
        } catch (error) {
            console.error("Lỗi khi thêm người dùng:", error);

            // Xử lý thông báo lỗi từ Server (ví dụ: trùng email ở DB)
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
            Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: errorMessage,
            });
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUsers((prev) => ({
            ...prev,
            [name]: value
        }));
    }; const [openEdit, setOpenEdit] = useState(false)

    const [editUser, setEditUser] = useState({
        name: '',
        description: ''
    })
    const handleCloseEdit = () => {
        setOpenEdit(false)
    }
    const handleChangeEdit = (event) => {
        setEditUser({
            ...editUser,
            [event.target.name]: event.target.value
        });
    };
    const handleClickOpenEdit = (customer) => {
        // Gán dữ liệu vào state edit nhưng để pass trống để bảo mật
        setEditUser({ ...customer, password: '' });
        setOpenEdit(true);
    };
    const handleEditProducer = async () => {
        try {
            const response = await api.put(`/customer/${editUser.id}`, editUser);

            // 1. Cập nhật state cục bộ (để table thay đổi ngay lập tức)
            setStaffs(prevStaffs =>
                prevStaffs.map(staff =>
                    staff.id === editUser.id ? response.data : staff
                )
            );

            handleCloseEdit();

            Swal.fire({
                icon: "success",
                title: "Sửa thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });

            // 2. Gọi lại API để đồng bộ dữ liệu chuẩn nhất từ Server (Tùy chọn)
            fetchStaffs(page);

        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể cập nhật thông tin!",
            });
        }
    };

    const handleToggleStatus = async (id, newStatus) => {
        const title = newStatus === 1 ? "Xác nhận tắt hoạt động?" : "Xác nhận bật lại hoạt động?";
        const confirmText = newStatus === 1 ? "Tắt" : "Bật lại";

        const result = await Swal.fire({
            title: title,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus === 1 ? '#d33' : '#2e7d32',
            cancelButtonColor: '#3085d6',
            confirmButtonText: confirmText,
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                // Gửi status qua query param: /customer/id/status?value=1 (hoặc 0)
                await api.patch(`/customer/${id}/status?value=${newStatus}`);

                Swal.fire('Thành công!', `Đã ${confirmText.toLowerCase()} nhân viên`, 'success');

                // Reload table
                fetchStaffs(page);
            } catch (error) {
                Swal.fire('Lỗi', 'Không thể cập nhật trạng thái', 'error');
            }
        }
    };
    return (
        <div style={{ padding: '20px' }}>
            <h1>Danh sách nhân viên</h1>
            <br></br>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disableElevation onClick={handleOpen}>
                    <AddIcon />  Thêm nhân viên
                </Button>
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Thêm mới nhân viên
                    </Typography>

                    <hr style={{ border: '0.5px solid #eee', marginBottom: '20px' }} />

                    <form onSubmit={handleAdd}>
                        <Grid container spacing={2}>
                            {/* Dòng 1: Username và Email */}
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Tên đăng nhập"
                                    name="username"
                                    variant="outlined"
                                    size="small"
                                    value={newUsers.username}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    variant="outlined"
                                    size="small"
                                    value={newUsers.email}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Dòng 2: Mật khẩu và Nhập lại mật khẩu */}
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Mật khẩu"
                                    name="password"
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    value={newUsers.password}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Nhập lại mật khẩu"
                                    type="password"
                                    variant="outlined"
                                    size="small"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 4 }}>
                            <Button onClick={handleClose} variant="outlined" color="inherit" disableElevation>
                                Thoát
                            </Button>
                            <Button onClick={handleAdd} variant="contained" color="primary" disableElevation>
                                Thêm nhân viên
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
            {/*  */}
            <Dialog
                open={openEdit}
                onClose={handleCloseEdit}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Sửa thông tin nhân viên</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Tên đăng nhập"
                            variant="outlined"
                            name="username"
                            fullWidth
                            value={editUser.username || ''}
                            onChange={handleChangeEdit}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            name="email"
                            fullWidth
                            value={editUser.email || ''}
                            onChange={handleChangeEdit}
                        />
                        <TextField
                            label="Mật khẩu mới (Để trống nếu không đổi)"
                            variant="outlined"
                            name="password"
                            type="password" // Sử dụng type password
                            fullWidth
                            value={editUser.password || ''}
                            onChange={handleChangeEdit}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="inherit">Thoát</Button>
                    <Button color="primary" variant="contained" onClick={handleEditProducer}>Cập nhật</Button>
                </DialogActions>
            </Dialog>
            <br></br>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#e0e0e0' }}>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên nhân viên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffs.length > 0 ? (
                            staffs.map((staff, index) => {
                                const isDisabled = staff.status === 1; // Kiểm tra trạng thái

                                return (
                                    <TableRow
                                        key={staff.id}
                                        hover
                                        sx={{
                                            // Nếu bị tắt (status=1) thì làm mờ 0.5 và đổi màu nền xám nhẹ
                                            opacity: isDisabled ? 0.5 : 1,
                                            backgroundColor: isDisabled ? '#fafafa' : 'inherit',
                                            transition: '0.3s'
                                        }}
                                    >
                                        <TableCell>{page * pageSize + index + 1}</TableCell>
                                        <TableCell>
                                            {staff.username} {isDisabled && <strong>(Ngừng hoạt động)</strong>}
                                        </TableCell>
                                        <TableCell>{staff.email}</TableCell>
                                        <TableCell align="center">
                                            {isDisabled ? (
                                                // Nút hiển thị khi đang bị tắt
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleToggleStatus(staff.id, 0)} // Truyền 0 để bật lại
                                                >
                                                    Bật hoạt động
                                                </Button>
                                            ) : (
                                                // Các nút hiển thị khi đang hoạt động bình thường
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleClickOpenEdit(staff)}
                                                        color="primary"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleToggleStatus(staff.id, 1)} // Truyền 1 để tắt
                                                    >
                                                        Tắt hoạt động
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Không có dữ liệu.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Phần Pagination giống hệt ảnh bạn gửi */}
            <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
        </div>
    );
}

export default Staff;