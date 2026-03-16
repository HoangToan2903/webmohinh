import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig';
import slugify from "./utils/slugify";

function Navbar2() {

    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => {
            // Nếu cuộn quá 100px thì bắt đầu sticky (bạn có thể điều chỉnh số này)
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function để tránh rò rỉ bộ nhớ
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Đóng menu khi click ra ngoài màn hình
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Lấy tên user từ localStorage
    const [username, setUsername] = useState(sessionStorage.getItem('username'));
    const [email, setEmail] = useState(sessionStorage.getItem('userEmail'));
    const [userId, setUserId] = useState(sessionStorage.getItem('idUser'));

    // console.log(username, email)

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('id');  // Xóa thông tin khi đăng xuất
        setUsername(null);
        setUserId(null);
        setEmail(null);
        navigate('/login');
    };

    const [page, setPage] = useState(0); // page = 0 is first page
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);

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
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef(null);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const [refresh, setRefresh] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const handleClick = (index) => {
        setActiveIndex(index);
    };
    return (
        <header className={`main-header ${isSticky ? 'sticky' : ''}`} data-purpose="site-header">
            <div className="container">
                <div className="header-top-row" data-purpose="header-top-branding">
                    <a className="logo-container" href="/" title="M Figure Homepage">
                        <div className="logo-circle">
                            <img className="logo-icon" src="/logo.png" />
                        </div>
                        <span onClick={(e) => {
                            e.preventDefault();
                            handleClick(0);
                            navigate('/home');
                        }} className="logo-text">NEMO SHOP</span>
                    </a>
                    <div className="search-wrapper" data-purpose="site-search">
                        <input aria-label="Search" className="search-input" placeholder="Từ khoá..." type="text" />
                        <button aria-label="Submit Search" className="search-icon-btn">
                            <svg
                                fill="none"
                                height="20"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="20"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="header-info-group">
                        <div className="info-item">
                            <div className="icon-box">
                                <svg className="icon-svg" viewBox="0 0 24 24"> {/* Changed to viewBox */}
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                                </svg>
                            </div>
                            <div className="info-item-text">
                                Hotline :
                                <b>098.777.0035</b>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box">
                                <svg className="icon-svg" viewBox="0 0 24 24"> {/* Chữ B phải viết hoa */}
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                                </svg>
                            </div>
                            <div className="info-item-text">
                                Hệ thống
                                <b>Cửa hàng</b>
                            </div>
                        </div>
                        <div className="user-cart-group">
                            <div className="user-account-wrapper" ref={menuRef}>
                                <div className="user-account-wrapper" ref={menuRef}>
                                    {/* Nút Icon luôn hiển thị, dù đăng nhập hay chưa */}
                                    <div className="icon-box" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                        <svg className="icon-svg" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                        </svg>
                                    </div>

                                    {/* Phần Dropdown xử lý logic Đăng nhập / Chưa đăng nhập bên trong */}
                                    {isMenuOpen && (
                                        <div className="account-dropdown">
                                            {username ? (
                                                /* --- Giao diện KHI ĐÃ ĐĂNG NHẬP --- */
                                                <>
                                                    <div className="dropdown-item-header" style={{ color: "#000", textAlign: "center", padding: "10px 0" }}>
                                                        Xin chào, <b>{username}</b>
                                                    </div>
                                                    <div className="dropdown-item" onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate('/userProfile');
                                                    }}>Tài khoản của tôi</div>
                                                    <div className="dropdown-item" onClick={() => handleLogout()}>Đăng xuất</div>
                                                </>
                                            ) : (
                                                /* --- Giao diện KHI CHƯA ĐĂNG NHẬP --- */
                                                <>
                                                    <div className="dropdown-item" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                                                        Đăng nhập
                                                    </div>
                                                    <div className="dropdown-item" onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}>
                                                        Đăng ký
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>


                            </div>
                            <div className="cart-wrapper" title="Giỏ hàng">
                                <div className="icon-box" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/cart');
                                }}>
                                    <svg className="icon-svg" viewBox="0 0 24 24"> {/* Sửa viewbox thành viewBox */}
                                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                                    </svg>
                                </div>
                                {/* <span className="cart-badge">1</span> */}
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="nav-row" data-purpose="main-navigation">
                    <ul className="nav-list">
                        <li className="nav-item" onClick={(e) => {
                            e.preventDefault();
                            handleClick(0);
                            navigate('/home');
                        }}>Trang chủ</li>
                        <li
                            className="nav-item category-dropdown-container"
                            ref={categoryRef}
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        >
                            Danh mục <i className={`arrow-down ${isCategoryOpen ? 'rotate' : ''}`}></i>

                            {isCategoryOpen && (
                                <ul className="sub-menu">
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <li
                                                key={cat.id}
                                                className="sub-menu-item"
                                                onClick={() => {
                                                    localStorage.setItem('categoryId', cat.id);
                                                    setRefresh(prev => !prev); // để trigger useEffect ở file kia
                                                    navigate(`/collections/${slugify(cat.name)}`);
                                                }}
                                            >
                                                {cat.name}

                                            </li>
                                        ))
                                    ) : (
                                        <li className="sub-menu-item">Đang tải...</li>
                                    )}
                                </ul>
                            )}
                        </li>                        <li className="nav-item">Khuyến mãi <i className="arrow-down"></i></li>
                        <li className="nav-item">Hướng Dẫn <i className="arrow-down"></i></li>
                        <li className="nav-item">Tin Tức <i className="arrow-down"></i></li>
                        <li className="nav-item">Liên hệ</li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
export default Navbar2;