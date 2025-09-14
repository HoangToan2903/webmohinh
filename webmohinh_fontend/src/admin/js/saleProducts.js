import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Checkbox, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Slide } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';


const PAGE_SIZE = 10;
function Statistics() {
    const { tab } = useParams(); // Lấy tab từ URL
    const navigate = useNavigate();
    const handleTabChange = (newTab) => {
        navigate(`/admin/${newTab}`);
    };

    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState([]);
    // const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [saleId, setSaleId] = useState("");
    const location = useLocation();
    const idSale = location.state?.saleId;


    // Fetch product data (replace this with your actual API call)
    const [page, setPage] = useState(0); // page = 0 is first page
    const [size, setSize] = useState(10);
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

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = products.map((n) => n.id);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((item) => item !== id);
        }

        setSelected(newSelected);
    };
    const [successAlertAdd, setSuccessAlertAdd] = useState(false);

    const handleAddSaleToSelected = async () => {
        if (selected.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để áp dụng sale!');
            return;
        }

        try {
            const requests = selected.map(productId =>
                axios.put('http://localhost:8080/website/addSale', null, {
                    params: {
                        productId,
                        idSale  // Trùng với tên @RequestParam(name = "idSale")
                    }
                })
            );

            await Promise.all(requests);
            setSuccessAlertAdd(true);
            setTimeout(() => setSuccessAlertAdd(false), 3000);
            setSaleId('');
            setSelected([]);
            await fetchProducts();
        } catch (error) {
            alert('Đã xảy ra lỗi khi áp dụng khuyến mãi!');
            console.error(error);
        }
    };

    const [successAlertDelete, setSuccessAlertDelete] = useState(false);

    const handleCancelSaleToSelected = async () => {
        if (selected.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để áp dụng sale!');
            return;
        }
        try {
            const requests = selected.map(productId =>
                axios.put('http://localhost:8080/website/addSale', null, {
                    params: {
                        productId,
                        idSale: null
                    }
                })
            );

            await Promise.all(requests);
            setSuccessAlertDelete(true);
            setTimeout(() => setSuccessAlertDelete(false), 3000);
            setSaleId('');
            setSelected([]);
            await fetchProducts();
        } catch (error) {
            alert('Error adding sale!');
            console.error(error);
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
                        sx={{
                            width: '300px', // hoặc tùy chỉnh
                            position: 'fixed',
                            top: 16, // cách mép trên 16px
                            right: 16, // cách mép phải 16px
                            zIndex: 9999, // đảm bảo hiển thị trên các thành phần khác
                        }}
                        severity="success"
                    >
                        Xóa thành công !!!
                    </Alert>
                </Slide>
            )}
            {successAlertAdd && (
                <Slide
                    direction="left"
                    in={successAlertAdd}
                    mountOnEnter
                    unmountOnExit
                >
                    <Alert
                        sx={{
                            width: '300px', // hoặc tùy chỉnh
                            position: 'fixed',
                            top: 16, // cách mép trên 16px
                            right: 16, // cách mép phải 16px
                            zIndex: 9999, // đảm bảo hiển thị trên các thành phần khác
                        }}
                        severity="success"
                    >
                        Thêm thành công !!!
                    </Alert>
                </Slide>
            )}

            <h1>Products Sale</h1>
            <br></br>
            <Button
                style={{ marginBottom: 10, }}
                variant="contained"
                disableElevation
                className={tab === 'sale' ? 'active' : ''} onClick={() => handleTabChange('sale')}
            >
                <ArrowBackIcon /> Back
            </Button>
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

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="product table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < products.length}
                                    checked={products.length > 0 && selected.length === products.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Sale (%)</TableCell>
                            <TableCell>Price_Sale</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => {
                            const isItemSelected = isSelected(product.id);
                            return (
                                <TableRow
                                    key={product.id}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    selected={isItemSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isItemSelected}
                                            onChange={() => handleClick(product.id)}
                                        />
                                    </TableCell>
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
                                    <TableCell>{product.categories?.name || "N/A"}</TableCell>
                                    <TableCell>{Number(product.price).toLocaleString('vi-VN')} đ</TableCell>
                                    <TableCell style={{ color: "green" }}>
                                        {product.sale?.status === 1 ? product.sale.discountPercent : "0"}%
                                    </TableCell>                                    <TableCell style={{ color: "red" }}>
                                        {Number(
                                            product.sale?.status === 1
                                                ? product.price - (product.price * (product.sale.discountPercent / 100))
                                                : product.price
                                        ).toLocaleString('vi-VN')} đ
                                    </TableCell>                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
                <span style={{ margin: '0 12px' }}>Trang {page + 1} / {totalPages}</span>
                <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Tiếp</Button>
            </div>

            {/* Add Sale Button */}
            <br />
            <Button
                style={{ float: 'right', marginTop: 10 }}
                variant="contained"
                disableElevation
                onClick={handleAddSaleToSelected}
            >
                <AddIcon /> Add sale
            </Button>

            <Button
                style={{ float: 'right', marginTop: 10, marginRight: 10 }}
                variant="contained"
                disableElevation
                onClick={handleCancelSaleToSelected}
            >
                <CloseIcon /> Cancel sale
            </Button>


        </div>
    )
}
export default Statistics;