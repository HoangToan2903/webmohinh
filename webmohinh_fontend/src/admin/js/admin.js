import { useState } from 'react';
import logo from '../image/logo.png';
import AreaChartIcon from '@mui/icons-material/AreaChart';
import BalanceIcon from '@mui/icons-material/Balance';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DetailsIcon from '@mui/icons-material/Details';
import Person2Icon from '@mui/icons-material/Person2';
import Person4Icon from '@mui/icons-material/Person4';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ContentRenderer from './contentRenderer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

function Admin() {
    useEffect(() => {
        import('../css/admin.css');
    }, []);
    const [activeTab, setActiveTab] = useState('statistics');
    const [openMenus, setOpenMenus] = useState({});
    const [openMenusOrders, setMenusOrders] = useState({});
    const toggleSubOrders = () => {
        setMenusOrders(!openMenusOrders);
    };
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    const toggleMenu = (menuName) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };
    const { tab } = useParams(); // Lấy tab từ URL
    const navigate = useNavigate();

    const handleTabChange = (newTab) => {
        navigate(`/admin/${newTab}`);
    };
    const [username, setUsername] = useState(sessionStorage.getItem('username'));
    const [role, setRole] = useState(sessionStorage.getItem('role'));

    // 2. Hàm xử lý đăng xuất
    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            sessionStorage.clear(); // Xóa toàn bộ session (username, role, email)
            window.location.href = "/LoginManager"; // Quay lại trang đăng nhập
        }
    };

    return (
        <div>
            <div className="dashboard">
                <div className="sidebar">
                    <div className="logo">
                        <img
                            src={logo}
                            alt="Icon"
                            style={{
                                width: '220px',
                                height: '220px',

                            }}
                        />
                    </div>
                    <nav>
                        <ul>
                            <li className={tab === 'dashboard' ? 'active' : ''} onClick={() => handleTabChange('dashboard')}>
                                <span><AreaChartIcon /> Thống kê</span>
                            </li>

                            {/* <li className={tab === 'orderAdmin' ? 'active' : ''} onClick={() => handleTabChange('orderAdmin')}>
                                <span><BalanceIcon /> Đơn hàng</span>
                            </li> */}
                            <li className={`has-sub-menu ${openMenusOrders ? 'open' : ''}`}>
                                <span className="profile-menu" onClick={toggleSubOrders}>
                                    <InventoryIcon /> Đơn hàng <ArrowDropDownIcon />
                                </span>
                                {openMenusOrders && (
                                    <ul className="sub-menu show">
                                        <li className={tab === 'orderAdmin' ? 'active' : ''} onClick={() => handleTabChange('orderAdmin')}>
                                            <span><BalanceIcon />Quản lý đơn hàng </span>
                                        </li>
                                        <li className={tab === 'createOder' ? 'active' : ''} onClick={() => handleTabChange('createOder')}>
                                            <span><CategoryIcon /> Tạo đơn hàng</span>
                                        </li>

                                    </ul>
                                )}
                            </li>
                            <li className={`has-sub-menu ${isSubMenuOpen ? 'open' : ''}`}>
                                <span className="profile-menu" onClick={toggleSubMenu}>
                                    <InventoryIcon /> Sản phẩm <ArrowDropDownIcon />
                                </span>
                                {isSubMenuOpen && (
                                    <ul className="sub-menu show">
                                        <li className={tab === 'producer' ? 'active' : ''} onClick={() => handleTabChange('producer')}>
                                            <span><PrecisionManufacturingIcon /> Nhà sản xuất</span>
                                        </li>
                                        <li className={tab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>
                                            <span><CategoryIcon /> Danh mục</span>
                                        </li>
                                        <li className={tab === 'products' ? 'active' : ''} onClick={() => handleTabChange('products')}>
                                            <span><DetailsIcon /> Chi tiết sản phẩm</span>
                                        </li>
                                    </ul>
                                )}
                            </li>


                            <li className={`has-sub-menu ${openMenus.profile ? 'open' : ''}`}>
                                <span onClick={() => toggleMenu('profile')} className="profile-menu">
                                    <Person2Icon />
                                    Profile
                                    <ArrowDropDownIcon />
                                </span>
                                <ul className={`sub-menu ${openMenus.profile ? 'show' : ''}`}>
                                       <li className={tab === 'customer' ? 'active' : ''} onClick={() => handleTabChange('customer')}>
                                        <span><Person4Icon /> Khách hàng</span>
                                    </li>
                                    <li className={tab === 'staff' ? 'active' : ''} onClick={() => handleTabChange('staff')}>

                                        <span><PeopleAltIcon /> Nhân viên</span>
                                    </li>
                                </ul>
                            </li>


                            <li className={`has-sub-menu ${openMenus.sale ? 'open' : ''}`}>
                                <span onClick={() => toggleMenu('sale')} className="profile-menu">
                                    < ReceiptIcon />
                                    Ưu đãi
                                    <ArrowDropDownIcon />
                                </span>
                                <ul className={`sub-menu ${openMenus.sale ? 'show' : ''}`}>

                                    <li className={tab === 'voucher' ? 'active' : ''}
                                        onClick={() => handleTabChange('voucher')}>

                                        <span><LoyaltyIcon /> Voucher</span>
                                    </li>
                                    <li className={tab === 'sale' ? 'active' : ''} onClick={() => handleTabChange('sale')}>
                                        <span><DetailsIcon /> Sale</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>

                    <div className="status">
                        <div className="status-icon online"></div>
                        <div className="status-text">Online</div>
                    </div>
                </div>

                <div className="main-content">
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            {/* Hiển thị tên động thay vì để chữ Admin cố định */}
                            <h3>Xin Chào, {username}</h3>
                        </div>

                        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            {/* Nút đăng xuất */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 15px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Đăng xuất
                            </button>


                        </div>
                    </header>

                    <div className="content">
                        <ContentRenderer tab={tab} />
                    </div>

                    <footer>
                        <div className="copyright">© 2025 Pulse Dashboard</div>
                        <div className="footer-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Contact Us</a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default Admin;
