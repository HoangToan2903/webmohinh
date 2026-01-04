import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import slugify from "./utils/slugify";
import { addToCart, resizeImageToBase64, base64ToFile } from './addCart';
import CircularProgress from '@mui/material/CircularProgress';

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
                const response = await axios.get('http://localhost:8080/website/productsAll', {
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
                const response = await axios.get('http://localhost:8080/website/productsAll', {
                    params: { page: currentPage, size }
                });

                const data = response.data;
                const filtered = data.content.filter(
                    (product) => product.categories?.name === "Mô hình Dragon Ball"
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

    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index) => {
        setActiveIndex(index);
    };
    const navigate = useNavigate();

    return (
        <div className="home">
            <h1>Mô hình ONE PIECE</h1>
            <div className="flex-center">
                <div className="portfolio gallery gallery-container">
                    {loading ? (
                        <p> <CircularProgress disableShrink /></p>
                    ) : (
                        productsOnePiece.map((product, index) => {
                            const base64Image =
                                Array.isArray(product.imageBase64List) && typeof product.imageBase64List[0] === "string"
                                    ? `data:image/jpeg;base64,${product.imageBase64List[0]}`
                                    : null;

                            return (
                                <div className="item" key={index}>
                                    <div className="thumb" style={{ position: "relative" }}>
                                        <a className="category">{product.categories.name}</a>

                                        {base64Image ? (
                                            <img
                                                style={{ objectFit: "cover" }}
                                                src={base64Image}
                                                alt="Product"
                                            />
                                        ) : (
                                            <div style={{ height: "80px", width: "60px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#999" }}>
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
                                                <strong>
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
                                                        if (!base64Image) {
                                                            alert("Không có ảnh để thêm vào giỏ.");
                                                            return;
                                                        }

                                                        const file = base64ToFile(base64Image);
                                                        const resizedImage = await resizeImageToBase64(file);

                                                        const finalPrice =
                                                            product.sale?.id && product.sale?.status === 1
                                                                ? product.price - (product.price * (product.sale.discountPercent / 100))
                                                                : product.price;


                                                        addToCart({
                                                            id: product.id,
                                                            name: product.name,
                                                            price: finalPrice,
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
                        })
                    )}

                </div>
            </div>
            <hr></hr>
            <h1>Mô hình NARUTO</h1>
            <div className="flex-center">
                <div className="portfolio gallery gallery-container">
                    <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://mohinhfigure.com/wp-content/uploads/2025/04/mo-hinh-onepiece-luffy-gear-5-trang-thai-chien-dau-cao-19cm-nang-300gram-figure-one-piece-hop-mau-1-510x510.webp" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div>
                    <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://i.ibb.co/SvXbL1L/astronaut.jpg" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div>
                    <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://i.ibb.co/SvXbL1L/astronaut.jpg" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div> <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://i.ibb.co/SvXbL1L/astronaut.jpg" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div> <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://i.ibb.co/SvXbL1L/astronaut.jpg" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div> <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://i.ibb.co/SvXbL1L/astronaut.jpg" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div> <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://i.ibb.co/SvXbL1L/astronaut.jpg" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div> <div className="item">
                        <div className="thumb">
                            <a className="category">3D Render</a>
                            {/* <a href="https://i.ibb.co/SvXbL1L/astronaut.jpg" className="galleryimage">
                                <span className="fa-solid fa-plus"></span>
                            </a> */}
                            <img src="https://i.ibb.co/SvXbL1L/astronaut.jpg" alt="" />
                        </div>
                        <div className="text">
                            <h3><a >Astronaut 3D</a></h3>
                            <p>It's a Photo from Unsplash.</p>
                            <a href="#" className="view">Thêm vào giỏ hàng<span className="fa-solid fa-angle-right"></span></a>
                        </div>
                    </div>
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
                            const base64Image =
                                Array.isArray(product.imageBase64List) && typeof product.imageBase64List[0] === "string"
                                    ? `data:image/jpeg;base64,${product.imageBase64List[0]}`
                                    : null;

                            return (
                                <div className="item" key={index}>
                                    <div className="thumb" style={{ position: "relative" }}>
                                        <a className="category">{product.categories.name}</a>

                                        {base64Image ? (
                                            <img
                                                style={{ objectFit: "cover" }}
                                                src={base64Image}
                                                alt="Product"
                                            />
                                        ) : (
                                            <div style={{ height: "80px", width: "60px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#999" }}>
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
                                                <strong>
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
                                                        if (!base64Image) {
                                                            alert("Không có ảnh để thêm vào giỏ.");
                                                            return;
                                                        }

                                                        const file = base64ToFile(base64Image);
                                                        const resizedImage = await resizeImageToBase64(file);
                                                        const finalPrice =
                                                            product.sale?.id && product.sale?.status === 1
                                                                ? product.price - (product.price * (product.sale.discountPercent / 100))
                                                                : product.price;
                                                        addToCart({
                                                            id: product.id,
                                                            name: product.name,
                                                            price: finalPrice,
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
                        })
                    )}

                </div>

            </div>
            <hr></hr>
            <h1>MÔ HÌNH HOT CỦA NEMO SHOP </h1>
            <div className="container">
                <div className="slider">
                    <ul>
                        {Array.isArray(productsOnePiece) &&
                            productsOnePiece.map((product, index) => (
                                <li key={index}>
                                    <input type="radio" name="slide" defaultChecked />
                                    <div className="slide">
                                        <div className="left left-face">
                                            {Array.isArray(product.imageBase64List) && product.imageBase64List.length > 0 ? (
                                                <img
                                                    style={{ objectFit: 'cover' }}
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
                                        </div>
                                        <div className="right right-face">
                                            <div className="content">
                                                <h1><a onClick={() => {
                                                    localStorage.setItem('productsId', product.id);

                                                    // Lưu danh sách ảnh (giả sử là mảng URL)
                                                    localStorage.setItem('productImages', JSON.stringify(product.images || []));

                                                    navigate(`/shopNemo/${slugify(product.name)}`);
                                                }}
                                                >{product.name}</a></h1>
                                                <br></br>
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
                                                        </p>)
                                                    }</b><br></br>

                                                <p>✅Tên nhân vật: {product.character_name} </p><br></br>
                                                <p>✅Chiều rộng: {product.width} cm</p><br></br>
                                                <p>✅Chiều cao: {product.height} cm</p><br></br>
                                                <p>✅Trọng lượng: {product.weight} kg</p><br></br>
                                                <p>✅Chất liệu: {product.material}</p>
                                                <hr></hr>
                                                Mã code: {product.product_code} <br></br>
                                                Danh mục: <a>{product.categories.name}</a> <br></br>
                                                Tag: {product.tags.map((tag, index) => (
                                                    <span key={index}>
                                                        <a href="#">{tag}</a>{index < product.tags.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>


        </div>
    )
}
export default Home;