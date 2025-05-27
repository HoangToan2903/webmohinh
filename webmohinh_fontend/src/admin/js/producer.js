
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

            const response = await axios.post('http://localhost:8080/website/producer', newProducer);

            setProducers([response.data, ...producers]);
            setNewProducer({ name: '', description: '' });
            setSuccessAlertAdd(true);
            handleClose?.();
            setTimeout(() => setSuccessAlertAdd(false), 3000);

        } catch (error) {
            console.error("Lỗi khi thêm loại:", error);
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
            const response = await axios.get('http://localhost:8080/website/producerAll', {
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
            await axios.delete(`http://localhost:8080/website/producer/${id}`);
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
            const response = await axios.put(`http://localhost:8080/website/producer/${editProducer.id}`, editProducer);
            setProducers(prevProducer =>
                prevProducer.map(producer =>
                    producer.id === editProducer.id ? response.data : producer
                )
            );
            handleCloseEdit();
            setSuccessAlertUpdate(true);
            setTimeout(() => setSuccessAlertUpdate(false), 3000);
        } catch (error) {
            console.error('Lỗi xảy ra khi cập nhật:', error);
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
            const response = await axios.get('http://localhost:8080/website/producer/search', {
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
            <h1>Producer</h1>
            <br></br>


            <br></br>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disableElevation onClick={handleOpen}>
                    <AddIcon />  Add producer new
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
                        Create Producer
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
                    <Button onClick={handleCloseEdit} color="primary">Cancel</Button>
                    <Button color="primary" variant="contained" onClick={handleEditProducer}>Update</Button>
                </DialogActions>
            </Dialog>

            <br>
            </br>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#b8b8b8' }}>
                            <TableCell>STT</TableCell>
                            <TableCell>Name Producer</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {producers.map((producer, index) => (
                            <TableRow key={producer.id}>
                                <TableCell>{page * PAGE_SIZE + index + 1}</TableCell>
                                <TableCell>{producer.name}</TableCell>
                                <TableCell>{producer.description}</TableCell>
                                <TableCell>
                                    <Button color="primary" variant="outlined" size="small" onClick={() => handleClickOpenEdit(producer)}>Edit</Button>
                                    <Button color="error" variant="outlined" size="small" style={{ marginLeft: 8 }} onClick={() => handleConfirmOpen(producer.id)}>Delete</Button>
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
export default Producer;