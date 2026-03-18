import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
function Footer() {


    return (
        <footer className="main-footer" data-purpose="site-footer">
            <div className="footer-container">
                <div className="footer-top-grid" data-purpose="navigation-links">
                    <div className="footer-column">
                        <h3>Giới thiệu về M Figure</h3>
                        <ul>
                            <li><a href="#">Giới thiệu</a></li>
                            <li><a href="#">Liên hệ hợp tác</a></li>
                            <li><a href="#">Tin tức</a></li>
                            <li><a href="#">Tin tuyển dụng</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Hỗ trợ khách hàng</h3>
                        <ul>
                            <li><a href="#">Tra cứu đơn hàng</a></li>
                            <li><a href="#">Hướng dẫn mua hàng trực tuyến</a></li>
                            <li><a href="#">Hướng dẫn thanh toán</a></li>
                            <li><a href="#">Bảng tính giá Order</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Chính sách</h3>
                        <ul>
                            <li><a href="#">Quy định chung</a></li>
                            <li><a href="#">Phân định trách nhiệm</a></li>
                            <li><a href="#">Chính sách vận chuyển</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Chính sách kiểm hàng</a></li>
                            <li><a href="#">Chính sách đổi trả</a></li>
                            <li><a href="#">Chính sách thanh toán</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Thông tin khuyến mãi</h3>
                        <ul>
                            <li><a href="#">Thông tin khuyến mãi</a></li>
                            <li><a href="#">Sản phẩm khuyến mãi</a></li>
                            <li><a href="#">Sản phẩm mới</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom-grid" data-purpose="contact-and-legal">
                    <div className="footer-column contact-info">
                        <h3>Thông tin liên hệ</h3>
                        <p><strong>CƠ SỞ 1:</strong> Số 100 An Trạch - Ô Chợ Dừa - Đống Đa - Hà Nội</p>
                        <p><strong>CƠ SỞ 2:</strong> Số 392 Nguyễn Trãi - Hà Đông - Hà Nội</p>
                        <p><strong>Email:</strong> mfigure.vn@gmail.com</p>
                        <p><strong>Hotline 1:</strong> 098.777.0035</p>
                        <p><strong>Hotline 2:</strong> 090.345.2816</p>
                    </div>
                    <div className="footer-column">
                        <h3>Kết nối với chúng tôi</h3>
                        <div className="social-links">
                            <a className="social-icon social-fb" href="#" title="Facebook">f</a>
                            <a className="social-icon social-tw" href="#" title="Twitter">t</a>
                            <a className="social-icon social-ig" href="#" title="Instagram">i</a>
                            <a className="social-icon social-yt" href="#" title="YouTube">y</a>
                            <a className="social-icon social-shopee" href="#" title="Shopee">s</a>
                            <a className="social-icon social-lazada" href="#" title="Lazada">l</a>
                        </div>
                    </div>
                    <div className="footer-column">
                        <div className="business-block">
                            <div className="logo-placeholder" data-purpose="brand-logo">  <img className="logo-icon" src="/logo.png" /></div>
                            <div className="business-details">
                                <h4>HỘ KINH DOANH M FIGURE</h4>
                                <ul>
                                    <li>GIẤY CHỨNG NHẬN ĐĂNG KÝ HỘ KINH DOANH Số 01K8035445 cấp ngày 18/10/2024 Tại UBND
                                        QUẬN NAM TỪ LIÊM</li>
                                    <li>MST: 8717131113</li>
                                </ul>
                               
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright-bar">
                    <div className="footer-container">
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;