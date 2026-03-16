import { Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
import { Alert, Slide } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import ImageUploading from 'react-images-uploading';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Swal from "sweetalert2";
import { Avatar } from '@mui/material';
import { Pagination, Stack } from '@mui/material';
import api from '../../axiosConfig';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1300,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
};
const PAGE_SIZE = 10;

function Products() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setImages([]);
        setDefaultImageIndex(null);
        setOpen(true);
    };

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [character_name, setCharacter_name] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategories] = useState('');
    const [product_code, setProduct_code] = useState('');
    const [status, setStatus] = useState('');
    const [material, setMaterial] = useState('');
    // const [tag, setTag] = useState('');
    const [producer, setProducer] = useState('');
    const [description, setDescription] = useState('');
    const [categoryValue, setCategoryValue] = useState(null);
    const [categoryInputValue, setCategoryInputValue] = useState('');
    const [producerValue, setProducerValue] = useState(null);
    const [producerInputValue, setProducerInputValue] = useState('');
    const [tags, setTags] = React.useState([]);
    // tag
    //GetAll
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10); // Đảm bảo dùng biến này xuyên suốt
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const response = await api.get('/productsAll', {
                params: { page, size }
            });
            console.log("Dữ liệu nhận về:", response.data.content); // Kiểm tra xem array này có mấy phần tử
            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [page, size]);

    // Hàm xử lý khi đổi trang
    const handlePageChange = (event, value) => {
        setPage(value - 1); // Material UI Pagination dùng base-1, Spring Boot dùng base-0
    };

    const handleClose = () => {
        // Reset form fields
        setName('');
        setCharacter_name('');
        setProduct_code('');
        setTags('');
        setPrice('');
        setQuantity('');
        setWidth('');
        setHeight('');
        setWeight('');
        setType('');
        setMaterial('');
        setDescription('');
        setValue(null);
        setInputValue('');
        setNewProducts({ status: '' });
        setImages([]);
        setDefaultImageIndex(null);

        // Đóng modal
        setOpen(false);
    };
    // image
    const [images, setImages] = useState([]);
    const [defaultImageIndex, setDefaultImageIndex] = useState(null);
    const maxNumber = 10;

    const onChange = (imageList) => {
        setImages(imageList);
        if (defaultImageIndex === null && imageList.length > 0) {
            setDefaultImageIndex(0);
        }
    };

    const setAsDefault = (index) => {
        setDefaultImageIndex(index);
    };

    const editImage = (index) => {
        console.log(`🛠️ Edit image at index ${index}`);
        // Có thể mở modal chỉnh sửa hoặc crop ảnh ở đây
    };

    const beforeRemove = (index) => {
        if (window.confirm('Bạn có chắc muốn xoá ảnh này không?')) {
            const newList = images.filter((_, i) => i !== index);
            setImages(newList);
            if (defaultImageIndex === index) setDefaultImageIndex(null);
        }
    };
    //get all categorie
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categoryAll', {
            });

            setCategories(response.data.content);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    //get all producer

    const fetchProducers = async () => {
        try {
            const response = await api.get('/producerAll', {
            });

            setProducer(response.data.content);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchProducers();
    }, []);
    // add

    const [newProducts, setNewProducts] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleAdd = async () => {
        // 1. Kiểm tra điều kiện bắt buộc
        if (!name || !description || !price || !quantity || !categoryValue || !producerValue) {
           alert("Vui lòng điền đầy đủ thông tin sản phẩm.")
            return;
        }

        // Ngăn chặn bấm nút liên tục gây lỗi
        if (isSubmitting) return;

        try {
            setIsSubmitting(true); // Bắt đầu trạng thái chờ

            const cloudName = "djw87hphx";
            const uploadPreset = "my_preset_123";

            // 2. Upload ảnh (Chỉ upload những file mới chọn, giữ nguyên những file đã có URL)
            const uploadPromises = images.map(async (img) => {
                if (img.data_url.startsWith('http')) return img.data_url;

                const formData = new FormData();
                formData.append("file", img.file);
                formData.append("upload_preset", uploadPreset);

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );
                return response.data.secure_url;
            });

            const imageUrls = await Promise.all(uploadPromises);

            // 3. Tạo DTO chuẩn (Ép kiểu số để tránh lỗi 400 Bad Request)
            const productDto = {
                name: name.trim(),
                product_code: product_code?.trim(),
                character_name: character_name?.trim(),
                price: Number(price) || 0,
                price_promotion: 0,
                quantity: Number(quantity) || 0,
                description: description,
                width: Number(width) || 0,
                height: Number(height) || 0,
                weight: Number(weight) || 0,
                type: type,
                status: "ACTIVE",
                material: material,
                tags: tags || [],
                categories_id: categoryValue?.id,
                producer_id: producerValue?.id,
                sale_id: null,
                imageUrls: imageUrls
            };

            // 4. Gửi request lên Backend
            const res = await api.post('/products', productDto);

            if (res.status === 201 || res.status === 200) {
                // 5. Reset form TOÀN BỘ để sẵn sàng cho lần thêm tiếp theo
                setName('');
                setCharacter_name('');
                setProduct_code('');
                setPrice('');
                setQuantity('');
                setDescription('');
                setWidth('');
                setHeight('');
                setWeight('');
                setType('');
                setMaterial('');
                setTags([]);
                setCategoryValue(null);
                setProducerValue(null);
                setImages([]);

                await fetchProducts(); // Load lại danh sách ngầm

                Swal.fire({
                    icon: "success",
                    title: "Thêm thành công 🎉",
                    confirmButtonColor: "#4CAF50",
                });

                handleClose?.(); // Đóng modal
            }
        } catch (err) {
            console.error("Lỗi chi tiết:", err);
            // Xử lý thông báo lỗi đẹp hơn thay vì hiện [object Object]
            const errorMsg = err.response?.data?.message || err.response?.data || err.message;
        } finally {
            setIsSubmitting(false); // Kết thúc trạng thái chờ dù thành công hay thất bại
        }
    };
    // delete
    const [successAlertDelete, setSuccessAlertDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleDelete = async (id) => {
        try {

            await api.delete(`/products/${id}`);
            await fetchProducts();
            Swal.fire("Xóa thành công", "", "success");

            handleConfirmClose();

        } catch (error) {

        }
    };

    const handleConfirmOpen = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setDeleteId(null);
        setConfirmOpen(false);
    };
    // Update
    const [openEdit, setOpenEdit] = useState(false)
    const [successAlertUpdate, setSuccessAlertUpdate] = useState(false);

    const [editProducts, setEditProducts] = useState({
        name: '',
        description: ''
    })
    const handleCloseEdit = () => {
        setOpenEdit(false)
    }
    // const handleChangeEdit = (event) => {
    //     setEditProducts({
    //         ...editProducts,
    //         [event.target.name]: event.target.value
    //     });
    // };
    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setEditProducts(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [selectedCategoris, setSelectedCategoris] = useState([]);
    const [selectedProducer, setSelectedProducer] = useState([])


    const handleClickOpenEdit = async (product) => {
        setEditProducts(product);

        // Kiểm tra nếu product.images tồn tại (giả sử backend trả về field là images)
        // Chúng ta chuyển đổi từ [{imageUrl: '...'}, ...] sang [{data_url: '...'}, ...]
        if (product.images && Array.isArray(product.images)) {
            const formattedImages = product.images.map(img => ({
                data_url: img.imageUrl, // Chuyển imageUrl thành data_url cho thư viện
                id: img.id // Giữ lại id nếu cần xử lý xóa sau này
            }));
            setImages(formattedImages);
        } else {
            setImages([]);
        }

        // Thiết lập các giá trị Autocomplete
        setSelectedProducer(product.producer || null);
        setSelectedCategoris(product.categories || null);

        // Đồng bộ các state helper cho Autocomplete (quan trọng để hiện đúng tên khi mở modal)
        setCategoryValue(product.categories || null);
        setProducerValue(product.producer || null);

        setOpenEdit(true);
    };

    const handleEditProducts = async () => {

        try {

            const uploadPromises = images.map(async (img) => {

                if (img.data_url.startsWith('http')) {
                    return img.data_url;
                }

                const formData = new FormData();
                formData.append("file", img.file);
                formData.append("upload_preset", "my_preset_123"); // Preset của bạn

                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/djw87hphx/image/upload`,
                    formData
                );
                return response.data.secure_url;
            });

            const finalImageUrls = await Promise.all(uploadPromises);

            // 2. Chuẩn bị DTO gửi lên Backend
            const updatedProductDto = {
                name: editProducts.name,
                product_code: editProducts.product_code,
                character_name: editProducts.character_name,
                price: Number(editProducts.price),
                price_promotion: Number(editProducts.price_promotion) || 0,
                quantity: Number(editProducts.quantity),
                description: editProducts.description,
                width: Number(editProducts.width),
                height: Number(editProducts.height),
                weight: Number(editProducts.weight),
                type: editProducts.type,
                status: editProducts.status,
                material: editProducts.material,
                tags: editProducts.tags || [],
                categories_id: categoryValue?.id, // ID từ Autocomplete
                producer_id: producerValue?.id,
                sale_id: null,
                imageUrls: finalImageUrls // Mảng các link ảnh cuối cùng
            };

            // 3. Gửi request PUT
            await api.put(
                `/products/${editProducts.id}`,
                updatedProductDto
            );

            // 4. Thông báo và làm mới dữ liệu
            Swal.fire("Thành công", "Sản phẩm đã được cập nhật!", "success");
            setOpenEdit(false); // Đóng modal edit
            fetchProducts();    // Load lại danh sách sản phẩm ở Table

        } catch (error) {
            console.error("Update error:", error);
            const errorMsg = error.response?.data?.message || "Cập nhật thất bại!";
        }
    };
    // search
    // const [searchText, setSearchText] = useState('');
    // // Gọi API khi searchText hoặc page thay đổi
    // useEffect(() => {
    //     const delayDebounce = setTimeout(() => {
    //         fetchProducersSearch();
    //     }, 300); // debounce 300ms

    //     return () => clearTimeout(delayDebounce);
    // }, [searchText, page]);

    // const fetchProducersSearch = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/website/products/search', {
    //             params: {
    //                 name: searchText,
    //                 page,
    //                 size: PAGE_SIZE
    //             }
    //         });

    //         setProducts(response.data.content);
    //         setTotalPages(response.data.totalPages);
    //     } catch (error) {
    //         console.error('Lỗi khi lấy dữ liệu:', error);
    //     }
    // };

    return (
        <div>

            <h1>Sản phẩm</h1>
            <br></br>
            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" disableElevation onClick={handleOpen}>
                    <AddIcon />  Thêm sản phẩm
                </Button>
            </Box>
            {/* Search */}
            {/* <div className="search-bar" style={{ marginBottom: 16 }}>
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
            </div> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Thêm thông tin
                    </Typography>
                    <hr />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic"
                            label="Tên sản phẩm *"
                            variant="filled"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            id="filled-basic"
                            label="Tên nhân vật *"
                            variant="filled"
                            fullWidth
                            value={character_name}
                            onChange={(e) => setCharacter_name(e.target.value)}
                        />
                        <TextField
                            id="filled-basic"
                            label=" Mã sản phẩm *"
                            variant="filled"
                            fullWidth
                            value={product_code}
                            onChange={(e) => setProduct_code(e.target.value)}
                        />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Autocomplete
                                multiple
                                freeSolo
                                options={[]}
                                value={tags}
                                onChange={(event, newValue) => setTags(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Tag *"
                                        placeholder="Nhập tag và nhấn Enter"
                                        fullWidth
                                    />
                                )}
                            />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Giá *"
                                variant="filled"
                                type="number"
                                fullWidth
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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

                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Số lượng *"
                                variant="filled"
                                type="number"
                                fullWidth
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic"
                            label="Chiều rộng *"
                            variant="filled"
                            type="number"
                            fullWidth
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                inputProps: { min: 0 },
                            }}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <TextField
                            id="filled-number"
                            label="Chiều cao *"
                            variant="filled"
                            type="number"
                            fullWidth
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                inputProps: { min: 0 },
                            }}
                        />
                        <TextField
                            id="filled-basic"
                            label="Cân nặng *"
                            variant="filled"
                            type="number"
                            fullWidth
                            value={weight}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                inputProps: { min: 0 },
                            }}
                            onChange={(e) => setWeight(e.target.value)}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-"].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />

                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>

                        <TextField
                            id="filled-number"
                            label="Kiểu mô hình *"
                            variant="filled"
                            fullWidth
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                        <TextField
                            id="filled-basic"
                            label="Chất liệu  *"
                            variant="filled"
                            fullWidth
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Autocomplete
                            value={categoryValue}
                            onChange={(event, newValue) => {
                                setCategoryValue(newValue);
                            }}
                            inputValue={categoryInputValue}
                            onInputChange={(event, newInputValue) => {
                                setCategoryInputValue(newInputValue);
                            }}
                            id="category-autocomplete"
                            options={categories}
                            getOptionLabel={(option) => option?.name || ''}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Danh mục *" />}
                        />
                        <Autocomplete
                            value={producerValue}
                            onChange={(event, newValue) => {
                                setProducerValue(newValue);
                            }}
                            inputValue={producerInputValue}
                            onInputChange={(event, newInputValue) => {
                                setProducerInputValue(newInputValue);
                            }}
                            id="producer-autocomplete"
                            options={producer}
                            getOptionLabel={(option) => option?.name || ''}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Nhà sản xuất *" />}
                        />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextareaAutosize
                            name="description"
                            aria-label="empty textarea"
                            placeholder="Mô tả ..."
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
                    {/* //ảnh */}
                    <div className="uploader-wrapper">
                        <ImageUploading
                            multiple
                            value={images}
                            onChange={onChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                        >
                            {({ imageList, onImageUpload, onImageUpdate, onImageRemove }) => (
                                <>
                                    {imageList.length > 0 && (
                                        <div className="preview-box">
                                            <img
                                                src={imageList[defaultImageIndex ?? 0]?.data_url}
                                                alt="main preview"
                                                className="main-preview"
                                            />
                                            <div className="actions">
                                                <span className="default-badge">
                                                    Mặc định
                                                </span>
                                                <button
                                                    className="action-button"
                                                    onClick={() => onImageUpdate(defaultImageIndex ?? 0)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="action-button"
                                                    onClick={() => beforeRemove(defaultImageIndex ?? 0)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="thumbs-container">
                                        {imageList.map((image, index) => (
                                            <div
                                                key={index}
                                                className={`thumb ${index === defaultImageIndex ? 'active' : ''}`}
                                                onClick={() => setAsDefault(index)}
                                            >
                                                <img src={image.data_url} alt="" />
                                            </div>
                                        ))}
                                        <div className="thumb upload-btn" onClick={onImageUpload}>
                                            <span>＋</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </ImageUploading>
                    </div>
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Button variant="contained" disableElevation
                            onClick={handleAdd}
                        >
                            Add
                        </Button>
                        <Button disableElevation onClick={handleClose}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <br>
            </br>
            {/*modal edit */}
            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Categories
                    </Typography>
                    <hr />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic"
                            label="Name products *"
                            variant="filled"
                            fullWidth
                            name="name"
                            value={editProducts.name || ''}
                            onChange={handleChangeEdit}
                        />

                        <TextField
                            id="filled-basic"
                            label="Character name *"
                            variant="filled"
                            fullWidth
                            name="character_name"
                            value={editProducts.character_name || ''}
                            onChange={handleChangeEdit}
                        />
                        <TextField
                            id="filled-basic"
                            label=" Products code *"
                            variant="filled"
                            fullWidth
                            name="product_code"
                            value={editProducts.product_code || ''}
                            onChange={handleChangeEdit}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Autocomplete
                                multiple
                                freeSolo
                                options={[]} // không có gợi ý sẵn
                                value={editProducts.tags || []} // tên chính xác là tags (phù hợp với entity)
                                onChange={(event, newValue) => {
                                    handleChangeEdit({
                                        target: {
                                            name: 'tags', // phải là 'tags' để map đúng với backend
                                            value: newValue
                                        }
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Tag *"
                                        placeholder="Nhập tag và nhấn Enter"
                                        fullWidth
                                        name="tags"
                                    />
                                )}
                            />

                        </Box>


                        {/* <Box sx={{ flex: 1 }}>
                            <Autocomplete
                                multiple
                                freeSolo
                                options={[]}
                                value={tags}
                                onChange={(event, newValue) => setTags(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Tag *"
                                        placeholder="Nhập tag và nhấn Enter"
                                        fullWidth
                                    />
                                )}
                            />
                        </Box> */}
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                id="filled-basic"
                                label="Price *"
                                variant="filled"
                                type='number'
                                fullWidth
                                name="price"
                                value={editProducts.price || ''}
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
                            /></Box>

                        <Box sx={{ flex: 1 }}>
                            <TextField
                                id="filled-number"
                                label="Quantity *"
                                variant="filled"
                                type="number"
                                fullWidth
                                name="quantity"
                                value={editProducts.quantity ?? ''}
                                onChange={handleChangeEdit}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Box>

                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic"
                            label="Width *"
                            variant="filled"
                            type="number"
                            fullWidth
                            name="width"
                            value={editProducts.width || ''}
                            onChange={handleChangeEdit}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                inputProps: { min: 0 },
                            }}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <TextField
                            id="filled-number"
                            label="Height *"
                            variant="filled"
                            type="number"
                            fullWidth
                            name="height"
                            value={editProducts.height || ''}
                            onChange={handleChangeEdit}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                inputProps: { min: 0 },
                            }}
                        />
                        <TextField
                            id="filled-basic"
                            label="Weight *"
                            variant="filled"
                            type='number'
                            fullWidth
                            name="weight"
                            value={editProducts.weight || ''}
                            onChange={handleChangeEdit}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
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
                            id="filled-number"
                            label="Type *"
                            variant="filled"
                            fullWidth
                            name="type"
                            value={editProducts.type || ''}
                            onChange={handleChangeEdit}
                        />
                        <TextField
                            id="filled-basic"
                            label="Material *"
                            variant="filled"
                            fullWidth
                            value={editProducts.material || ''}
                            onChange={handleChangeEdit}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Autocomplete
                            value={selectedCategoris}
                            onChange={(event, newValue) => {
                                setCategoryValue(newValue);
                            }}
                            inputValue={categoryInputValue}
                            onInputChange={(event, newInputValue) => {
                                setCategoryInputValue(newInputValue);
                            }}
                            id="category-autocomplete"
                            options={categories}
                            getOptionLabel={(option) => option?.name || ''}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Categories *" />}
                        />
                        <Autocomplete
                            value={selectedProducer}
                            onChange={(event, newValue) => {
                                setProducerValue(newValue);
                            }}
                            inputValue={producerInputValue}
                            onInputChange={(event, newInputValue) => {
                                setProducerInputValue(newInputValue);
                            }}
                            id="producer-autocomplete"
                            options={producer}
                            getOptionLabel={(option) => option?.name || ''}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Producer *" />}
                        />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextareaAutosize
                            name="description"
                            aria-label="empty textarea"
                            placeholder="Description ..."
                            minRows={3}
                            value={editProducts.description || ''}
                            onChange={handleChangeEdit}
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
                    {/* //ảnh */}
                    <div className="uploader-wrapper">
                        <ImageUploading
                            multiple
                            value={images}
                            onChange={onChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                        >
                            {({ imageList, onImageUpload, onImageUpdate, onImageRemove }) => (
                                <>
                                    {imageList.length > 0 && (
                                        <div className="preview-box">
                                            <img
                                                src={imageList[defaultImageIndex ?? 0]?.data_url}
                                                alt="main preview"
                                                className="main-preview"
                                            />
                                            <div className="actions">
                                                <span className="default-badge">
                                                    Mặc định
                                                </span>
                                                <button
                                                    className="action-button"
                                                    onClick={() => onImageUpdate(defaultImageIndex ?? 0)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="action-button"
                                                    onClick={() => beforeRemove(defaultImageIndex ?? 0)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="thumbs-container">
                                        {imageList.map((image, index) => (
                                            <div
                                                key={index}
                                                className={`thumb ${index === defaultImageIndex ? 'active' : ''}`}
                                                onClick={() => setAsDefault(index)}
                                            >
                                                <img src={image.data_url} alt="" />
                                            </div>
                                        ))}
                                        <div className="thumb upload-btn" onClick={onImageUpload}>
                                            <span>＋</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </ImageUploading>
                    </div>
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Button color="primary" variant="contained" onClick={handleEditProducts}>Update</Button>
                        <Button onClick={handleCloseEdit} color="primary">Cancel</Button>
                    </Box>
                </Box>
            </Modal>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#b8b8b8' }}>
                            <TableCell>STT</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Giá giảm</TableCell>
                            <TableCell>Tồn kho</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow key={product.id}>
                                {/* Sửa lại STT dựa trên page và size */}
                                <TableCell>{page * size + index + 1}</TableCell>
                                <TableCell>
                                    <Avatar
                                        variant="rounded"
                                        src={product.images?.[0]?.imageUrl || ''}
                                        sx={{ width: 60, height: 60, border: '1px solid #ddd' }}
                                    >N/A</Avatar>
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{Number(product.price).toLocaleString('vi-VN')} đ</TableCell>
                                <TableCell style={{ color: "red" }}>
                                    {Number(
                                        product.sale?.status === 1
                                            ? product.price * (1 - product.sale.discountPercent / 100)
                                            : product.price
                                    ).toLocaleString('vi-VN')} đ
                                </TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell style={{ color: product.status === "Còn hàng" ? "green" : "red" }}>
                                    {product.status}
                                </TableCell>
                                <TableCell>
                                    <Button color="primary" variant="outlined" size="small" onClick={() => handleClickOpenEdit(product)}>Sửa</Button>
                                    <Button color="error" variant="outlined" size="small" style={{ marginLeft: 8 }} onClick={() => handleConfirmOpen(product.id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* THÊM PHẦN PHÂN TRANG NÀY VÀO DƯỚI TABLE */}
            <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Stack>
            {/* Dialog xác nhận xóa */}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa sản phẩm này?</DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={() => {
                        handleDelete(deleteId); // Thực hiện xóa
                        handleConfirmClose();   // Đóng Dialog
                    }} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default Products;