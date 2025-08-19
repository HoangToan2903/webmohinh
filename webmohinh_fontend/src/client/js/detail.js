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
                .then((res) => res.json())
                .then((data) => {
                    setProduct(data);

                    // Lưu categories.name vào state để dùng sau
                    if (data.categories?.name) {
                        setCategoryName(data.categories.name);
                    }

                    // Nếu có ảnh base64 thì set
                    if (data.imageBase64List?.length) {
                        const imgs = data.imageBase64List.map((b64) => ({
                            data_url: `data:image/jpeg;base64,${b64}`,
                        }));
                        setImages(imgs); // giả sử bạn đã khai báo setImages
                        setDefaultImageIndex(0); // giả sử bạn có index
                    }
                })
                .catch((err) => console.error(err));
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
    if (!product) return <p>Đang tải...</p>;



    return (
        <div>
            <Navbar />
            <br></br>

            <div className='container_detail'>
                <div className="breadcrumb">
                    <Link style={{ color: "#555" }} to="/home" >Trang chủ</Link>  / {product.categories.name}
                </div>
                <div class="grid-container" id="product-section">
                    <div class="grid-item">
                        <div className="uploader-wrapper">
                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onChange}
                                // maxNumber={maxNumber}
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

                                            </div>
                                        )}
                                        <div className="thumbs-container">
                                            {imageList.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className={`thum ${index === defaultImageIndex ? 'active' : ''}`}
                                                    onClick={() => setAsDefault(index)}
                                                >
                                                    <img src={image.data_url} alt="" />
                                                </div>
                                            ))}

                                        </div>
                                    </>
                                )}
                            </ImageUploading>
                        </div>
                    </div>
                    <div className="vertical-line"></div>
                    <div class="grid-item">
                        <div className="content">
                            <h1>{product.name}</h1>
                            <div className="horizontal-line"></div>
                            <br />

                            <b style={{ fontSize: '24px' }}>
                                {!product.sale?.id ? (
                                    <p>{Number(product.price).toLocaleString('vi-VN')} đ</p>
                                ) : (
                                    <p>
                                        <del style={{ color: 'gray', marginRight: '8px' }}>
                                            {Number(product.price).toLocaleString('vi-VN')} đ
                                        </del>
                                        <strong>
                                            {Number(product.price - (product.price * (product.sale?.discountPercent / 100))).toLocaleString('vi-VN')} đ
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
                                            const base64Image =
                                                Array.isArray(product.imageBase64List) && typeof product.imageBase64List[0] === "string"
                                                    ? `data:image/jpeg;base64,${product.imageBase64List[0]}`
                                                    : null;

                                            if (!base64Image) {
                                                alert("Không có ảnh để thêm vào giỏ.");
                                                return;
                                            }

                                            const file = base64ToFile(base64Image);
                                            const resizedImage = await resizeImageToBase64(file);

                                            const finalPrice = product.sale?.id
                                                ? product.price - (product.price * (product.sale.discountPercent / 100))
                                                : product.price;

                                            addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: finalPrice,
                                                image: resizedImage,
                                                quantity: quantity,
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
                <div class="grid-container">
                    <div class="grid-item">
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
                                <p>với đơn hàng từ 1.000.000đ trở lên</p>
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
                    <div class="grid-item">
                        <b style={{ fontSize: "19px" }}> Sản phẩm liên quan</b>
                        <div className="horizontal-line"></div>
                        {Array.isArray(productsOnePiece) &&
                            productsOnePiece.map((product, index) => (
                                <div key={index}>
                                    <div style={{ marginBottom: '10px' }}>
                                        {Array.isArray(product.imageBase64List) && product.imageBase64List.length > 0 ? (
                                            <img
                                                style={{
                                                    height: '80px',
                                                    width: '60px',
                                                    objectFit: 'cover',
                                                    display: 'inline-block',
                                                    verticalAlign: 'middle',
                                                }}
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

                                            <p>  {!product.sale?.id ? (
                                                <p>{Number(product.price).toLocaleString('vi-VN')} đ</p>
                                            ) : (
                                                <p>
                                                    <del style={{ color: 'gray', marginRight: '8px' }}>
                                                        {Number(product.price).toLocaleString('vi-VN')} đ
                                                    </del>
                                                    <strong>
                                                        {Number(product.price - (product.price * (product.sale?.discountPercent / 100))).toLocaleString('vi-VN')} đ
                                                    </strong>
                                                </p>)
                                            }</p>
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
                    {Array.isArray(product.imageBase64List) && product.imageBase64List.length > 0 ? (
                        <img
                            style={{
                                height: '80px',
                                width: '70px',
                                objectFit: 'cover',
                            }}
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

                    <div style={{ marginLeft: '20px' }}>
                        <b style={{ color: '#e74c3c' }}>{product.name}</b>
                        <p>  {!product.sale?.id ? (
                            <p>{Number(product.price).toLocaleString('vi-VN')} đ</p>
                        ) : (
                            <p>
                                <del style={{ color: 'gray', marginRight: '8px' }}>
                                    {Number(product.price).toLocaleString('vi-VN')} đ
                                </del>
                                <strong>
                                    {Number(product.price - (product.price * (product.sale?.discountPercent / 100))).toLocaleString('vi-VN')} đ
                                </strong>
                            </p>)
                        }</p>
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
                            <a href="#" className="view">
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