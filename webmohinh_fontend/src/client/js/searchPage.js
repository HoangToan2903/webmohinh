import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../axiosConfig';
import Navbar from './navbar'
import Footer from './footer'
import slugify from "./utils/slugify";
import { useNavigate } from 'react-router-dom';
import { addToCart, resizeImageToBase64, base64ToFile } from './addCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';


const SearchPage = () => {
    useEffect(() => {
        import('../css/home.css');

    }, []);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                // ĐỔI URL NÀY CHO KHỚP VỚI BACKEND CỦA BẠN
                const response = await api.get(`/products/search-suggestions?name=${query}`);

                // Nếu backend trả về mảng trực tiếp:
                setProducts(Array.isArray(response.data) ? response.data : []);

            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Có {products.length} kết quả tìm kiếm với từ khóa "{query}":
                </h2>
                <hr style={{ margin: '20px 0', border: '0.5px solid #ddd' }} />

                <div className="portfolio gallery gallery-container">
                    {products.map((product, index) => (
                        <article key={index} className="product-card">
                            <div className="image-container">
                                <img
                                    className="product-image"
                                    src={product.images?.[0]?.imageUrl || ''}
                                    alt={product.name}
                                />
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
                                {/* <span className="discount-badge">-{product.sale.discountPercent}%</span> */}
                            </div>
                            <div className="product-info">
                                <h3 className="product-title"
                                    onClick={() => {
                                        localStorage.setItem("productsId", product.id);
                                        localStorage.setItem("productImages", JSON.stringify(product.images || []));
                                        navigate(`/shopNemo/${slugify(product.name)}`);
                                    }}>
                                    {product.name}
                                </h3>
                                <div className="price-container">
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
                                    {product.status === "Hết hàng" ? (
                                        <span className="out-of-stock-label"></span>
                                    ) : (
                                        <a className="original-cart"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    let displayImage = product.images?.[0]?.imageUrl || displayImage || 'URL_ANH_MAC_DINH_CUA_BAN';
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
                                            }}>
                                            <AddShoppingCartIcon />
                                        </a>
                                    )}

                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
            <Footer />
        </div>

    );
};

export default SearchPage;