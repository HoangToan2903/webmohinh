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
function Voucher() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);

    };
    const [vouchers, setVoucher] = useState([]);
    // add
    const [successAlertAdd, setSuccessAlertAdd] = useState(false);

    const [newVoucher, setNewVoucher] = useState({
        codeVoucher: '',
        quantity: '',
        reduced_value: '',
        conditions_apply: '',
        start_date: '',
        end_date: '',
        description: ''
    });

    const handleAdd = async () => {
        try {
            if (!newVoucher.codeVoucher.trim()) {
                window.alert("Vui lòng nhập codeVoucher!");
                return;
            }
            if (!newVoucher.quantity.trim()) {
                window.alert("Vui lòng nhập quantity!");
                return;
            }
            if (!newVoucher.reduced_value.trim()) {
                window.alert("Vui lòng nhập reduced value!");
                return;
            } if (!newVoucher.conditions_apply.trim()) {
                window.alert("Vui lòng nhập conditions apply!");
                return;
            }
            if (!newVoucher.start_date.trim()) {
                window.alert("Vui lòng nhập start date!");
                return;
            }
            if (!newVoucher.end_date.trim()) {
                window.alert("Vui lòng nhập end date!");
                return;
            }
             if (!newVoucher.description.trim()) {
                window.alert("Vui lòng nhập description!");
                return;
            }
            // Kiểm tra xem tên đã tồn tại trong danh sách chưa
            const isDuplicate = vouchers.some(voucher => voucher.codeVoucher === newVoucher.codeVoucher.trim());
            if (isDuplicate) {
                window.alert("CodeName này đã tồn tại!");
                return;
            }

            console.log("Tôi là:" + newVoucher.start_date)
            const response = await axios.post('http://localhost:8080/website/voucher', newVoucher);

            setVoucher([response.data, ...vouchers]);
            setNewVoucher({ codeVoucher: '', quantity: '', reduced_value: '', conditions_apply: '', start_date: '', end_date: '', description: '' });
            setSuccessAlertAdd(true);
            setTimeout(() => setSuccessAlertAdd(false), 3000);
            handleClose?.();
        } catch (error) {
            console.error("Lỗi khi thêm loại:", error);
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target; // Lấy name và value từ sự kiện onChange
        setNewVoucher((prev) => ({
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
            const response = await axios.get('http://localhost:8080/website/voucherAll', {
                params: { page, size }
            });

            setVoucher(response.data.content);
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
    const [successAlertUpdate, setSuccessAlertUpdate] = useState(false);

    const [editVoucher, setEditVoucher] = useState({
        codeVoucher: '',
        reduced_value: '',
        conditions_apply: '',
        quantity: '',
        start_date: '',
        end_date: '',
        description: ''
    })
    const handleCloseEdit = () => {
        setOpenEdit(false)
    }
    const handleChangeEdit = (event) => {
        setEditVoucher({
            ...editVoucher,
            [event.target.name]: event.target.value
        });
    };
    const handleClickOpenEdit = (voucher) => {
        setEditVoucher(voucher)
        setOpenEdit(true)
    }
    const handleEditVoucher = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/website/voucher/${editVoucher.id}`, editVoucher);
            setVoucher(prevVoucher =>
                prevVoucher.map(vouchers =>
                    vouchers.id === editVoucher.id ? response.data : vouchers
                )
            );
            handleCloseEdit();
            setSuccessAlertUpdate(true);
            setTimeout(() => setSuccessAlertUpdate(false), 3000);
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
    const [successAlertDelete, setSuccessAlertDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/website/voucher/${id}`);
            await fetchProducers(); // 👈 Gọi lại API để load dữ liệu mới nhất
            handleConfirmClose();
            setSuccessAlertDelete(true);
            setTimeout(() => setSuccessAlertDelete(false), 3000);
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
            fetchVouchersSearch();
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [searchText, page]);

    const fetchVouchersSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8080/website/voucher/search', {
                params: {
                    codeVoucher: searchText,
                    page,
                    size: PAGE_SIZE
                }
            });

            setVoucher(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };
    return (
        <div>
            {/* alert */}
            {successAlertDelete && (
                <Slide direction="left" in={successAlertDelete} mountOnEnter unmountOnExit>
                    <Alert
                        sx={{ width: '50%', float: 'right', mt: 2 }}
                        severity="success"
                    >
                        Delete success
                    </Alert>
                </Slide>
            )}
            {successAlertAdd && (
                <Slide direction="left" in={successAlertAdd} mountOnEnter unmountOnExit>
                    <Alert
                        sx={{ width: '50%', float: 'right', mt: 2 }}
                        severity="success"
                    >
                        Add success
                    </Alert>
                </Slide>
            )}
            {successAlertUpdate && (
                <Slide direction="left" in={successAlertUpdate} mountOnEnter unmountOnExit>
                    <Alert
                        sx={{ width: '50%', float: 'right', mt: 2 }}
                        severity="success"
                    >
                        Update success
                    </Alert>
                </Slide>
            )}
            <h1>Voucher</h1>
            <br></br>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disableElevation onClick={handleOpen}>
                    <AddIcon />  Add voucher new
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
                            name='codeVoucher'
                            label="Code voucher *"
                            multiline
                            fullWidth
                            value={newVoucher.codeVoucher}
                            onChange={handleChange}
                            variant="filled"
                        />
                        <TextField
                            id="filled-number"
                            label="Quantity *"
                            variant="filled"
                            type="number"
                            fullWidth
                            name="quantity"
                            value={newVoucher.quantity ?? ''}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />

                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            name="reduced_value"
                            label="Reduced value *"
                            variant="filled"
                            type="number"
                            fullWidth
                            value={newVoucher.reduced_value ?? ''}
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


                        <TextField
                            name="conditions_apply"
                            label="Conditions apply *"
                            variant="filled"
                            type="number"
                            fullWidth
                            value={newVoucher.conditions_apply ?? ''}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
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
                            name='start_date'
                            label="Start date *"
                            variant="filled"
                            type="date"
                            value={newVoucher.start_date}
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
                            name='end_date'
                            value={newVoucher.end_date}
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
                            value={newVoucher.description}
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
                <DialogTitle>Update Type</DialogTitle>
                <DialogContent>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic" label="Name categories " variant="filled"
                            name="codeVoucher"
                            type="text"
                            fullWidth
                            value={editVoucher.codeVoucher || ''}
                            onChange={handleChangeEdit}
                        />
                        <TextField
                            id="filled-number"
                            label="Quantity *"
                            variant="filled"
                            type="number"
                            fullWidth
                            name="quantity"
                            value={editVoucher.quantity || ''}
                            onChange={handleChangeEdit}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            name="reduced_value"
                            label="Reduced value *"
                            variant="filled"
                            type="number"
                            fullWidth
                            value={editVoucher.reduced_value || ''}
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


                        <TextField
                            name="conditions_apply"
                            label="Conditions apply *"
                            variant="filled"
                            type="number"
                            fullWidth
                            value={editVoucher.conditions_apply || ''}
                            onChange={handleChangeEdit}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">đ</InputAdornment>,
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
                            name='start_date'
                            label="Start date *"
                            variant="filled"
                            type="date"
                            value={editVoucher.start_date}
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
                            name='end_date'
                            value={editVoucher.end_date}
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
                            value={formatDateTimeLocal(editVoucher.created_at)} // định dạng tùy chỉnh
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
                            value={formatDateTimeLocal(editVoucher.update_at)} // định dạng tùy chỉnh
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
                            value={editVoucher.status || ''}
                            onChange={handleChangeEdit}
                            disabled
                        />
                        <TextareaAutosize
                            name="description"
                            // value={newMovie.description}
                            value={editVoucher.description || ''}
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
                            <TableCell>Code Voucher</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vouchers.map((voucher, index) => (
                            <TableRow key={voucher.id}>
                                <TableCell>{page * PAGE_SIZE + index + 1}</TableCell>
                                <TableCell>{voucher.codeVoucher}</TableCell>
                                <TableCell>{voucher.quantity}</TableCell>
                                <TableCell>{voucher.description}</TableCell>
                                <TableCell>{voucher.status}</TableCell>
                                <TableCell>
                                    <Button color="primary" variant="outlined" size="small" onClick={() => handleClickOpenEdit(voucher)}>Edit</Button>
                                    <Button color="error" variant="outlined" size="small" style={{ marginLeft: 8 }} onClick={() => handleConfirmOpen(voucher.id)}>Delete</Button>
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
                <DialogTitle>Confirm DeleteId</DialogTitle>
                <DialogContent>Are you sure you want to delete this ?</DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color='primary'>
                        Cancel
                    </Button>
                    <Button onClick={() => { handleDelete(deleteId); }} color='secondary' variant='contained'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
export default Voucher;