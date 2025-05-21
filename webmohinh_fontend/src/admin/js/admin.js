import { useState } from 'react';
import '../css/admin.css';
import imageicon from '../image/icon.jpeg';
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

function Admin() {
    const [activeTab, setActiveTab] = useState('statistics');
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (menuName) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    return (
        <div>
            <div className="dashboard">
                <div className="sidebar">
                    <div className="logo">
                        <img
                            src={imageicon}
                            alt="Icon"
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '100px',
                            }}
                        />
                    </div>
                    <nav>
                        <ul>
                            <li
                                className={activeTab === 'statistics' ? 'active' : ''}
                                onClick={() => setActiveTab('statistics')}
                            >
                                <span><AreaChartIcon /> Statistics</span>
                            </li>

                            <li
                                className={activeTab === 'orders' ? 'active' : ''}
                                onClick={() => setActiveTab('orders')}
                            >
                                <span><BalanceIcon /> Order</span>
                            </li>

                            <li className={`has-sub-menu ${openMenus.products ? 'open' : ''}`}>
                                <span onClick={() => toggleMenu('products')} className="profile-menu">
                                    <InventoryIcon />
                                    Products
                                    <ArrowDropDownIcon />
                                </span>
                                <ul className={`sub-menu ${openMenus.products ? 'show' : ''}`}>
                                    <li
                                        className={activeTab === 'producer' ? 'active' : ''}
                                        onClick={() => setActiveTab('producer')}
                                    >
                                        <span><PrecisionManufacturingIcon /> Producer</span>
                                    </li>
                                    <li
                                        className={activeTab === 'categories' ? 'active' : ''}
                                        onClick={() => setActiveTab('categories')}
                                    >
                                        <span><CategoryIcon /> Categories</span>
                                    </li>
                                    <li
                                        className={activeTab === 'products-detail' ? 'active' : ''}
                                        onClick={() => setActiveTab('products-detail')}
                                    >
                                        <span><DetailsIcon /> Products_detail</span>
                                    </li>
                                </ul>
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
                                    <li
                                        className={activeTab === 'voucher' ? 'active' : ''}
                                        onClick={() => setActiveTab('voucher')}
                                    >
                                        <span><LoyaltyIcon /> Voucher</span>
                                    </li>
                                    <li
                                        className={activeTab === 'profile-staff' ? 'active' : ''}
                                        onClick={() => setActiveTab('profile-staff')}
                                    >
                                        <span><LoyaltyIcon /> Staff</span>
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
                        <ContentRenderer activeTab={activeTab} />
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
