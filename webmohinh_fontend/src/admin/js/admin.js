import { useState } from 'react';
import '../css/admin.css';
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

function Admin() {
    const [activeTab, setActiveTab] = useState('statistics');
    const [openMenus, setOpenMenus] = useState({});

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
                            <li className={tab === 'statistics' ? 'active' : ''} onClick={() => handleTabChange('statistics')}>
                                <span><AreaChartIcon /> Statistics</span>
                            </li>

                            <li className={tab === 'orders' ? 'active' : ''} onClick={() => handleTabChange('orders')}>
                                <span><BalanceIcon /> Order</span>
                            </li>

                            <li className={`has-sub-menu ${isSubMenuOpen ? 'open' : ''}`}>
                                <span className="profile-menu" onClick={toggleSubMenu}>
                                    <InventoryIcon /> Products <ArrowDropDownIcon />
                                </span>
                                {isSubMenuOpen && (
                                    <ul className="sub-menu show">
                                        <li className={tab === 'producer' ? 'active' : ''} onClick={() => handleTabChange('producer')}>
                                            <span><PrecisionManufacturingIcon /> Producer</span>
                                        </li>
                                        <li className={tab === 'categories' ? 'active' : ''} onClick={() => handleTabChange('categories')}>
                                            <span><CategoryIcon /> Categories</span>
                                        </li>
                                        <li className={tab === 'products' ? 'active' : ''} onClick={() => handleTabChange('products')}>
                                            <span><DetailsIcon /> Products_detail</span>
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
                                    <li
                                        className={activeTab === 'profile-customer' ? 'active' : ''}
                                        onClick={() => setActiveTab('profile-customer')}
                                    >
                                        <span><Person4Icon /> Customer</span>
                                    </li>
                                    <li
                                        className={activeTab === 'profile-staff' ? 'active' : ''}
                                        onClick={() => setActiveTab('profile-staff')}
                                    >
                                        <span><PeopleAltIcon /> Staff</span>
                                    </li>
                                </ul>
                            </li>


                            <li className={`has-sub-menu ${openMenus.sale ? 'open' : ''}`}>
                                <span onClick={() => toggleMenu('sale')} className="profile-menu">
                                    < ReceiptIcon />
                                    Sale
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
                    <header>
                        <div className="search-bar">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Search..." />
                        </div>
                        <div className="user-profile">
                            <div className="notifications">
                                <i className="fas fa-bell"></i>
                                <span className="badge">0</span>
                            </div>
                            <div className="avatar">A</div>
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
