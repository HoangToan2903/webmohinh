
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
import axios from 'axios';
import { Alert, Slide } from '@mui/material';
import Swal from "sweetalert2";
import api from '../../axiosConfig';

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
const PAGE_SIZE = 10;
function Producer() {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);

    };
    // add
    const [successAlertAdd, setSuccessAlertAdd] = useState(false);
    const [producers, setProducers] = useState([]);
    const [newProducer, setNewProducer] = useState({
        name: '',
        description: ''
    })
    const handleAdd = async () => {
        try {
            if (!newProducer.name.trim()) {
                window.alert("Vui lòng nhập name!");
                return;
            }
            // Kiểm tra xem tên đã tồn tại trong danh sách chưa
            const isDuplicate = producers.some(producer => producer.name === newProducer.name.trim());
            if (isDuplicate) {
                window.alert("Name này đã tồn tại!");
                return;
            }

            const response = await api.post('/producer', newProducer,

            );

            setProducers([response.data, ...producers]);
            setNewProducer({ name: '', description: '' });
            Swal.fire({
                icon: "success",
                title: "Thêm thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
            handleClose?.();
        } catch (error) {
            console.log("Thao tác bị từ chối do quyền hạn.");
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target; // Lấy name và value từ sự kiện onChange
        setNewProducer((prev) => ({
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
            const response = await api.get('/producerAll', {
                params: { page, size }
            });

            setProducers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducers();
    }, [page, size]);

    // delete
    const [successAlertDelete, setSuccessAlertDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const handleDelete = async (id) => {
        try {
            await api.delete(`/producer/${id}`);
            await fetchProducers(); // 👈 Gọi lại API để load dữ liệu mới nhất
            handleConfirmClose();
            Swal.fire({
                icon: "success",
                title: "Xóa thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
        } catch (error) {
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

    // Update
    const [openEdit, setOpenEdit] = useState(false)
    const [successAlertUpdate, setSuccessAlertUpdate] = useState(false);

    const [editProducer, setEditProducer] = useState({
        name: '',
        description: ''
    })
    const handleCloseEdit = () => {
        setOpenEdit(false)
    }
    const handleChangeEdit = (event) => {
        setEditProducer({
            ...editProducer,
            [event.target.name]: event.target.value
        });
    };
    const handleClickOpenEdit = (producer) => {
        setEditProducer(producer)
        setOpenEdit(true)
    }
    const handleEditProducer = async () => {
        try {
            const response = await api.put(`/producer/${editProducer.id}`, editProducer);
            setProducers(prevProducer =>
                prevProducer.map(producer =>
                    producer.id === editProducer.id ? response.data : producer
                )
            );
            handleCloseEdit();
            Swal.fire({
                icon: "success",
                title: "Sửa thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
        } catch (error) {
           
        }
    };

    // search
    const [searchText, setSearchText] = useState('');
    // Gọi API khi searchText hoặc page thay đổi
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducersSearch();
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [searchText, page]);

    const fetchProducersSearch = async () => {
        try {
            const response = await api.get('/producer/search', {
                params: {
                    name: searchText,
                    page,
                    size: PAGE_SIZE
                }
            });

            setProducers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };
    return (
        <div>
            {/* alert */}

            <h1>Nhà sản xuất</h1>
            <br></br>


            <br></br>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disableElevation onClick={handleOpen}>
                    <AddIcon />  Thêm
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
            {/* modal add */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Thêm
                    </Typography>
                    <hr />
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            id="filled-basic"
                            name='name'
                            label="Name categories *"
                            multiline
                            fullWidth
                            value={newProducer.name}
                            onChange={handleChange}
                            variant="filled"
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextareaAutosize
                            name='description'
                            aria-label="empty textarea"
                            placeholder="Description ..."
                            minRows={3}
                            value={newProducer.description}
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
                    <br>
                    </br>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={handleAdd} variant="contained" disableElevation>
                            Thêm
                        </Button>
                        <Button disableElevation onClick={handleClose}>
                            Thoát
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
                <DialogTitle>Sửa thông tin</DialogTitle>
                <DialogContent>

                    <TextField
                        id="filled-basic" label="Name categories " variant="filled"
                        name="name"
                        type="text"
                        fullWidth
                        value={editProducer.name || ''}
                        onChange={handleChangeEdit}
                    />
                    <br></br>
                    <TextareaAutosize
                        name="description"
                        // value={newMovie.description}
                        value={editProducer.description || ''}
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

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseEdit} color="primary">Thoát</Button>
                    <Button color="primary" variant="contained" onClick={handleEditProducer}>Sửa </Button>
                </DialogActions>
            </Dialog>

            <br>
            </br>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#b8b8b8' }}>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên nhà sản xuất</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {producers.map((producer, index) => (
                            <TableRow key={producer.id}>
                                <TableCell>{page * PAGE_SIZE + index + 1}</TableCell>
                                <TableCell>{producer.name}</TableCell>
                                <TableCell>{producer.description}</TableCell>
                                <TableCell>
                                    <Button color="primary" variant="outlined" size="small" onClick={() => handleClickOpenEdit(producer)}>Sửa</Button>
                                    <Button color="error" variant="outlined" size="small" style={{ marginLeft: 8 }} onClick={() => handleConfirmOpen(producer.id)}>Xóa</Button>
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
                <DialogContent>Bạn chắc muốn xóa không?</DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color='primary'>
                        Hủy
                    </Button>
                    <Button
                        onClick={() => {
                            handleDelete(deleteId); // Thực hiện xóa
                            handleConfirmClose();   // Đóng Dialog
                        }}
                        color="error"
                        variant='contained'
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
export default Producer;