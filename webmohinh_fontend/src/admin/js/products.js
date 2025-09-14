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
    // const [selectedImage, setSelectedImage] = useState(null); // Lưu file chưa upload
    // const [imagePreview, setImagePreview] = useState("");
    const [categoryValue, setCategoryValue] = useState(null);
    const [categoryInputValue, setCategoryInputValue] = useState('');
    const [producerValue, setProducerValue] = useState(null);
    const [producerInputValue, setProducerInputValue] = useState('');
    const [tags, setTags] = React.useState([]);
    // tag
    //GetAll
    const [page, setPage] = useState(0); // page = 0 is first page
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/website/productsAll', {
                params: { page, size }
            });

            setProducts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, size]);

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
            const response = await axios.get('http://localhost:8080/website/categoriesAll', {
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
            const response = await axios.get('http://localhost:8080/website/producerAll', {
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
    const [successAlertAdd, setSuccessAlertAdd] = useState(false);

    const [newProducts, setNewProducts] = useState({});
    // Convert dataURL to File
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new File([u8arr], filename, { type: mime });
    };


    const handleAdd = async () => {
        const formData = new FormData();

        if (!name || !description || !price || !quantity || !categoryValue || !producerValue) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        // Text fields
        formData.append('name', name);
        formData.append('product_code', product_code);
        formData.append('character_name', character_name);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('width', width);
        formData.append('height', height);
        formData.append('weight', weight);
        formData.append('type', type);
        formData.append('status', newProducts.status);
        formData.append('material', material);
        formData.append('tag', tags);
        formData.append('description', description);
        formData.append('categories', categoryValue?.id || '');
        formData.append('producer', producerValue?.id || '');
        console.log("tôi là:" + status)
        // Ảnh mặc định
        if (images.length > 0 && typeof defaultImageIndex === 'number') {
            const defaultImage = images[defaultImageIndex];
            const file = dataURLtoFile(defaultImage.data_url, 'default-image.png');
            formData.append('image', file);
        }

        // Ảnh phụ
        images.forEach((img, i) => {
            const file = dataURLtoFile(img.data_url, `image-${i}.png`);
            formData.append('images[]', file);
        });

        try {
            const res = await axios.post('http://localhost:8080/website/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // setProducts([res.data, ...products]);
            setSuccessAlertAdd(true);
            setTimeout(() => setSuccessAlertAdd(false), 3000);
            // Reset form
            setName('');
            setProduct_code('');
            setCharacter_name('');
            setPrice('');
            setQuantity('');
            setWidth('');
            setHeight('');
            setWeight('');
            setType('');
            setStatus('');
            setMaterial('');
            setTags('');
            setCategoryValue(null);
            setProducerValue(null);
            setDescription('');
            setImages([]);
            setDefaultImageIndex(null);
            await fetchProducts();
            handleClose?.();
        } catch (err) {
            console.error(err);
            alert("Lỗi khi thêm sản phẩm!");
        }
    };
    // delete
    const [successAlertDelete, setSuccessAlertDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleDelete = async (id) => {
        try {

            await axios.delete(`http://localhost:8080/website/products/${id}`);
            await fetchProducts();
            handleConfirmClose();
            setSuccessAlertDelete(true);
            setTimeout(() => setSuccessAlertDelete(false), 3000);
        } catch (error) {
            console.error('Error deleting producer:', error);

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
    const convertProductImagesToUploaderFormat = (imagesFromServer) => {
        return imagesFromServer.map(image => ({
            data_url: `data:image/jpeg;base64,${image.imageData}`, // base64 string
        }));
    }
    // const handleClickOpenEdit = (products) => {
    //     setSelectedProducer(products.categories || []);
    //     setSelectedCategoris(products.producer || []);

    //     setDefaultImageIndex(0);
    //     setOpenEdit(true);
    // };
    const handleClickOpenEdit = async (product) => {
        setEditProducts(product);

        // Fetch images from backend (assuming product.id is available)
        const response = await fetch(`http://localhost:8080/website/products/${product.id}/images`);
        const data = await response.json(); // [{ id, imageData }]
        const imageList = convertProductImagesToUploaderFormat(data);

        setImages(imageList); // For <ImageUploading />
        setDefaultImageIndex(0); // hoặc index nào bạn cần
        setSelectedProducer(product.producer || []);
        setSelectedCategoris(product.categories || []);
        setOpenEdit(true);
    };

    const handleEditProducts = async () => {
        try {
            const formData = new FormData();
            formData.append("name", editProducts.name);
            formData.append("product_code", editProducts.product_code);
            formData.append("character_name", editProducts.character_name);
            formData.append("price", editProducts.price);
            formData.append("quantity", editProducts.quantity);
            formData.append("width", editProducts.width);
            formData.append("height", editProducts.height);
            formData.append("weight", editProducts.weight);
            formData.append("type", editProducts.type);
            formData.append("material", editProducts.material);
            formData.append("tag", editProducts.tag);
            formData.append('categories', editProducts.categories?.id || '');
            formData.append("producer", editProducts.producer?.id || '');

            formData.append("description", editProducts.description);

            // Kiểm tra nếu là file mới thì thêm image
            if (editProducts.image instanceof File) {
                formData.append("image", editProducts.image);
            }

            const response = await axios.put(
                `http://localhost:8080/website/products/${editProducts.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (editProducts.extraImages && editProducts.extraImages.length > 0) {
                editProducts.extraImages.forEach((img) => {
                    if (img instanceof File) {
                        formData.append("images[]", img);
                    }
                });
            }

            setCategories(prevCategories =>
                prevCategories.map(categorie =>
                    categorie.id === editProducts.id ? response.data : categorie
                )
            );
            await fetchProducts();
            handleCloseEdit();
            setSuccessAlertUpdate(true);
            setTimeout(() => setSuccessAlertUpdate(false), 3000);
        } catch (error) {
            console.error("Lỗi xảy ra khi cập nhật:", error);
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
            const response = await axios.get('http://localhost:8080/website/products/search', {
                params: {
                    name: searchText,
                    page,
                    size: PAGE_SIZE
                }
            });

            setProducts(response.data.content);
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
            <h1>Products</h1>
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
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <TextField
                            id="filled-basic"
                            label="Name products *"
                            variant="filled"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            id="filled-basic"
                            label="Character name *"
                            variant="filled"
                            fullWidth
                            value={character_name}
                            onChange={(e) => setCharacter_name(e.target.value)}
                        />
                        <TextField
                            id="filled-basic"
                            label=" Products code *"
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
                                label="Price *"
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
                                label="Quantity *"
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
                            label="Width *"
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
                            label="Height *"
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
                            label="Weight *"
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
                            label="Type *"
                            variant="filled"
                            fullWidth
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                        <TextField
                            id="filled-basic"
                            label="Material *"
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
                            renderInput={(params) => <TextField {...params} label="Categories *" />}
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
                            renderInput={(params) => <TextField {...params} label="Producer *" />}
                        />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#b8b8b8' }}>
                            <TableCell>STT</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            {/* <TableCell>Danh mục</TableCell> */}
                            {/* <TableCell>Nhà sản xuất</TableCell> */}
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
                                <TableCell>{page * PAGE_SIZE + index + 1}</TableCell>
                                <TableCell>
                                    {Array.isArray(product.imageBase64List) && product.imageBase64List.length > 0 ? (
                                        <img
                                            style={{ height: '80px', width: '60px', objectFit: 'cover' }}
                                            src={`data:image/jpeg;base64,${product.imageBase64List[0]}`}
                                            alt="Product"
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                height: '80px',
                                                width: '60px',
                                                backgroundColor: '#eee',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                color: '#999',
                                            }}
                                        >
                                            No image
                                        </div>
                                    )}

                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                {/* <TableCell>{product.categories.name}</TableCell> */}
                                {/* <TableCell>{product.producer.name}</TableCell> */}
                                <TableCell>{Number(product.price).toLocaleString('vi-VN')} đ</TableCell>
                                <TableCell style={{ color: "red" }}>
                                    {Number(
                                        product.sale?.status === 1
                                            ? product.price - (product.price * (product.sale.discountPercent / 100))
                                            : product.price
                                    ).toLocaleString('vi-VN')} đ
                                </TableCell>
                                <TableCell >{product.quantity} </TableCell>
                                <TableCell
                                    style={{
                                        color: product.status === "Còn hàng" ? "green" : "red",

                                    }}
                                >
                                    {product.status}
                                </TableCell>


                                <TableCell>
                                    <Button color="primary" variant="outlined" size="small"
                                        onClick={() => handleClickOpenEdit(product)}
                                    >Edit
                                    </Button>
                                    <Button color="error" variant="outlined" size="small" style={{ marginLeft: 8 }}
                                        onClick={() => handleConfirmOpen(product.id)}>Delete                                     </Button>
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
            {/* Dialog xác nhận xóa */}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa sản phẩm này?</DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={() => handleDelete(deleteId)} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default Products;