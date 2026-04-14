import React, { useEffect, useState, forwardRef } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import axios from 'axios';
import api from '../../axiosConfig';
import { Eye, EyeOff } from 'lucide-react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DashboardDate from './dashboardDate';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const formatVND = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value || 0);
    };
    useEffect(() => {
        // Import CSS
        import('../css/admin.css');

        // Gọi API lấy dữ liệu thống kê
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');

                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    const toggleDetails = (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài thẻ card
        setShowOrderDetails(!showOrderDetails);
    };


    // Kết quả: "13 thg 03, 2026"
    if (loading) return <Typography >Đang tải dữ liệu...</Typography>;
    if (!stats) return <Typography>Không có dữ liệu thống kê.</Typography>;
    const chartData = [
        { name: 'Chờ duyệt', value: stats.pendingOrders || 0, color: '#64748b' },
        { name: 'Đang giao', value: stats.shippingOrders || 0, color: '#3b82f6' },
        { name: 'Giao thành công', value: stats.completedOrders || 0, color: '#10b981' },
        { name: 'Đã hủy', value: stats.cancleOrders || 0, color: '#ef4444' }, // Đổi màu đỏ cho trực quan
    ].filter(item => item.value > 0);
    return (
        <Paper sx={{ p: 3, borderRadius: '15px', boxShadow: 3, bgcolor: '#fdfdfd' }}>
            <div className="dashboard-container">
                <h1>Thống kê</h1>

                {/* Section Metrics: Lấy từ stats */}
                <section className="metrics-grid">
                    <MetricCard
                        label="Doanh thu dự kiến"
                        // Sử dụng hàm formatVND thay vì nối chuỗi với dấu $
                        value={formatVND(stats.totalEstimatedRevenue)}
                        icon={<AttachMoneyIcon />}
                        className="icon-revenue"
                    />
                    <MetricCard
                        label="Tổng doanh thu(Giao thành công)"
                        // Sử dụng hàm formatVND thay vì nối chuỗi với dấu $
                        value={formatVND(stats.totalRevenue)}
                        icon={<AttachMoneyIcon />}
                        className="icon-revenue"
                    />
                    <MetricCard
                        label="Người dùng"
                        value={stats.totalUsers?.toLocaleString()}
                        icon={<SupervisedUserCircleIcon />}
                        className="icon-users"
                    />
                    <div style={{ position: 'relative' }}>
                        <MetricCard
                            label={
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Tổng đơn hàng
                                    <span onClick={toggleDetails} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        {showOrderDetails ? <EyeOff size={16} color="#64748b" /> : <Eye size={16} color="#64748b" />}
                                    </span>
                                </span>
                            }
                            /* Chỉnh sửa dòng này: Thêm đơn vào sau giá trị */
                            value={`${stats.totalOrders?.toLocaleString() || 0} đơn`}
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
                {/* <section className="charts-grid">
                
                    <div className="charts-grid">
                        <div className="date-picker">
                            <div style={{ position: 'relative' }}>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    locale="vi"
                                    dateFormat="dd 'thg' MM, yyyy"
                                    customInput={<CustomInput />}
                                    portalId="root-portal"
                                />
                            </div>
                        </div>
                        <h2 className="chart-title">Doanh thu theo ngày</h2>

                    </div>

                </section> */}

                <section className="charts-grid">
                    <DashboardDate/>
                </section>

                <section className="charts-grid">
                    <div className="chart-card">
                        <h2 className="chart-title">Tổng quan về doanh thu theo từng tháng</h2>
                        <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.revenueByMonth}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="month" axisLine={false} tickFormatter={(value) => `Tháng ${value}`} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        // Bỏ số 2 (label) ở dòng đầu tiên của Tooltip
                                        labelFormatter={() => ""}
                                        // Định dạng lại dòng "doanhthu: 9730000"
                                        formatter={(value) => [formatVND(value), "Doanh thu"]}
                                        cursor={{ fill: '#f1f5f9' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />

                                    <Bar
                                        dataKey="doanhthu"
                                        name="Doanh thu" // Đặt tên hiển thị chuẩn
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                        barSize={35}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>





                <section className="charts-grid">
                    <div className="chart-card">
                        <section className="lists-grid">
                            <div className="list-card">
                                <h2 className="chart-title">Top sản phẩm bán chạy nhất</h2>
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
            </div>
        </Paper>
    );
}

// Component con để tái sử dụng
const MetricCard = ({ label, value, icon, className }) => (
    <div className="metric-card">
        <div className="metric-top">
            <div>
                <p className="metric-label">{label}</p>
                <h3 className="metric-value">{value}</h3>
            </div>
            <div className={`metric-icon ${className}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default Dashboard;