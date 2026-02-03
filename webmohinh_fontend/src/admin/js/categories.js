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
import Swal from "sweetalert2";
import imageCompression from 'browser-image-compression';

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
// const API_BASE_URL = 'http://localhost:8080/website';
// Cấu hình Cloudinary của bạn
const CLOUD_NAME = "djw87hphx"; // Thay bằng Cloud Name của bạn
const UPLOAD_PRESET = "web_mohinh_preset";
function Categories() {
    // State chung
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchText, setSearchText] = useState('');

    // State cho Modal Thêm mới
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // State cho Modal Sửa
    const [openEdit, setOpenEdit] = useState(false);
    const [editCategories, setEditCategories] = useState({ id: null, name: '', description: '', image: null });

    // State cho Confirm Xóa
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // --- EFFECT ---
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchCategories();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [page, searchText]);

    // --- API CALLS ---
    const fetchCategories = async () => {
        try {
            const url = searchText.trim() ? `http://localhost:8080/website/category/search` : `http://localhost:8080/website/categoryAll`;
            const response = await axios.get(url, {
                params: {
                    name: searchText,
                    page,
                    size: PAGE_SIZE
                }
            });
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi fetch data:", error);
        }
    };

    const handleImageChange = (e, isEdit = false) => {
        const file = e.target.files[0];
        if (file) {
            if (isEdit) {
                setEditCategories({ ...editCategories, image: file });
            } else {
                setSelectedImage(file);
            }
            // Tạo preview cục bộ
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Hàm bổ trợ để Upload ảnh lên Cloudinary
    const uploadToCloudinary = async (file) => {
        // Giảm xuống 0.2MB và 800px để upload cực nhanh mà vẫn đủ nét
        const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
        );
        return response.data.secure_url;
    };
    const handleAdd = async () => {
        if (!name.trim() || !selectedImage) {
            Swal.fire("Lỗi", "Vui lòng nhập tên và chọn ảnh!", "error");
            return;
        }

        // 1. Tạo ảnh Preview tạm thời (Blob URL)
        const localImageUrl = URL.createObjectURL(selectedImage);
        const tempId = Date.now();

        const optimisticCategory = {
            id: tempId,
            name: name,
            description: description,
            image: localImageUrl,
            isUploading: true    // Bạn có thể dùng cờ này để hiển thị icon xoay nhẹ trên card
        };

        // Cập nhật giao diện ngay lập tức
        setCategories(prev => [optimisticCategory, ...prev]);
        resetAddForm();

        // Toast thông báo chạy ngầm
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
        toast.fire({ icon: 'info', title: 'Đang tải lên hệ thống...' });

        try {
            // 2. Upload ảnh lên Cloudinary
            const imageUrl = await uploadToCloudinary(selectedImage);

            // 3. Gửi JSON về Backend
            const response = await axios.post('http://localhost:8080/website/category', {
                name: name,
                description: description,
                image: imageUrl
            });

            // 4. Thay thế dữ liệu ảo bằng dữ liệu thật từ Server
            setCategories(prev =>
                prev.map(cat => cat.id === tempId ? response.data : cat)
            );

            // Giải phóng bộ nhớ cho URL tạm
            URL.revokeObjectURL(localImageUrl);

            Swal.fire({
                           icon: "success",
                           title: "Thêm thành công 🎉",
                           confirmButtonColor: "#4CAF50",
                       });

        } catch (error) {
            // Nếu lỗi, xóa danh mục ảo và mở lại Form hoặc báo lỗi
            setCategories(prev => prev.filter(cat => cat.id !== tempId));
            URL.revokeObjectURL(localImageUrl); // Giải phóng bộ nhớ
            Swal.fire("Lỗi", "Quá trình lưu thất bại, hãy kiểm tra lại kết nối!", "error");
        }
    };

    // --- UPDATE ---
    const handleClickOpenEdit = (category) => {
        setEditCategories(category); // category.image lúc này là URL từ Cloudinary
        setImagePreview(category.image);
        setOpenEdit(true);
    };

    const handleEditCategories = async () => {
        Swal.fire({ title: 'Đang cập nhật...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        try {
            let finalImageUrl = editCategories.image;

            // Nếu người dùng có chọn ảnh mới (image là đối tượng File)
            if (editCategories.image instanceof File) {
                finalImageUrl = await uploadToCloudinary(editCategories.image);
            }

            await axios.put(`http://localhost:8080/website/category/${editCategories.id}`, {
                name: editCategories.name,
                description: editCategories.description,
                image: finalImageUrl
            });

            Swal.fire("Thành công", "Cập nhật hoàn tất!", "success");
            setOpenEdit(false);
            fetchCategories();
        } catch (error) {
            Swal.fire("Lỗi", "Cập nhật thất bại!", "error");
        }
    };

    // --- DELETE ---
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/website/category/${id}`);
            setConfirmOpen(false);
            Swal.fire("Xóa thành công", "", "success");
            fetchCategories();
        } catch (error) {
            Swal.fire("Lỗi", "Không thể xóa", "error");
        }
    };

    // --- HELPERS ---
    const resetAddForm = () => {
        setName('');
        setDescription('');
        setSelectedImage(null);
        setImagePreview('');
        setOpen(false);
    };

    return (
        <div >
            <h1>Categories</h1>

            <Box display="flex" justifyContent="space-between" mb={2}>
                <TextField
                    placeholder="Search name..."
                    size="small"
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setPage(0); }}
                />
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Add New Category
                </Button>
            </Box>

            {/* Modal Add */}
            <Modal open={open} onClose={resetAddForm}>
                <Box sx={style}>
                    <Typography variant="h6">Create New Category</Typography>
                    <TextField fullWidth label="Name" sx={{ mt: 2 }} value={name} onChange={e => setName(e.target.value)} />
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
                            marginTop: "16px", // Giữ lại margin để khoảng cách đẹp hơn
                        }}
                    />
                    <Box mt={2}>
                        <input type="file" onChange={(e) => handleImageChange(e, false)} />
                        {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100px', display: 'block', marginTop: '10px' }} />}
                    </Box>
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                        <Button onClick={resetAddForm}>Cancel</Button>
                        <Button variant="contained" onClick={handleAdd}>Add</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal Edit */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Update Category</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth label="Name" sx={{ mt: 2 }}
                        value={editCategories.name}
                        onChange={e => setEditCategories({ ...editCategories, name: e.target.value })}
                    />
                    <TextareaAutosize
                        minRows={3}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            outline: "none",
                            resize: "vertical",
                            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            marginTop: "16px", // Giữ lại margin để khoảng cách đẹp hơn
                        }}
                        value={editCategories.description}
                        onChange={e => setEditCategories({ ...editCategories, description: e.target.value })}
                    />
                    <Box mt={2}>
                        <input type="file" onChange={(e) => handleImageChange(e, true)} />
                        {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100px', display: 'block', marginTop: '10px' }} />}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditCategories}>Update</Button>
                </DialogActions>
            </Dialog>

            {/* Grid Display */}
            <Box className="grid-card" sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {categories.map((cat) => (
                    <Card key={cat.id}>
                        <CardContent>
                            <img
                                src={cat.image || 'https://via.placeholder.com/300'}
                                alt={cat.name}
                                style={{ width: '100%', height: '350px', objectFit: 'cover' }}
                            />
                            <br></br>
                            <Typography variant="body2">
                                <b style={{ fontSize: '25px' }}>{cat.name}</b>

                                <br />
                                Mô tả: {cat.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => handleClickOpenEdit(cat)}>Edit</Button>
                            <Button size="small" color="error" onClick={() => { setDeleteId(cat.id); setConfirmOpen(true); }}>Delete</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4} alignItems="center" gap={2}>
                <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</Button>
                <Typography>Trang {page + 1} / {totalPages}</Typography>
                <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </Box>

            {/* Confirm Delete */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc muốn xóa không?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(deleteId)}>Xóa</Button>
                </DialogActions>
            </Dialog>
            {/* <Dialog open={confirmOpen} onClose={handleConfirmClose}>
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
            </Dialog> */}
        </div>
    );
}

export default Categories;