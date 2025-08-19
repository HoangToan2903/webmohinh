import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React, { useEffect, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import slugify from "./utils/slugify";

function Navbar() {
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

    const handleLoginClick = () => {
        navigate('/login');
    };
    const [page, setPage] = useState(0); // page = 0 is first page
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/website/categoriesAll', {
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
                            <a style={{cursor:"pointer"}}

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
                <img src="/logo.png" />
                <input className="input-elevated" type="text" placeholder="Search" />
                {/* <span className="header-cart-title">
                    Đăng ký
                    <HowToRegIcon />
                </span> */}
                <span className="header-cart-title" onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
                    Đăng nhập
                    <LoginIcon />
                </span>

                <span className="header-cart-title">
                   <a onClick={(e) => {
                                    e.preventDefault();
                                    handleClick(0);
                                    navigate('/cart');
                                }}>/ Giỏ hàng
                    <ShoppingCartIcon /></a> 
                </span>
            </div>

        </nav>
    )
}
export default Navbar;