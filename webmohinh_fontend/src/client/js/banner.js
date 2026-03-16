import React, { useState, useEffect, useRef } from 'react';
import api from '../../axiosConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import slugify from "./utils/slugify";
import { useNavigate } from 'react-router-dom';

function Banner() {
    const bannerData = [
        { id: 1, url: "https://khomohinh.com/wp-content/uploads/2022/08/OnePiece-1-1320x438.jpg.webp", alt: "One Piece Banner 1" },
        { id: 2, url: "https://khomohinh.com/wp-content/uploads/2022/08/naruto-1320x438.jpg.webp", alt: "Gameprize tháng 6/2025" },
        { id: 3, url: "https://khomohinh.com/wp-content/uploads/2022/08/DB_final-1320x438.jpg.webp", alt: "Sự kiện mới" },
    ];
    const [page, setPage] = useState(0); // page = 0 is first page
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categoryAll', {
                params: { page, size }
            });

            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, size]);
    const [currentIndex, setCurrentIndex] = useState(0);


    return (
        <div className="banner-wrapper">
            <div className="top-content" data-purpose="main-hero-area">
                <section className="hero-banner-container">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true }} // Thay thế cho div banner-dots thủ công của bạn
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="mySwiper"
                    >
                        {bannerData.map((banner) => (
                            <SwiperSlide key={banner.id}>
                                <img
                                    src={banner.url}
                                    alt={banner.alt}
                                    className="banner-image"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </section>

                <aside className="news-section" data-purpose="sidebar-news-list">
                    <h2 className="news-header">TIN TỨC</h2>
                    {/* Bạn có thể map qua một array news ở đây nếu muốn code gọn hơn */}
                    {[4, 5, 6].map((id, index) => (
                        <a key={id} className="news-item" href="#news">
                            <div className="news-thumb">
                                <img alt="news" src={`http://googleusercontent.com/profile/picture/${id}`} />
                            </div>
                            <div className="news-info">
                                <h3 className="news-title">
                                    {index === 0 && "[FURYU] LỊCH PHÁT HÀNH MÔ HÌNH GAMEPRIZE..."}
                                    {index === 1 && "[TAITO] LỊCH PHÁT HÀNH MÔ HÌNH GAMEPRIZE..."}
                                    {index === 2 && "[ICHIBAN KUJI] LỊCH PHÁT HÀNH MÔ HÌNH..."}
                                </h3>
                                <span className="news-date">09/05/2025</span>
                            </div>
                        </a>
                    ))}
                </aside>
            </div>

            <section className="series-section" data-purpose="series-categories">
                <h2 className="series-header">SERIES NỔI BẬT</h2>
                <div className="series-grid" >
                    {/* Kiểm tra nếu categories tồn tại và có phần tử mới render */}
                    {categories.map((item) => (
                        <div
                            key={item.id}
                            className="series-item"
                            style={{ cursor: 'pointer' }} // Thêm trỏ chuột để người dùng biết có thể click
                            onClick={() => {
                                localStorage.setItem('categoryId', item.id);
                                navigate(`/collections/${slugify(item.name)}`);
                            }}
                        >
                            <div className="series-icon" style={{ width: '100px', height: '100px', overflow: 'hidden', borderRadius: '20px' }}>
                                <img
                                    src={item.image || 'https://via.placeholder.com/300'}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                            <span className="series-name">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* Gợi ý thêm: Phần phân trang (Pagination) nếu bạn muốn dùng totalPages */}
            </section>
        </div>
    );
}



export default Banner;