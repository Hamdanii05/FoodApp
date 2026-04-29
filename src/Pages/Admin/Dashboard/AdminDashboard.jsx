import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FiBox, FiUsers, FiShoppingCart, FiDollarSign } from "react-icons/fi";
import axiosInstance from "../../../Utils/axiosInstance";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        foods: 0,
        users: 0,
        orders: 0,
        revenue: 0
    });
    const [orderStatusData, setOrderStatusData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [foodRes, userRes, orderRes] = await Promise.all([
                    axiosInstance.get("/food"),
                    axiosInstance.get("/user"),
                    axiosInstance.get("/orders")
                ]);

                const orders = orderRes.data.data || [];
                const totalRevenue = orders.reduce((sum, order) => {
                    return order.status !== 'dibatalkan' ? sum + (order.total_harga || 0) : sum;
                }, 0);

                setStats({
                    foods: foodRes.data.data?.length || 0,
                    users: userRes.data.data?.length || 0,
                    orders: orders.length,
                    revenue: totalRevenue
                });

                
                const statusCounts = { pending: 0, diproses: 0, selesai: 0, dibatalkan: 0 };
                orders.forEach(order => {
                    const status = order.status || 'pending';
                    if (statusCounts[status] !== undefined) {
                        statusCounts[status]++;
                    } else {
                        statusCounts[status] = 1;
                    }
                });
                
                const pieData = [
                    { name: 'Pending', value: statusCounts.pending, color: '#f6c23e' },
                    { name: 'Diproses', value: statusCounts.diproses, color: '#36b9cc' },
                    { name: 'Selesai', value: statusCounts.selesai, color: '#1cc88a' },
                    { name: 'Dibatalkan', value: statusCounts.dibatalkan, color: '#e74a3b' }
                ].filter(item => item.value > 0); 

                setOrderStatusData(pieData);

               
                const revByDate = {};
                
                const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                sortedOrders.forEach(order => {
                    if(!order.createdAt) return;
                    const dateObj = new Date(order.createdAt);
                    const dateStr = dateObj.toLocaleDateString("id-ID", { day: '2-digit', month: 'short' });
                    if (!revByDate[dateStr]) {
                        revByDate[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
                    }

                    if (order.status !== 'dibatalkan') {
                        revByDate[dateStr].revenue += order.total_harga || 0;
                    }
                    revByDate[dateStr].orders += 1;
                });

                const barData = Object.values(revByDate);

                setRevenueData(barData.slice(-7));

            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };
        fetchStats();
    }, []);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const statCards = [
        { title: "Total Makanan", value: stats.foods, icon: <FiBox />, color: "#4e73df" },
        { title: "Total Pengguna", value: stats.users, icon: <FiUsers />, color: "#1cc88a" },
        { title: "Total Pesanan", value: stats.orders, icon: <FiShoppingCart />, color: "#36b9cc" },
        { title: "Total Pendapatan", value: formatRupiah(stats.revenue), icon: <FiDollarSign />, color: "#f6c23e" },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip shadow-sm" style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                    <p className="label fw-bold mb-2">{label}</p>
                    <p className="mb-1" style={{ color: '#4e73df', fontSize: '0.9rem' }}>
                        Pendapatan: <span className="fw-semibold">{formatRupiah(payload[0].value)}</span>
                    </p>
                    {payload[1] && (
                        <p className="mb-0" style={{ color: '#1cc88a', fontSize: '0.9rem' }}>
                            Pesanan: <span className="fw-semibold">{payload[1].value}</span>
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="admin-dashboard-page">
            <h2 className="admin-page-title">Dashboard Overview</h2>
            
            <Row className="g-4 mb-4">
                {statCards.map((stat, i) => (
                    <Col md={6} lg={3} key={i}>
                        <Card className="stat-card-admin h-100 shadow-sm border-0">
                            <Card.Body>
                                <div className="stat-icon-admin" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                                    {stat.icon}
                                </div>
                                <div className="stat-content-admin">
                                    <div className="stat-label-admin">{stat.title}</div>
                                    <div className="stat-value-admin">{stat.value}</div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="g-4 mb-4">
                <Col lg={8}>
                    <Card className="chart-card-admin shadow-sm border-0 h-100">
                        <Card.Body>
                            <h5 className="card-title fw-bold mb-4">Grafik Pendapatan & Pesanan Harian</h5>
                            <div style={{ width: '100%', height: 300 }}>
                                {revenueData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                                            <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false} />
                                            <YAxis 
                                                yAxisId="left" 
                                                tick={{fontSize: 12}} 
                                                tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} 
                                                axisLine={false} 
                                                tickLine={false} 
                                            />
                                            <YAxis yAxisId="right" orientation="right" hide />
                                            <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                                            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                                            <Bar yAxisId="left" dataKey="revenue" name="Pendapatan" fill="#4e73df" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                            <Bar yAxisId="right" dataKey="orders" name="Jumlah Pesanan" fill="#1cc88a" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                        Belum ada data pesanan nih.
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="chart-card-admin shadow-sm border-0 h-100">
                        <Card.Body>
                            <h5 className="card-title fw-bold mb-4 text-center">Sebaran Status Pesanan</h5>
                            <div style={{ width: '100%', height: 300 }}>
                                {orderStatusData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={orderStatusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {orderStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value, name) => [`${value} pesanan`, name]} />
                                            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '12px'}} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                        Belum ada data status pesanan.
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Row>
                <Col lg={12}>
                    <Card className="welcome-card-admin shadow-sm border-0">
                        <Card.Body>
                            <h4 className="fw-bold mb-2">Selamat Datang di Panel Admin!</h4>
                            <p className="text-white mb-0">Gunakan navigasi di samping untuk mengelola makanan, kategori, dan memproses pesanan pelanggan secara real-time.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
