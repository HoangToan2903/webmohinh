import { Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
import { Alert, Slide } from '@mui/material';
import Swal from "sweetalert2";


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
const PAGE_SIZE = 8;
function Categories() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setImagePreview("");
    };
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // Lưu file chưa upload
    const [imagePreview, setImagePreview] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // base64 preview
            };
            reader.readAsDataURL(file);
        }
    };

    //GetAll
    const [page, setPage] = useState(0); // page = 0 is first page
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/website/categoriesAll', {
                params: { page, size }
            });

            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, size]);

    //   add
    const [successAlertAdd, setSuccessAlertAdd] = useState(false);

    const handleAdd = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            if (!name.trim()) {
                window.alert("Vui lòng nhập name!");
                return;
            }
            if (!description.trim()) {
                window.alert("Vui lòng nhập description!");
                return;
            }
            const res = await axios.post('http://localhost:8080/website/categories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Saved:', res.data);

            // Reset + close
            setName('');
            setDescription('');
            setSelectedImage(null);
            setImagePreview('');
            handleClose();
            Swal.fire({
                icon: "success",
                title: "Thêm thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
            await fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };
    // delete
    const [successAlertDelete, setSuccessAlertDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/website/categories/${id}`);
            await fetchCategories(); // 👈 Gọi lại API để load dữ liệu mới nhất
            handleConfirmClose();
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

    // // Update
    const [openEdit, setOpenEdit] = useState(false)
    const [successAlertUpdate, setSuccessAlertUpdate] = useState(false);

    const [editCategories, setEditCategories] = useState({
        name: '',
        description: ''
    })
    const handleCloseEdit = () => {
        setOpenEdit(false)
    }
    const handleChangeEdit = (event) => {
        setEditCategories({
            ...editCategories,
            [event.target.name]: event.target.value
        });
    };
    const handleClickOpenEdit = (categorie) => {
        setEditCategories(categorie);

        if (categorie.image) {
            const imageUrl = `data:image/jpeg;base64,${categorie.imageBase64}`; // hoặc png nếu bạn dùng png
            setImagePreview(imageUrl);
        } else {
            setImagePreview('');
        }

        setOpenEdit(true);
    };

    const handleEditCategories = async () => {
        try {
            const formData = new FormData();
            formData.append("name", editCategories.name);
            formData.append("description", editCategories.description);

            // Kiểm tra nếu là file mới thì thêm image
            if (editCategories.image instanceof File) {
                formData.append("image", editCategories.image);
            }

            const response = await axios.put(
                `http://localhost:8080/website/categories/${editCategories.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setCategories(prevCategories =>
                prevCategories.map(categorie =>
                    categorie.id === editCategories.id ? response.data : categorie
                )
            );
            await fetchCategories();
            handleCloseEdit();
            Swal.fire({
                icon: "success",
                title: "Sửa thành công 🎉",
                confirmButtonColor: "#4CAF50",
            });
        } catch (error) {
            console.error("Lỗi xảy ra khi cập nhật:", error);
        }
    };



    // // search
    const [searchText, setSearchText] = useState('');
    // // Gọi API khi searchText hoặc page thay đổi
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchText.trim() === '') {
                fetchCategories(); // Hiển thị toàn bộ nếu không nhập gì
            } else {
                fetchCategoriessSearch(); // Tìm kiếm nếu có nội dung
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchText, page]);




    const fetchCategoriessSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8080/website/categories/search', {
                params: {
                    name: searchText,
                    page,
                    size: PAGE_SIZE
                }
            });

            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    };
    return (
        <div>
          
            <h1>Categories</h1>
            <br></br>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disableElevation onClick={handleOpen}>
                    <AddIcon />  Add categories new
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
                        Create Categories
                    </Typography>
                    <hr />
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            id="filled-basic"
                            label="Name categories *"
                            variant="filled"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <TextareaAutosize
                            name="description"
                            aria-label="empty textarea"
                            placeholder="Description ..."
                            minRows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                    Image <span className="font-css top">*</span>
                    <div>
                        <input type="file" name="image" id="file-input" onChange={handleImageChange} />
                    </div>
                    <br />
                    {imagePreview && (
                        <div className="mt-2">
                            <img style={{ width: '100px' }} src={imagePreview} alt="Selected" />
                            <Button onClick={() => {
                                setImagePreview("");
                                setSelectedImage(null);
                            }} color="error" size="small" variant="text">
                                Delete image
                            </Button>
                        </div>
                    )}
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Button variant="contained" disableElevation onClick={handleAdd}>
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
                        value={editCategories.name || ''}
                        onChange={handleChangeEdit}
                    />
                    <br></br>
                    <TextareaAutosize
                        name="description"
                        // value={newMovie.description}
                        value={editCategories.description || ''}
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
                    Image <span className="font-css top">*</span>
                    <div>
                        <input
                            type="file"
                            onChange={(e) =>
                                setEditCategories({ ...editCategories, image: e.target.files[0] })
                            }
                        />
                    </div>
                    <br />
                    {(imagePreview || editCategories.imageBase64) && (
                        <div className="mt-2">
                            <img
                                src={imagePreview || `data:image/jpeg;base64,${editCategories.imageBase64}`}
                                alt="Selected"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <Button onClick={() => {
                                setImagePreview('');
                                setSelectedImage(null);
                                // Optional: clear imageBase64 from editCategories if needed
                            }} color="error" size="small" variant="text">
                                Delete image
                            </Button>
                        </div>
                    )}


                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseEdit} color="primary">Cancel</Button>
                    <Button color="primary" variant="contained" onClick={handleEditCategories}>Update</Button>
                </DialogActions>
            </Dialog>

            <br></br>
            <div className="grid-card">
                {categories.map((categorie, index) => (
                    <Card key={categorie.id} sx={{ minWidth: 275 }}>

                        <CardContent>
                            {categorie.imageBase64 ? (
                                <img
                                    style={{ height: '300px', objectFit: "cover" }}
                                    src={`data:image/jpeg;base64,${categorie.imageBase64}`}
                                    alt="Icon"
                                />
                            ) : (
                                <div style={{ height: '300px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    No image
                                </div>
                            )}

                            <br></br>
                            <Typography variant="body2">
                                <b style={{ fontSize: '20px' }}>{categorie.name}</b>

                                <br />
                                Description: {categorie.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => handleConfirmOpen(categorie.id)} color="error">Delete</Button>
                            <Button color="primary" variant="outlined" size="small" onClick={() => handleClickOpenEdit(categorie)}>Edit</Button>

                        </CardActions>
                    </Card>
                ))}
            </div>
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
export default Categories;