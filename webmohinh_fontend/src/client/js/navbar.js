import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React, { useEffect, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import slugify from "./utils/slugify";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import api from '../../axiosConfig';

function Navbar() {
    useEffect(() => {
        import('../css/home.css');

    }, []);
    const [refresh, setRefresh] = useState(false); // thêm dòng này nếu chưa có

    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index) => {
        setActiveIndex(index);
    };
    const navigate = useNavigate();

    // const handleLoginClick = () => {
    //     navigate('/login');
    // };
    // const handleSigupClick = () => {
    //     navigate('/sigup');
    // };
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
    return (
        <nav>


            <div className="navbar-wrapper">
                <div className="navbar">
                    <div className="menu-category" onClick={toggleMenu}>
                        <span className="menu-icon active">☰</span> DANH MỤC SẢN PHẨM
                        <ul className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <a
                                        onClick={() => {
                                            localStorage.setItem('categoryId', category.id);
                                            setRefresh(prev => !prev); // để trigger useEffect ở file kia
                                            navigate(`/collections/${slugify(category.name)}`);
                                        }}
                                    >
                                        {category.name}
                                    </a>
                                </li>
                            ))}
                        </ul>

                    </div>

                    <ul className="nav-links">
                        <li>
                            <a style={{ cursor: "pointer" }}

                                className={activeIndex === 0 ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleClick(0);
                                    navigate('/home');
                                }}
                            >
                                TRANG CHỦ
                            </a>

                        </li>

                        <li>
                            <a
                                href="#"
                                className={activeIndex === 2 ? 'active' : ''}
                                onClick={() => handleClick(2)}
                            >
                                GIỚI THIỆU
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={activeIndex === 3 ? 'active' : ''}
                                onClick={() => handleClick(3)}
                            >
                                LIÊN HỆ
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={activeIndex === 4 ? 'active' : ''}
                                onClick={() => handleClick(4)}
                            >
                                CẨM NANG
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={activeIndex === 5 ? 'active' : ''}
                                onClick={() => handleClick(5)}
                            >
                                KHUYẾN MÃI
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="header">
                <img src="/logo.png" alt="Logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                <input className="input-elevated" type="text" placeholder="Search" />

                {username ? (
                    /* --- Giao diện KHI ĐÃ ĐĂNG NHẬP --- */
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="header-cart-title" style={{ color: '#e74c3c', fontWeight: 'bold' }}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/userProfile');
                            }}>
                            <AccountCircleIcon /> Chào bạn, {username}
                        </span>
                        <span
                            className="header-cart-title"
                            onClick={handleLogout}
                            style={{ cursor: 'pointer', marginLeft: '10px', fontSize: '13px', color: '#888' }}
                        >
                            (Đăng xuất)
                        </span>
                    </div>
                ) : (
                    /* --- Giao diện KHI CHƯA ĐĂNG NHẬP --- */
                    <>
                        <span className="header-cart-title" onClick={() => navigate('/sigup')} style={{ cursor: 'pointer' }}>
                            <HowToRegIcon /> Đăng ký /
                        </span>
                        <span className="header-cart-title" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                            <LoginIcon /> Đăng nhập
                        </span>
                    </>
                )}

                <span className="header-cart-title">
                    <a onClick={(e) => {
                        e.preventDefault();
                        navigate('/cart');
                    }} style={{ cursor: 'pointer' }}>
                        / Giỏ hàng <ShoppingCartIcon />
                    </a>
                </span>
            </div>

        </nav>
    )
}
export default Navbar;