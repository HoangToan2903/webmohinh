import React, { useEffect, useState, forwardRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../axiosConfig';
import { Eye, EyeOff } from 'lucide-react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import vi from 'date-fns/locale/vi';

registerLocale('vi', vi);

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function DashboardDate() {
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Khởi tạo state cực kỳ an toàn
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        shippingOrders: 0,
        completedOrders: 0,
        cancelOrders: 0,
        totalUsers: 0,
        revenueByMonth: [], // Quan trọng: Khởi tạo mảng rỗng
        topProducts: []      // Quan trọng: Khởi tạo mảng rỗng
    });

    const formatVND = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value || 0);
    };

    const fetchStats = async (date) => {
        setLoading(true);
        try {
            // Định dạng ngày chuẩn yyyy-MM-dd
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            // Gọi API đến đúng endpoint @GetMapping("/stats") của bạn (hoặc /dashboardSearch)
            const response = await api.get('/dashboardSearch', {
                params: { date: formattedDate }
            });

            if (response.data) {
                // Merge dữ liệu mới vào state cũ để giữ các mảng nếu API không trả về đủ
                setStats(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    // Chỉ sử dụng 1 useEffect này để quản lý việc load dữ liệu
    useEffect(() => {
        // Load CSS một lần
        import('../css/admin.css');
        fetchStats(selectedDate);
    }, [selectedDate]);

    const toggleDetails = (e) => {
        e.stopPropagation();
        setShowOrderDetails(!showOrderDetails);
    };

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <div className="date-picker-custom" onClick={onClick} ref={ref} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', border: '1px solid #ddd', padding: '8px', borderRadius: '8px' }}>
            <DateRangeIcon style={{ marginRight: '8px', color: '#3b82f6' }} />
            <span style={{ fontWeight: 500 }}>{value || "Chọn ngày"}</span>
        </div>
    ));

    // Chuẩn bị dữ liệu cho Pie Chart đơn hàng
    const chartData = [
        { name: 'Chờ duyệt', value: stats.pendingOrders || 0, color: '#64748b' },
        { name: 'Đang giao', value: stats.shippingOrders || 0, color: '#3b82f6' },
        { name: 'Giao thành công', value: stats.completedOrders || 0, color: '#10b981' },
        { name: 'Đã hủy', value: stats.cancelOrders || 0, color: '#ef4444' },
    ].filter(item => item.value > 0);

    return (
        <Paper sx={{ p: 3, borderRadius: '15px', boxShadow: 3, bgcolor: '#fdfdfd' }}>
            <div className="dashboard-container">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">Doanh thu theo ngày</Typography>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        locale="vi"
                        dateFormat="dd 'thg' MM, yyyy"
                        customInput={<CustomInput />}
                    />
                </Box>

                {loading ? (
                    <Typography align="center" sx={{ my: 5 }}>Đang tải dữ liệu...</Typography>
                ) : (
                    <>
                        <section className="metrics-grid">
                            <MetricCard
                                label="Doanh thu dự kiến"
                                value={formatVND(stats.totalEstimatedRevenue)}
                                icon={<AttachMoneyIcon />}
                                className="icon-revenue"
                            />
                            <MetricCard
                                label="Tổng doanh thu ngày(Giao thành công)"
                                value={formatVND(stats.totalRevenue)}
                                icon={<AttachMoneyIcon />}
                                className="icon-revenue"
                            />
                            <MetricCard
                                label="Người dùng mới"
                                value={stats.totalUsers?.toLocaleString()}
                                icon={<SupervisedUserCircleIcon />}
                                className="icon-users"
                            />
                            <div style={{ position: 'relative' }}>
                                <MetricCard
                                    label={
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            Tổng đơn hàng
                                            <span onClick={toggleDetails} style={{ cursor: 'pointer' }}>
                                                {showOrderDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </span>
                                        </span>
                                    }
                                    value={`${stats.totalOrders || 0} đơn`}
                                    icon={<ShoppingCartIcon />}
                                    className="icon-orders"
                                />
                                {showOrderDetails && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        zIndex: 10,
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        marginTop: '5px',
                                        minWidth: '280px'
                                    }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', textAlign: 'center' }}>Cơ cấu đơn hàng</h4>

                                        <div style={{ width: '100%', height: 200 }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={40} // Tạo hình vòng tròn (Donut chart) cho hiện đại
                                                        outerRadius={60}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Legend verticalAlign="bottom" height={36} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Hiển thị số liệu chi tiết phía dưới (Tùy chọn) */}
                                        <div style={{ marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                                            {chartData.map((item) => (
                                                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                                    <span style={{ color: item.color, fontWeight: 500 }}>{item.name}:</span>
                                                    <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                    </>
                )}
            </div>
            <br></br>
            <section className="charts-grid">
                <div className="chart-card">
                    <section className="lists-grid">
                        <div className="list-card">
                            <h2 className="chart-title">Sản phẩm bán chạy</h2>
                            <div className="list-content">
                                {stats.topProducts?.map((product, index) => (
                                    <div key={index} className="list-item">
                                        <div className="item-info">
                                            <div className="product-img-box">
                                                <img
                                                    src={product.imageUrl || 'default-product.png'}
                                                    alt={product.name}
                                                    style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <div className="item-details">
                                                <p className="font-bold">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.soldQuantity} lượt bán</p>
                                            </div>
                                        </div>
                                        <div className="item-stats text-right">
                                            <p className="item-price font-bold text-green-600">
                                                {product.revenue?.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
                <div className="chart-card">
                    <div style={{ width: '100%', height: 350 }} className="list-card">
                        <h2 className="chart-title" style={{ fontSize: '1.1rem', textAlign: 'center' }}>
                            Tỉ lệ doanh thu theo sản phẩm
                        </h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.topProducts}
                                    dataKey="soldQuantity" // Dựa trên số lượng bán
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60} // Tạo hình vòng tròn (Donut chart) cho hiện đại
                                    paddingAngle={5}
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.topProducts?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [`${value} lượt bán`, name]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </Paper>
    );
}

const MetricCard = ({ label, value, icon, className }) => (
    <div className={`metric-card`}>
        <div className="metric-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <Typography variant="caption" color="textSecondary">{label}</Typography>
                <Typography variant="h5" fontWeight="bold">{value}</Typography>
            </div>
            <div className={`metric-icon ${className}`} style={{ padding: '10px', borderRadius: '50%', background: '#f0f7ff' }}>
                {icon}
            </div>
        </div>
    </div>
);

export default DashboardDate;