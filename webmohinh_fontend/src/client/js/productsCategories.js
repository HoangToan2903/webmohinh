import Navbar from './navbar'
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import slugify from "./utils/slugify";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { addToCart, resizeImageToBase64, base64ToFile } from './addCart';
import Footer from './footer'
import api from '../../axiosConfig';
import { Pagination, Stack } from '@mui/material';

function ProductsCategories() {
    useEffect(() => {
        import('../css/home.css');

    }, []);

    const [lower, setLower] = useState(100000);
    const [upper, setUpper] = useState(10000000);
    const [selectedProducer, setSelectedProducer] = useState(null);
    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN') + ' ₫';
    };

    const handleLowerChange = (e) => {
        const value = Math.min(Number(e.target.value), upper);
        setLower(value);
    };

    const handleUpperChange = (e) => {
        const value = Math.max(Number(e.target.value), lower);
        setUpper(value);
    };
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    // console.log(localStorage.getItem('movieId'));

    useEffect(() => {
        const storedId = localStorage.getItem('categoryId');
        if (storedId) {
            setId(storedId);  // Cập nhật state id nếu có
        }
    }, [window.location.pathname]);
    const [productsPage, setProductsPage] = useState({ content: [], first: true, last: true });
    const [page, setPage] = useState(0);
    const size = 12;
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        fetchProducts();
    }, [id, page]);

    // Thêm 1 state để trigger việc fetch lại khi nhấn nút Lọc
    const [filterTrigger, setFilterTrigger] = useState(0);

    const fetchProducts = async () => {
        try {
            const response = await api.get(`/category/${id}`, {
                params: {
                    page: page,
                    size: size,
                    minPrice: lower,
                    maxPrice: upper,
                    producerId: selectedProducer // Gửi ID lên server
                }
            });
            setProductsPage(response.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi fetch sản phẩm:", error);
        }
    };

    // Đừng quên thêm selectedProducer vào mảng dependencies của useEffect
    useEffect(() => {
        fetchProducts();
    }, [id, page, filterTrigger, selectedProducer]);

    // Cập nhật useEffect để lắng nghe thêm filterTrigger
    useEffect(() => {
        if (id) {
            fetchProducts();
        }
    }, [id, page, filterTrigger]); // Fetch lại khi ID, trang hoặc nút Lọc được nhấn

    // Hàm xử lý khi nhấn nút Lọc
    const handleFilterBtn = () => {
        setPage(0); // Reset về trang đầu tiên khi lọc
        setFilterTrigger(prev => prev + 1); // Kích hoạt useEffect
    };
    const handlePageChange = (event, value) => {
        setPage(value - 1); // Material UI Pagination dùng base-1, Spring Boot dùng base-0
    };

    const [producers, setProducers] = useState([]);

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
    }, [page, size])
    // Lưu ID thương hiệu đang chọn (null nếu không chọn)

    // Hàm xử lý khi nhấn chọn/bỏ chọn thương hiệu
    const handleProducerChange = (producerId) => {
        // Nếu nhấn vào cái đã chọn thì bỏ chọn (Xóa lọc), ngược lại thì chọn cái mới
        const newId = selectedProducer === producerId ? null : producerId;
        setSelectedProducer(newId);
        setPage(0); // Reset về trang 1
    };

    // Hàm xóa tất cả lọc thương hiệu
    const clearFilters = () => {
        setSelectedProducer(null);
        setPage(0);
    };
    return (
        <div>
            <Navbar />
            <div className='container_detailCategrories'>
                <br>
                </br>
                {/* <div className="breadcrumb">
                    <Link style={{ color: "#555" }} to="/home" >Trang chủ</Link>  /
                </div> */}
                {/* 1. Kiểm tra xem có dữ liệu không trước khi hiển thị */}
                {productsPage.content && productsPage.content.length > 0 && (
                    <div className="breadcrumb" style={{ marginBottom: "20px" }}>
                        <Link style={{ color: "#555", textDecoration: "none" }} to="/home">
                            Trang chủ
                        </Link>
                        <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>

                        {/* 2. Chỉ lấy tên danh mục của phần tử đầu tiên trong mảng */}
                        <span style={{ color: "#333", fontWeight: "bold" }}>
                            {productsPage.content[0].categories.name}
                        </span>
                    </div>
                )}

                {/* 3. Phần map sản phẩm thực sự nằm ở dưới này (nếu có) */}
                {/* productsPage.content.map((product) => ( ... )) */}
                <div className="product-section">
                    <div className="left-column">
                        <b style={{ fontSize: '20px' }}>Bộ lọc sản phẩm</b>
                        <div className="horizontal-line"></div>
                        <br>
                        </br>
                        <div className="active-filters-container" style={{ margin: '15px 0' }}>
                            {selectedProducer && producers.length > 0 && (
                                <div className="active-filters-list"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        flexWrap: 'wrap' // Để tag tự xuống dòng nếu quá dài
                                    }}
                                >
                                    {/* Chữ "LỌC THEO:" màu vàng, font mỏng hơn */}
                                    <span style={{
                                        color: '#e74c3c',
                                        fontSize: '16px',
                                        fontWeight: '400', // Không in đậm
                                        textTransform: 'uppercase',
                                        marginRight: '5px'
                                    }}>
                                        LỌC THEO:
                                    </span>

                                    {/* Thẻ Tag (Label) */}
                                    <div className="filter-tag"
                                        style={{
                                            backgroundColor: '#e74c3c',
                                            color: 'white',
                                            borderRadius: '25px', // Bo tròn nhiều hơn
                                            padding: '8px 18px', // Padding rộng ra
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            fontSize: '15px',
                                            fontFamily: 'sans-serif' // Font sạch sẽ
                                        }}
                                    >
                                        {/* Vòng tròn bao quanh dấu X */}
                                        <span
                                            onClick={() => setSelectedProducer(null)} // Click vào X để xóa
                                            style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '20px', // Kích thước vòng tròn
                                                height: '20px',
                                                borderRadius: '50%',
                                                border: '1px solid white', // Viền trắng
                                                marginRight: '10px', // Khoảng cách với chữ
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ✕
                                        </span>

                                        {/* Tên thương hiệu */}
                                        <span>
                                            {producers.find(p => String(p.id) === String(selectedProducer))?.name}
                                        </span>
                                    </div>

                                    {/* Chữ "Xóa tất cả" màu đỏ, dịch sang bên phải một chút */}
                                    <span
                                        className="clear-all"
                                        onClick={() => setSelectedProducer(null)}
                                        style={{
                                            cursor: 'pointer',
                                            color: '#e74c3c', // Màu đỏ đỏ tươi
                                            fontSize: '15px',
                                            marginLeft: '15px', // Khoảng cách với Tag
                                            textDecoration: 'none' // Không gạch chân (giống hình)
                                        }}
                                    >
                                        Xóa 
                                    </span>
                                </div>
                            )}
                        </div>
                        <b style={{ fontSize: '20px' }}>Thương hiệu</b>

                        <div className="category-list" style={{ marginTop: '15px' }}>
                            {producers.map((producer) => (
                                <div
                                    key={producer.id}
                                    className="category-item"
                                    onClick={() => handleProducerChange(producer.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        marginBottom: '10px',
                                        color: selectedProducer === producer.id ? '#333' : '#888'
                                    }}
                                >
                                    {/* Vòng tròn tích chọn */}
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        border: '2px solid #ddd',
                                        marginRight: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: selectedProducer === producer.id ? '#e74c3c' : 'transparent',
                                        borderColor: selectedProducer === producer.id ? '#e74c3c' : '#ddd'
                                    }}>
                                        {selectedProducer === producer.id && (
                                            <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                                        )}
                                    </div>
                                    <span>{producer.name}</span>
                                </div>
                            ))}
                        </div>
                        <br></br>
                        <b style={{ fontSize: '20px' }}>Lọc theo giá</b>
                        <div className="wrapper">
                            <fieldset className="filter-price">
                                <div className="price-field">
                                    <input
                                        type="range"
                                        min="100000"
                                        max="10000000"
                                        value={lower}
                                        onChange={handleLowerChange}
                                    />
                                    <input
                                        type="range"
                                        min="100000"
                                        max="10000000"
                                        value={upper}
                                        onChange={handleUpperChange}
                                    />
                                </div>
                                <div className="price-wrap">
                                    <span className="price-text">
                                        Giá: <strong>{formatCurrency(lower)}</strong> — <strong>{formatCurrency(upper)}</strong>
                                    </span>
                                    <br></br>
                                    <br></br>
                                    <button
                                        className="btn-filter"
                                        onClick={handleFilterBtn}
                                        type="button"
                                    >
                                        Lọc
                                    </button>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="flex-center">
                            <div className="portfolio gallery gallery-container">
                                {productsPage.content.map((product, index) => {
                                    const displayImage = product.images && product.images.length > 0
                                        ? product.images[0].imageUrl
                                        : null;


                                    return (
                                        <div className="item" key={index}>
                                            <div className="thumb" style={{ position: "relative" }}>
                                                <a className="category">One Piece</a>

                                                {displayImage ? (
                                                    <img
                                                        // style={{ objectFit: "cover", width: "100%", height: "300px" }} // Thêm kích thước cố định để card đều
                                                        src={product.images?.[0]?.imageUrl || ''}
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <div style={{ height: "250px", width: "100%", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                                                        No image
                                                    </div>
                                                )}

                                                {/* Overlay chữ "Hết hàng" */}
                                                {product.status === "Hết hàng" && (
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            width: "100%",
                                                            height: "100%",
                                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                            color: "white",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: "bold",
                                                            fontSize: "18px",
                                                            zIndex: 2,
                                                        }}
                                                    >
                                                        ❌ Hết hàng
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text">
                                                <h3>
                                                    <a
                                                        onClick={() => {
                                                            localStorage.setItem("productsId", product.id);
                                                            localStorage.setItem("productImages", JSON.stringify(product.images || []));
                                                            navigate(`/shopNemo/${slugify(product.name)}`);
                                                        }}
                                                    >
                                                        {product.name}
                                                    </a>
                                                </h3>

                                                {/* Giá */}
                                                {!product.sale?.id || product.sale?.status === 0 ? (
                                                    <p>{Number(product.price).toLocaleString("vi-VN")} đ</p>
                                                ) : (
                                                    <p>
                                                        <del style={{ color: "gray", marginRight: "8px" }}>
                                                            {Number(product.price).toLocaleString("vi-VN")} đ
                                                        </del>
                                                        <strong style={{ color: '#e74c3c' }}>
                                                            {Number(
                                                                product.price - (product.price * (product.sale.discountPercent / 100))
                                                            ).toLocaleString("vi-VN")} đ
                                                        </strong>
                                                    </p>
                                                )}

                                                {/* Thêm vào giỏ nếu còn hàng */}
                                                {product.status !== "Hết hàng" && (
                                                    <a
                                                        href="#"
                                                        className="view"
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            try {
                                                                if (!displayImage) {
                                                                    alert("Không có ảnh để thêm vào giỏ.");
                                                                    return;
                                                                }

                                                                let imageToSave = displayImage;

                                                                // CHỈ resize nếu displayImage là chuỗi Base64 quá lớn
                                                                // Nếu displayImage là URL (http...), bỏ qua đoạn resize này để tối ưu tốc độ
                                                                if (displayImage.startsWith('data:image')) {
                                                                    const file = base64ToFile(displayImage);
                                                                    imageToSave = await resizeImageToBase64(file, 100, 100, 0.5);
                                                                }

                                                                const finalPrice = product.sale?.id && product.sale?.status === 1
                                                                    ? product.price - (product.price * (product.sale.discountPercent / 100))
                                                                    : product.price;

                                                                addToCart({
                                                                    id: product.id,
                                                                    name: product.name,
                                                                    price: finalPrice,
                                                                    image: imageToSave, // URL hoặc base64 ngắn gọn
                                                                });

                                                                alert("Đã thêm vào giỏ hàng!");
                                                            } catch (error) {
                                                                console.error("Lỗi khi thêm giỏ hàng:", error);
                                                                alert("Không thể thêm sản phẩm.");
                                                            }
                                                        }}
                                                    >
                                                        Thêm vào giỏ hàng <span className="fa-solid fa-angle-right"></span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}


                            </div>
                        </div>
                        <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
                            <Pagination
                                count={totalPages}
                                page={page + 1}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Stack>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default ProductsCategories;