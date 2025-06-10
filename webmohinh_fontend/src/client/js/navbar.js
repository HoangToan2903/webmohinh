import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React, { useEffect, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function Navbar() {
   
    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const [activeIndex, setActiveIndex] = useState(0);

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div>
            <div className="header">
                <img src="/logo.png" />
                <input className="input-elevated" type="text" placeholder="Search" />
                <span className="header-cart-title">
                    Đăng ký
                    <HowToRegIcon />
                </span> <span className="header-cart-title">
                    / Đăng nhập
                    <LoginIcon />
                </span>

                <span className="header-cart-title">
                    / Giỏ hàng
                    <ShoppingCartIcon />
                </span>
            </div>

            <div className="navbar-wrapper">
                <div className="navbar">
                    <div className="menu-category" onClick={toggleMenu}>
                        <span className="menu-icon active">☰</span> DANH MỤC SẢN PHẨM
                        <ul className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
                            <li><a href="#">Mô hình Anime</a></li>
                            <li><a href="#">Mô hình Game</a></li>
                            <li><a href="#">Mô hình Marvel</a></li>
                        </ul>
                    </div>

                    <ul className="nav-links">
                        <li>
                            <a
                                href="#"
                                className={activeIndex === 0 ? 'active' : ''}
                                onClick={() => handleClick(0)}
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


        </div>
    )
}
export default Navbar;