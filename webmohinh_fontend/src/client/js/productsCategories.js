import Navbar from './navbar'
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import slugify from "./utils/slugify";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { addToCart, resizeImageToBase64, base64ToFile } from './addCart';


function ProductsCategories() {
    useEffect(() => {
        import('../css/home.css');

    }, []);

    const [lower, setLower] = useState(50000);
    const [upper, setUpper] = useState(2520000);

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

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/website/category/${id}?page=${page}&size=${size}`
            );
            setProductsPage(response.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    const handleNext = () => {
        if (!productsPage.last) setPage(prev => prev + 1);
    };

    const handlePrev = () => {
        if (!productsPage.first) setPage(prev => prev - 1);
    };



    return (
        <div>
            <Navbar />
            <div className='container_detailCategrories'>
                <br>
                </br>
                <div className="breadcrumb">
                    <Link style={{ color: "#555" }} to="/home" >Trang chủ</Link>  / 
                </div>
                <div className="product-section">
                    <div className="left-column">
                        <b style={{ fontSize: '20px' }}>Tìm kiếm</b>
                        <div className="horizontal-line"></div>
                        <br>
                        </br>
                        <b style={{ fontSize: '20px' }}>Danh mục</b>
                        <br></br>
                        <br></br>
                        <div className="category-list">
                            <div className="category-item">Action figure</div>
                            <div className="category-item">Bộ figure</div>
                            <div className="category-item">Nendoroid</div>
                            <div className="category-item">Figma</div>
                        </div>
                        <br></br>
                        <b style={{ fontSize: '20px' }}>Lọc theo giá</b>
                        <div className="wrapper">
                            <fieldset className="filter-price">
                                <div className="price-field">
                                    <input
                                        type="range"
                                        min="50000"
                                        max="350000"
                                        value={lower}
                                        onChange={handleLowerChange}
                                    />
                                    <input
                                        type="range"
                                        min="50000"
                                        max="2520000"
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
                                    <button className="btn-filter">Lọc</button>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="flex-center">
                            <div className="portfolio gallery gallery-container">
                                {productsPage.content.map((product, index) => {
                                    const base64Image =
                                        Array.isArray(product.imageBase64List) && typeof product.imageBase64List[0] === "string"
                                            ? `data:image/jpeg;base64,${product.imageBase64List[0]}`
                                            : null;

                                    return (
                                        <div className="item" key={index}>
                                            <div className="thumb" style={{ position: "relative" }}>
                                                <a className="category">One Piece</a>

                                                {base64Image ? (
                                                    <img
                                                        style={{ objectFit: "cover" }}
                                                        src={base64Image}
                                                        alt="Product"
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            height: "80px",
                                                            width: "60px",
                                                            backgroundColor: "#eee",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "12px",
                                                            color: "#999",
                                                        }}
                                                    >
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
                                                {!product.sale?.id ? (
                                                    <p>{Number(product.price).toLocaleString("vi-VN")} đ</p>
                                                ) : (
                                                    <p>
                                                        <del style={{ color: "gray", marginRight: "8px" }}>
                                                            {Number(product.price).toLocaleString("vi-VN")} đ
                                                        </del>
                                                        <strong>
                                                            {Number(product.price - (product.price * (product.sale?.discountPercent / 100))).toLocaleString("vi-VN")} đ
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
                                                                if (!base64Image) {
                                                                    alert("Không có ảnh để thêm vào giỏ.");
                                                                    return;
                                                                }

                                                                const file = base64ToFile(base64Image);
                                                                const resizedImage = await resizeImageToBase64(file);

                                                                // Tính giá cuối cùng dựa trên sale
                                                                const finalPrice = product.sale?.id
                                                                    ? product.price - (product.price * (product.sale.discountPercent / 100))
                                                                    : product.price;

                                                                addToCart({
                                                                    id: product.id,
                                                                    name: product.name,
                                                                    price: finalPrice, // ✅ dùng giá đã xử lý
                                                                    image: resizedImage,
                                                                });

                                                                alert("Đã thêm vào giỏ hàng!");
                                                            } catch (error) {
                                                                console.error("Lỗi khi xử lý ảnh:", error);
                                                                alert("Không thể thêm sản phẩm vào giỏ hàng.");
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
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
                            <span style={{ margin: '0 12px' }}>Trang {page + 1} / {totalPages}</span>
                            <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Tiếp</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default ProductsCategories;