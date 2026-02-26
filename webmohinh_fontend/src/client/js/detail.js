import Navbar from './navbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUploading from 'react-images-uploading';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import ship from '../image/ship.png';
import hoatoc from '../image/hoatoc.png';
import toanquoc from '../image/toanquoc.png';
import lienhe from '../image/lienhe.png';
import Footer from './footer'
import { useNavigate } from 'react-router-dom';
import slugify from "./utils/slugify";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useLocation } from "react-router-dom";
import { addToCart, resizeImageToBase64, base64ToFile } from './addCart';
import CircularProgress from '@mui/material/CircularProgress';
import { Avatar } from '@mui/material';

function Detail() {
    useEffect(() => {
        import('../css/home.css');

    }, []);
    const navigate = useNavigate();

    // lấy id
    const [product, setProduct] = useState(null);
    const [categoryName, setCategoryName] = useState(null);
    useEffect(() => {
        const productId = localStorage.getItem("productsId");

        if (productId) {
            fetch(`http://localhost:8080/website/products/${productId}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
                    return res.json();
                })
                .then((data) => {
                    // Lưu toàn bộ thông tin sản phẩm (name, price, description...)
                    setProduct(data);
                    if (data.categories?.name) {
                        setCategoryName(data.categories.name);
                    }

                    // Xử lý danh sách hình ảnh từ List<ProductImage>
                    if (data.images && data.images.length > 0) {
                        const formattedImages = data.images.map((imgObj) => ({
                            // React-images-uploading yêu cầu key 'data_url' để hiển thị preview
                            // Ta gán imageUrl từ Backend vào data_url
                            data_url: imgObj.imageUrl
                        }));

                        setImages(formattedImages);
                        setDefaultImageIndex(0); // Mặc định hiển thị ảnh đầu tiên
                    }
                })
                .catch((err) => console.error("Lỗi lấy dữ liệu:", err));
        }
    }, []);


    const [images, setImages] = useState([]);
    const [defaultImageIndex, setDefaultImageIndex] = useState(null);

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    const setAsDefault = (index) => {
        setDefaultImageIndex(index);
    };

    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };



    const [loading, setLoading] = useState(false);
    const size = 10; // giữ nguyên mỗi lần gọi lấy 10 sản phẩm

    const [productsOnePiece, setProductsOnePiece] = useState([]);
    useEffect(() => {
        if (!categoryName) return;

        const fetchEnoughProducts = async () => {
            let collected = [];
            let currentPage = 0;
            let hasMore = true;

            setLoading(true);

            try {
                while (collected.length < 8 && hasMore) {
                    const response = await axios.get("http://localhost:8080/website/productsAll", {
                        params: { page: currentPage, size },
                    });

                    const data = response.data;
                    console.log(data)
                    const filtered = data.content.filter(
                        (p) => p.categories?.name === categoryName
                    );

                    collected = [...collected, ...filtered];

                    hasMore = currentPage < data.totalPages - 1;
                    currentPage += 1;
                }

                setProductsOnePiece(collected.slice(0, 8));
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnoughProducts();
    }, [categoryName]); // chạy khi categoryName có giá trị

    // load navbar
    const [showNavbar, setShowNavbar] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            const scrollPercent = (scrollY + windowHeight) / fullHeight;

            if (scrollY === 0) {
                setShowNavbar(false);
            } else {
                setShowNavbar(scrollPercent >= 0.6);
            }
        };

        handleScroll(); // Gọi ngay khi mount

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);       // reset scroll khi đổi trang
        setShowNavbar(false);        // ẩn navbar
    }, [location.pathname]);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Cuộn mượt
        });
    };
    if (!product)
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',   // hoặc 100vh nếu muốn giữa toàn trang
                }}
            >
                <CircularProgress disableShrink />
            </div>
        );



    return (
        <div>
            <Navbar />
            <br></br>

            <div className='container_detail'>
                <div className="breadcrumb">
                    <Link style={{ color: "#555" }} to="/home" >Trang chủ</Link>  / {product.categories.name}
                </div>
                <div className="grid-container" id="product-section">
                    <div className="grid-item">
                        <div className="uploader-wrapper">
                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onChange}
                                dataURLKey="data_url"
                            >
                                {({ imageList }) => (
                                    <div className="product-image-section">

                                        {/* 1. KHUNG ẢNH CHÍNH (PREVIEW) */}
                                        <div className="main-preview-box" style={{ width: '100%', marginBottom: '15px' }}>
                                            {imageList.length > 0 ? (
                                                <img
                                                    src={imageList[defaultImageIndex]?.data_url || imageList[0]?.data_url}
                                                    alt="Sản phẩm chính"
                                                    style={{
                                                        width: '100%',
                                                        height: '450px',
                                                        objectFit: 'contain',
                                                        border: '1px solid #f0f0f0',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{ height: '450px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <p>Chưa có hình ảnh sản phẩm</p>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className="thumbnails-grid"
                                            style={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center', // Căn giữa các item theo chiều ngang
                                                alignItems: 'center',     // Căn giữa các item theo chiều dọc (nếu cần)
                                                marginTop: '15px'         // Khoảng cách với ảnh chính phía trên
                                            }}
                                        >
                                            {imageList.map((image, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setDefaultImageIndex(index)}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        cursor: 'pointer',
                                                        border: index === defaultImageIndex ? '2px solid #ee4d2d' : '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                        transition: 'all 0.2s ease' // Thêm hiệu ứng mượt khi chọn
                                                    }}
                                                >
                                                    <img
                                                        src={image.data_url}
                                                        alt={`Thumb ${index}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ImageUploading>
                        </div>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="grid-item">
                        <div className="content">
                            <h1>{product.name}</h1>
                            <div className="horizontal-line"></div>
                            <br />

                            <b style={{ fontSize: '24px' }}>
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

                            </b>

                            <br />
                            <p>✅Tên nhân vật: {product.character_name}</p><br />
                            <p>✅Chiều rộng: {product.width} cm</p><br />
                            <p>✅Chiều cao: {product.height} cm</p><br />
                            <p>✅Trọng lượng: {product.weight} kg</p><br />

                            <br />
                            <div style={styles.container}>
                                <div style={styles.quantityBox}>
                                    <button onClick={handleDecrease} style={styles.button}>−</button>
                                    <div style={styles.value}>{quantity}</div>
                                    <button onClick={handleIncrease} style={styles.button}>＋</button>
                                </div>
                            </div>
                            <br />

                            {product.status !== "Hết hàng" && (
                                <a
                                    href="#"
                                    className="view"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        try {
                                            // Lấy ảnh ưu tiên theo thứ tự: 
                                            // 1. Link Cloudinary (imageUrl) -> 2. Chuỗi Base64
                                            const rawImage = product.imageUrls?.[0] || product.imageBase64List?.[0] || null;

                                            if (!rawImage) {
                                                alert("Không có ảnh để thêm vào giỏ.");
                                                return;
                                            }

                                            let imageToSave = rawImage;

                                            // Nếu là Base64 thì mới cần thêm prefix và resize
                                            if (!rawImage.startsWith('http')) {
                                                const base64WithPrefix = rawImage.startsWith('data:image')
                                                    ? rawImage
                                                    : `data:image/jpeg;base64,${rawImage}`;
                                                const file = base64ToFile(base64WithPrefix);
                                                imageToSave = await resizeImageToBase64(file, 100, 100, 0.7);
                                            }
                                            const finalPrice = product.sale?.id && product.sale?.status === 1
                                                ? product.price - (product.price * (product.sale.discountPercent / 100))
                                                : product.price;

                                            addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: finalPrice,
                                                image: imageToSave, // Giờ đã có giá trị là URL hoặc Base64 nén
                                                quantity: quantity || 1,
                                            });

                                            alert("Đã thêm vào giỏ hàng!");
                                        } catch (error) {
                                            alert("Lỗi xử lý ảnh: " + error.message);
                                        }
                                    }}
                                >
                                    Thêm vào giỏ hàng <span className="fa-solid fa-angle-right"></span>
                                </a>
                            )}

                            <hr />
                            Mã code: {product.product_code} <br />
                            Danh mục: <a>{product.categories.name}</a> <br />
                            Tag: {product.tags.map((tag, index) => (
                                <span key={index}>
                                    <a href="#">{tag}</a>{index < product.tags.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>

                    </div>
                </div>
                <hr></hr>
                <div className="grid-container">
                    <div className="grid-item">
                        <b style={{ fontSize: "19px" }}>Đặc tả </b>
                        <div className="horizontal-line"></div>
                        <p>✅Chất liệu: {product.material} </p><br></br>
                        <p>✅Mục đích: Trang trí văn phòng, bàn làm việc, sưu tầm, trưng bày, quà tặng,…</p><br></br>
                        <p>✅Kiểu giao hàng: Giao ngay/order</p><br></br>
                        <p>✅Kiểu: {product.type} </p><br></br>
                        <p>✅Nhà sản xuất: {product.producer.name} </p><br></br>
                        <p>✅Mô tả: {product.description} </p><br></br>
                        <p>- - - - - - - - - - - - - - - - - - - - - - - - - - </p><br></br>
                        <b style={{ fontSize: "19px" }}> Mua hàng tại NemoShop</b>

                        <div className="horizontal-line"></div>

                        <div>
                            <img src={ship} alt="Ship" style={{ width: '70px', display: 'inline-block', verticalAlign: 'middle' }} />
                            <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '20px' }}>
                                <b>Giao hàng miễn phí</b>
                                <p>với đơn hàng từ 3.000.000đ trở lên</p>
                            </div>
                        </div>
                        <br>
                        </br>
                        <div>
                            <img src={toanquoc} alt="" style={{ width: '70px', display: 'inline-block', verticalAlign: 'middle' }} />
                            <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '20px' }}>
                                <b>Giao hàng trên toàn quốc</b>
                                <p>63 tỉnh thành</p>
                            </div>
                        </div>
                        <br>
                        </br>
                        <div>
                            <img src={hoatoc} alt="" style={{ width: '70px', display: 'inline-block', verticalAlign: 'middle' }} />
                            <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '20px' }}>
                                <b>Hoàn tiền lại 100%</b>
                                <p>Nếu hàng hóa bị gặp lỗi</p>
                            </div>
                        </div>
                        <br>
                        </br>
                        <div>
                            <img src={lienhe} alt="" style={{ width: '70px', display: 'inline-block', verticalAlign: 'middle' }} />
                            <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '20px' }}>
                                <b>Hotline hỗ trợ</b>
                                <p>0337.128.389</p>
                            </div>
                        </div>
                    </div>
                    <div className="vertical-line"></div>
                    <div className="grid-item">
                        <b style={{ fontSize: "19px" }}> Sản phẩm liên quan</b>
                        <div className="horizontal-line"></div>
                        {Array.isArray(productsOnePiece) &&
                            productsOnePiece.map((product, index) => (
                                <div key={index}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <Avatar
                                            variant="rounded"
                                            src={product.images?.[0]?.imageUrl || ''}
                                            style={{
                                                height: '80px',
                                                width: '60px',
                                                objectFit: 'cover',
                                                display: 'inline-block',
                                                verticalAlign: 'middle',
                                            }}
                                        >N/A</Avatar>
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                verticalAlign: 'middle',
                                                marginLeft: '20px',
                                            }}
                                        >
                                            <a
                                                style={{ color: '#e74c3c', cursor: "pointer" }}
                                                onClick={() => {
                                                    localStorage.setItem('productsId', product.id);
                                                    localStorage.setItem('productImages', JSON.stringify(product.images || []));

                                                    // Chuyển trang và reload
                                                    window.location.href = `/shopNemo/${slugify(product.name)}`;
                                                }}
                                            >
                                                {product.name}
                                            </a>

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

                                        </div>
                                    </div>
                                    {index < productsOnePiece.length - 1 && (
                                        <hr style={{ width: '100px', border: 'none', borderTop: '1px solid #ccc', margin: '10px 5px' }} />
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <br></br>
            <Footer />
            <nav
                className={`bottom-navbar ${showNavbar ? "visible" : "hidden"}`}
                style={{ display: 'flex', alignItems: 'center', padding: '10px 20px' }}
            >                {/* Nội dung căn giữa */}
                <div className='nav-products' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    {/* Kiểm tra mảng imageUrls từ Backend DTO */}
                    {product.images && product.images.length > 0 ? (
                        <Avatar
                            variant="rounded"
                            src={product.images[0].imageUrl} // Lấy trực tiếp imageUrl từ ProductImage
                            sx={{
                                width: 60,
                                height: 60,
                                border: '1px solid #f0f0f0'
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                height: '60px',  // Đồng bộ lại 60px cho khớp với Avatar sx
                                width: '60px',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                color: '#999',
                                borderRadius: '4px',
                                border: '1px solid #eee',
                                textAlign: 'center'
                            }}
                        >
                            No image
                        </div>
                    )}

                    <div style={{ marginLeft: '20px' }}>
                        {/* Tên sản phẩm */}
                        <b style={{ color: '#e74c3c', display: 'block', marginBottom: '5px' }}>
                            {product.name}
                        </b>

                        {/* PHẦN GIÁ: Thay thẻ <p> ngoài cùng bằng <div> để hết lỗi nội lồng nhau */}
                        <div style={{ fontSize: '14px' }}>
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
                        </div>
                    </div>

                    <div style={{ marginLeft: '20px' }}>
                        <div style={styles.container}>
                            <div style={styles.quantityBox}>
                                <button onClick={handleDecrease} style={styles.button}>−</button>
                                <div style={styles.value}>{quantity}</div>
                                <button onClick={handleIncrease} style={styles.button}>＋</button>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginLeft: '20px' }}>
                        {product.status !== "Hết hàng" && (

                            <a href="#" className="view"
                                onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                        // Lấy ảnh ưu tiên theo thứ tự: 
                                        // 1. Link Cloudinary (imageUrl) -> 2. Chuỗi Base64
                                        const rawImage = product.imageUrls?.[0] || product.imageBase64List?.[0] || null;

                                        if (!rawImage) {
                                            alert("Không có ảnh để thêm vào giỏ.");
                                            return;
                                        }

                                        let imageToSave = rawImage;

                                        // Nếu là Base64 thì mới cần thêm prefix và resize
                                        if (!rawImage.startsWith('http')) {
                                            const base64WithPrefix = rawImage.startsWith('data:image')
                                                ? rawImage
                                                : `data:image/jpeg;base64,${rawImage}`;
                                            const file = base64ToFile(base64WithPrefix);
                                            imageToSave = await resizeImageToBase64(file, 100, 100, 0.7);
                                        }
                                        const finalPrice = product.sale?.id && product.sale?.status === 1
                                            ? product.price - (product.price * (product.sale.discountPercent / 100))
                                            : product.price;

                                        addToCart({
                                            id: product.id,
                                            name: product.name,
                                            price: finalPrice,
                                            image: imageToSave, // Giờ đã có giá trị là URL hoặc Base64 nén
                                            quantity: quantity || 1,
                                        });

                                        alert("Đã thêm vào giỏ hàng!");
                                    } catch (error) {
                                        alert("Lỗi xử lý ảnh: " + error.message);
                                    }
                                }}>
                                Thêm vào giỏ hàng <span className="fa-solid fa-angle-right"></span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Nút scroll nằm bên phải */}
                <div style={{ marginLeft: 'auto' }}>
                    <div
                        onClick={scrollToTop}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            backgroundColor: "#e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <ArrowUpwardIcon />
                    </div>
                </div>
            </nav>


        </div>
    )
}
const styles = {
    container: {
        // height: '100vh',
        // backgroundColor: '#e3e2e0',
        display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        fontFamily: 'sans-serif'
    },
    title: {
        marginBottom: '20px',
        color: '#333'
    },
    quantityBox: {
        display: 'flex',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '40px',
        height: '50px',
        border: 'none',
        backgroundColor: '#f7f7f7',
        fontSize: '24px',
        cursor: 'pointer',
        outline: 'none',
    },
    value: {
        width: '40px',
        height: '40px',
        lineHeight: '40px',
        textAlign: 'center',
        fontSize: '18px',
        backgroundColor: '#fff',
        // fontWeight: 'bold',
        userSelect: 'none'
    }
};

export default Detail;