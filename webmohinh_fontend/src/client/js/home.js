import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import slugify from "./utils/slugify";
import { addToCart, resizeImageToBase64, base64ToFile } from './addCart';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../axiosConfig';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
function Home() {

    const [loading, setLoading] = useState(false);
    const size = 10; // giữ nguyên mỗi lần gọi lấy 10 sản phẩm

    const [productsOnePiece, setProductsOnePiece] = useState([]);
    const fetchEnoughProductsOnePiece = async () => {
        let collected = [];
        let currentPage = 0;
        let hasMore = true;

        setLoading(true);

        try {
            while (collected.length < 8 && hasMore) {
                const response = await api.get('/productsAll', {
                    params: { page: currentPage, size }
                });

                const data = response.data;
                const filtered = data.content.filter(
                    (product) => product.categories?.name === "Mô hình One Piece"
                );

                collected = [...collected, ...filtered];

                hasMore = currentPage < data.totalPages - 1;
                currentPage += 1;

                if (!hasMore) break; // hết trang rồi thì dừng
            }

            // Cắt đúng 8 sản phẩm
            setProductsOnePiece(collected.slice(0, 8));
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnoughProductsOnePiece();
    }, []);
    // 
    const [productsDragonball, setProductsDragonball] = useState([]);
    const fetchEnoughProductsDragonball = async () => {
        let collected = [];
        let currentPage = 0;
        let hasMore = true;

        setLoading(true);

        try {
            while (collected.length < 8 && hasMore) {
                const response = await api.get('/productsAll', {
                    params: { page: currentPage, size }
                });

                const data = response.data;
                const filtered = data.content.filter(
                    (product) => product.categories?.name === "Mô hình DragonBall"
                );

                collected = [...collected, ...filtered];

                hasMore = currentPage < data.totalPages - 1;
                currentPage += 1;

                if (!hasMore) break; // hết trang rồi thì dừng
            }
            // Cắt đúng 8 sản phẩm
            setProductsDragonball(collected.slice(0, 8));
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnoughProductsDragonball();
    }, []);

    const [productsNaruto, setProductsNaruto] = useState([]);
    const fetchEnoughProductsNaruto = async () => {
        let collected = [];
        let currentPage = 0;
        let hasMore = true;

        setLoading(true);

        try {
            while (collected.length < 8 && hasMore) {
                const response = await api.get('/productsAll', {
                    params: { page: currentPage, size }
                });

                const data = response.data;
                const filtered = data.content.filter(
                    (product) => product.categories?.name === "Mô hình Naruto"
                );

                collected = [...collected, ...filtered];

                hasMore = currentPage < data.totalPages - 1;
                currentPage += 1;

                if (!hasMore) break; // hết trang rồi thì dừng
            }
            // Cắt đúng 8 sản phẩm
            setProductsNaruto(collected.slice(0, 8));
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnoughProductsNaruto();
    }, []);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index) => {
        setActiveIndex(index);
    };
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    // Hàm gọi API từ Spring Boot
    const fetchSaleProducts = async () => {
        try {
            setLoading(true);
            // Thay đổi URL này cho đúng với Server của bạn
            const response = await api.get('/productsSale');
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu:", err);
            setError("Không thể tải danh sách sản phẩm.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaleProducts();
    }, []);



    const scrollRef = useRef(null);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true); // Mặc định hiện nút phải

    // Hàm kiểm tra vị trí cuộn
    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // Hiện nút trái nếu đã cuộn sang phải > 5px
            setShowLeftBtn(scrollLeft > 5);

            // Ẩn nút phải nếu đã cuộn đến kịch bên phải
            // (scrollWidth - clientWidth) là khoảng cách cuộn tối đa
            setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    // Lắng nghe sự kiện cuộn sau khi component render
    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScrollPosition);
            // Kiểm tra lần đầu khi load trang
            checkScrollPosition();
        }
        return () => {
            if (currentRef) currentRef.removeEventListener('scroll', checkScrollPosition);
        };
    }, [products]); // Chạy lại nếu danh sách sản phẩm thay đổi

    const scroll = (direction) => {
        if (scrollRef.current) {
            const offset = direction === 'left' ? -scrollRef.current.offsetWidth : scrollRef.current.offsetWidth;
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };
    return (
        <div className="home">
            <main className="flash-sale-container" data-purpose="flash-sale-module">
                <header className="flash-sale-header">
                    <h2 className="flash-sale-title">
                        <svg className="lightning-icon" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                        Flash Sale
                    </h2>
                </header>

                <div className="carousel-wrapper">
                    {showLeftBtn && (
                        <button className="carousel-nav left" onClick={() => scroll('left')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                    )}
                    <section
                        className="product-grid"
                        ref={scrollRef}
                    >
                        {products.map((product, index) => (
                            <article key={index} className="product-card">
                                <div className="image-container">
                                    <img
                                        className="product-image"
                                        src={product.images?.[0]?.imageUrl || ''}
                                        alt={product.name}
                                    />
                                    
                                    <span className="discount-badge">-{product.sale.discountPercent}%</span>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title"
                                        onClick={() => {
                                            localStorage.setItem("productsId", product.id);
                                            localStorage.setItem("productImages", JSON.stringify(product.images || []));
                                            navigate(`/shopNemo/${slugify(product.name)}`);
                                        }}>{product.name}</h3>
                                    <div className="price-container">
                                        <span className="current-price">
                                            {(product.price * (1 - product.sale.discountPercent / 100)).toLocaleString('vi-VN')} đ
                                        </span>
                                        <span className="original-price">
                                            {product.price.toLocaleString('vi-VN')} đ
                                        </span>
                                        <span className="original-cart">
                                            <AddShoppingCartIcon />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>

                    {/* Nút bấm nằm ngoài product-grid */}
                    {showRightBtn && (
                        <button className="carousel-nav right" onClick={() => scroll('right')}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    )}
                </div>
            </main>
            <h1>Mô hình ONE PIECE</h1>
            <div className="flex-center">
                <div className="portfolio gallery gallery-container">
                    {loading ? (
                        <p> <CircularProgress disableShrink /></p>
                    ) : (
                        productsOnePiece.map((product, index) => {
                            // Lấy URL ảnh từ danh sách images (giả sử phần tử đầu tiên)
                            const displayImage = product.images && product.images.length > 0
                                ? product.images[0].imageUrl
                                : null;

                            return (
                                <div className="item" key={index}>
                                    <div className="thumb" style={{ position: "relative" }}>
                                        <a className="category">{product.categories.name}</a>

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

                                        {product.status === "Hết hàng" && (
                                            <div style={{
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
                                            }}>
                                                ❌ Hết hàng
                                            </div>
                                        )}
                                    </div>

                                    <div className="text">
                                        <h3>
                                            <a onClick={() => {
                                                localStorage.setItem("productsId", product.id);
                                                localStorage.setItem("productImages", JSON.stringify(product.images || []));
                                                navigate(`/shopNemo/${slugify(product.name)}`);
                                            }}>
                                                {product.name}
                                            </a>
                                        </h3>

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
                        })
                    )}

                </div>
            </div>
            <hr></hr>
            <h1>Mô hình NARUTO</h1>


            <div className="flex-center">
                <div className="portfolio gallery gallery-container">
                    {loading ? (
                        <p> <CircularProgress disableShrink /></p>
                    ) : (
                        productsNaruto.map((product, index) => {
                            // Lấy URL ảnh từ danh sách images (giả sử phần tử đầu tiên)
                            const displayImage = product.images && product.images.length > 0
                                ? product.images[0].imageUrl
                                : null;

                            return (
                                <div className="item" key={index}>
                                    <div className="thumb" style={{ position: "relative" }}>
                                        <a className="category">{product.categories.name}</a>

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

                                        {product.status === "Hết hàng" && (
                                            <div style={{
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
                                            }}>
                                                ❌ Hết hàng
                                            </div>
                                        )}
                                    </div>

                                    <div className="text">
                                        <h3>
                                            <a onClick={() => {
                                                localStorage.setItem("productsId", product.id);
                                                localStorage.setItem("productImages", JSON.stringify(product.images || []));
                                                navigate(`/shopNemo/${slugify(product.name)}`);
                                            }}>
                                                {product.name}
                                            </a>
                                        </h3>

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
                        })
                    )}

                </div>
            </div>
            <hr></hr>
            <h1>Mô hình DRAGONBALL </h1>
            <div className="flex-center">
                <div className="portfolio gallery gallery-container">
                    {loading ? (
                        <p> <CircularProgress disableShrink /></p>
                    ) : (
                        productsDragonball.map((product, index) => {
                            // Lấy URL ảnh từ danh sách images (giả sử phần tử đầu tiên)
                            const displayImage = product.images && product.images.length > 0
                                ? product.images[0].imageUrl
                                : null;

                            return (
                                <div className="item" key={index}>
                                    <div className="thumb" style={{ position: "relative" }}>
                                        <a className="category">{product.categories.name}</a>

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

                                        {product.status === "Hết hàng" && (
                                            <div style={{
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
                                            }}>
                                                ❌ Hết hàng
                                            </div>
                                        )}
                                    </div>

                                    <div className="text">
                                        <h3>
                                            <a onClick={() => {
                                                localStorage.setItem("productsId", product.id);
                                                localStorage.setItem("productImages", JSON.stringify(product.images || []));
                                                navigate(`/shopNemo/${slugify(product.name)}`);
                                            }}>
                                                {product.name}
                                            </a>
                                        </h3>

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
                        })
                    )}

                </div>
            </div>

        </div>
    )
}
export default Home;