import { Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { Alert, Slide } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
};
const PAGE_SIZE = 10;
function Sale() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);

    };
    const [sales, setSale] = useState([]);
    const navigate = useNavigate();
    // add
    // const [successAlertAdd, setSuccessAlertAdd] = useState(false);

    const [newSale, setNewSale] = useState({
        name: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const handleAdd = async () => {
        try {
            if (!newSale.name.trim()) {
                window.alert("Vui lòng nhập Name!");
                return;
            }
            if (!newSale.discountPercent.trim()) {
                window.alert("Vui lòng nhập reduced discountPercent!");
                return;
            }
            if (!newSale.startDate.trim()) {
                window.alert("Vui lòng nhập start date!");
                return;
            }
            if (!newSale.endDate.trim()) {
                window.alert("Vui lòng nhập end date!");
                return;
            }
            if (!newSale.description.trim()) {
                window.alert("Vui lòng nhập description!");
                return;
            }
            // Kiểm tra xem tên đã tồn tại trong danh sách chưa
            const isDuplicate = sales.some(sale => sale.name === newSale.name.trim());
            if (isDuplicate) {
                window.alert("Name này đã tồn tại!");
                return;
            }

            // console.log("Tôi là:" + newVoucher.start_date)
            const response = await axios.post('http://localhost:8080/website/sale', newSale);

            setSale([response.data, ...sales]);
            setNewSale({ name: '', discountPercent: '', startDate: '', endDate: '', description: '' });
            // setSuccessAlertAdd(true);
            Swal.fire({
                icon: "success",
                title: "Thêm thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
            handleClose?.();
        } catch (error) {

            console.error("Lỗi khi thêm loại:", error);
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target; // Lấy name và value từ sự kiện onChange
        setNewSale((prev) => ({
            ...prev,
            [name]: value, // Cập nhật giá trị của thuộc tính tương ứng
        }));
    };

    //GetAll
    const [page, setPage] = useState(0); // page = 0 is first page
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchProducers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/website/saleAll', {
                params: { page, size }
            });

            setSale(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducers();
    }, [page, size]);

    // Update
    const [openEdit, setOpenEdit] = useState(false)
    const [editSale, setEditSale] = useState({
        name: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        description: ''
    })
    const handleCloseEdit = () => {
        setOpenEdit(false)
    }
    const handleChangeEdit = (event) => {
        setEditSale({
            ...editSale,
            [event.target.name]: event.target.value
        });
    };
    const handleClickOpenEdit = (sale) => {
        setEditSale(sale)
        setOpenEdit(true)
    }
    const handleEditVoucher = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/website/sale/${editSale.id}`, editSale);
            setSale(prevSale =>
                prevSale.map(sales =>
                    sales.id === editSale.id ? response.data : sales
                )
            );
            handleCloseEdit();
            Swal.fire({
                icon: "success",
                title: "Sửa thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
            await fetchProducers();
        } catch (error) {
            console.error('Lỗi xảy ra khi cập nhật:', error);
        }
    };
    // Helper: format về "yyyy-MM-ddTHH:mm"
    const formatDateTimeLocal = (value) => {
        if (!value) return "";
        const date = new Date(value);

        const pad = (num, size = 2) => num.toString().padStart(size, "0");
        const padMicroseconds = (ms) => (ms * 1000).toString().padStart(6, "0");

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());


        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // delete

    const [deleteId, setDeleteId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/website/sale/${id}`);
            await fetchProducers(); // 👈 Gọi lại API để load dữ liệu mới nhất
            handleConfirmClose();
            handleCloseEdit();
            Swal.fire({
                icon: "success",
                title: "Xóa thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
        } catch (error) {
            alert('There was an error deleting the producer');
        }
    };
    const handleConfirmClose = (id) => {
        setDeleteId(null)
        setConfirmOpen(false)
    }
    const handleConfirmOpen = (id) => {
        setDeleteId(id)
        setConfirmOpen(true)
    }

    // search
    const [searchText, setSearchText] = useState('');
    // Gọi API khi searchText hoặc page thay đổi
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchSalesSearch();
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [searchText, page]);

    const fetchSalesSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8080/website/sale/search', {
                params: {
                    name: searchText,
                    page,
                    size: PAGE_SIZE
                }
            });

            setSale(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };

    // Hàm cập nhật trạng thái sale
    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/website/sale/${id}/status`, {
                status: newStatus
            });

            console.log("taolaf" + newStatus)
            setSale(prevSales =>
                prevSales.map(sale =>
                    sale.id === id ? { ...sale, status: newStatus } : sale
                )
            );
        } catch (error) {
            console.error('Error updating status', error);
        }
    }
    //
    const { tab } = useParams(); // Lấy tab từ URL
    // const navigate = useNavigate();
    const handleTabChange = (newTab, saleId) => {
        console.log('Navigating to:', newTab, 'with saleId:', saleId);
        navigate(`/admin/${newTab}`, {
            state: { saleId: saleId }
        });
    };

    const isWithinDateRange = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return now >= start && now <= end;
    };
    return (
        <div>

            <h1>Sale</h1>
            <br></br>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disableElevation onClick={handleOpen}>
                    <AddIcon />  Add Sale new
                </Button>
            </Box>
            {/* Search */}
            <div className="search-bar" style={{ marginBottom: 16 }}>
                <i className="fas fa-search" style={{ marginRight: 8 }}></i>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setPage(0); // reset page khi search
                    }}
                    style={{ padding: 8, width: 250 }}
                />
            </div>
            {/* add */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Voucher
                    </Typography>
                    <hr />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic"
                            name='name'
                            label="Name *"
                            multiline
                            fullWidth
                            value={newSale.name}
                            onChange={handleChange}
                            variant="filled"
                        />
                        <TextField
                            id="filled-number"
                            label="Discount Percent *"
                            variant="filled"
                            type="number"
                            fullWidth
                            name="discountPercent"
                            value={newSale.discountPercent ?? ''}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                inputProps: { min: 0 },
                            }}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />

                    </Box>


                    {/* 2 box trên 1 dòng */}
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>

                        <TextField
                            name='startDate'
                            label="Start date *"
                            variant="filled"
                            type="date"
                            value={newSale.startDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true, // để label không che lên input
                            }}
                        />
                        <TextField
                            label="End date *"
                            variant="filled"
                            type="date"
                            name='endDate'
                            value={newSale.endDate}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true, // để label không che lên input
                            }}
                        />

                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>

                        <TextareaAutosize
                            name="description"
                            aria-label="empty textarea"
                            placeholder="Description ..."
                            minRows={3}
                            value={newSale.description}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                outline: "none",
                                resize: "vertical",
                                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            }}
                        />
                    </Box>
                    <br />
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={handleAdd} variant="contained" disableElevation>
                            Add
                        </Button>
                        <Button disableElevation onClick={handleClose}>
                            Close
                        </Button>
                    </Box>
                </Box>

            </Modal>
            {/*modal edit */}
            <Dialog
                open={openEdit}
                onClose={handleCloseEdit}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Update Sale</DialogTitle>
                <DialogContent>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic"
                            label="Name codeVoucher"
                            variant="filled"
                            name="name"
                            type="text"
                            fullWidth
                            value={editSale.name || ''}
                            onChange={handleChangeEdit}
                        />

                        <TextField
                            id="filled-number"
                            label="Discount Percent *"
                            variant="filled"
                            type="number"
                            fullWidth
                            name="discountPercent"
                            value={editSale.discountPercent || ''}
                            onChange={handleChangeEdit}

                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                inputProps: { min: 0 },
                            }}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            name='startDate'
                            label="Start date *"
                            variant="filled"
                            type="date"
                            value={editSale.startDate}
                            onChange={handleChangeEdit}
                            fullWidth
                            InputLabelProps={{
                                shrink: true, // để label không che lên input
                            }}
                        />
                        <TextField
                            label="End date *"
                            variant="filled"
                            type="date"
                            name='endDate'
                            value={editSale.endDate}
                            onChange={handleChangeEdit}
                            fullWidth
                            InputLabelProps={{
                                shrink: true, // để label không che lên input
                            }}
                        />

                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>

                        <TextField
                            name="created_at"
                            label="Created at"
                            variant="filled"
                            type="text"
                            value={formatDateTimeLocal(editSale.createdAt)} // định dạng tùy chỉnh
                            onChange={handleChangeEdit}
                            fullWidth
                            disabled
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />


                        <TextField
                            name="update_at"
                            label="Update at"
                            variant="filled"
                            type="text"
                            value={formatDateTimeLocal(editSale.updatedAt)} // định dạng tùy chỉnh
                            onChange={handleChangeEdit}
                            fullWidth
                            disabled
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />


                    </Box>
                    <br></br>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic" label="Status " variant="filled"
                            name="status"
                            type="text"
                            fullWidth
                            value={editSale.status || ''}
                            onChange={handleChangeEdit}
                            disabled
                        />
                        <TextareaAutosize
                            name="description"
                            // value={newMovie.description}
                            value={editSale.description || ''}
                            onChange={handleChangeEdit}
                            aria-label="empty textarea"
                            placeholder="Description ..."
                            minRows={3}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                marginTop: "15px",
                                outline: "none",
                                resize: "vertical",
                                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            }}
                        />

                    </Box>


                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseEdit} color="primary">Cancel</Button>
                    <Button color="primary" variant="contained" onClick={handleEditVoucher}>Update</Button>
                </DialogActions>
            </Dialog>
            <br>
            </br>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#b8b8b8' }}>
                            <TableCell>STT</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Discount Percent</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sales.map((sale, index) => (
                            <TableRow key={sale.id}>
                                <TableCell>{page * PAGE_SIZE + index + 1}</TableCell>
                                <TableCell>{sale.name}</TableCell>
                                <TableCell>{sale.discountPercent} %</TableCell>
                                <TableCell>{sale.description}</TableCell>

                                <TableCell>
                                    {(() => {
                                        const now = new Date();
                                        const start = new Date(sale.startDate);
                                        const end = new Date(sale.endDate);
                                        end.setHours(23, 59, 59, 999); // cho phép endDate tính đến hết ngày

                                        return now < start
                                            ? "Chưa hoạt động"
                                            : now <= end
                                                ? "Đang hoạt động"
                                                : "Ngừng hoạt động";
                                    })()}
                                </TableCell>

                                <TableCell
                                    style={{
                                        color: sale.status ? "green" : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {sale.status ? "Đang sử dụng" : "Không sử dụng"}
                                </TableCell>
                                <TableCell>
                                    <Button color="primary" variant="outlined" size="small" style={{ marginLeft: 8 }} onClick={() => handleClickOpenEdit(sale)}>Edit</Button>
                                    <Button color="error" variant="outlined" size="small" style={{ marginLeft: 8 }} onClick={() => handleConfirmOpen(sale.id)}>Delete</Button>
                                    {sale.status == 1 && (
                                        <>
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                                style={{ marginLeft: 8 }}
                                                className={tab === 'add_sale_Products' ? 'active' : ''}
                                                onClick={() => handleTabChange('add_sale_Products', sale.id)}
                                            >
                                                Detail
                                            </Button>
                                            {/* <Button color="primary" variant="outlined" size="small" style={{ marginLeft: 8 }}>Turn on</Button> */}
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => updateStatus(sale.id, 0)}
                                            >
                                                Turn off
                                            </Button>

                                        </>
                                    )}
                                    {sale.status === 0 && isWithinDateRange(sale.startDate, sale.endDate) && (
                                        <>
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                size="small"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => updateStatus(sale.id, 1)}
                                            >
                                                Turn on
                                            </Button>
                                        </>
                                    )}


                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination Controls */}
            <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
                <span style={{ margin: '0 12px' }}>Trang {page + 1} / {totalPages}</span>
                <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Tiếp</Button>
            </div>
            {/* Xoa */}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc muốn xóa không?</DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color='primary'>
                        Đóng
                    </Button>
                    <Button onClick={() => { handleDelete(deleteId); }} color='secondary' variant='contained'>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
export default Sale;