import { useState, useEffect } from "react";
import { Container, Table, Badge } from "react-bootstrap";
import axiosInstance from "../../Utils/axiosInstance";
import "./OrdersPage.css";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, itemsRes, foodRes] = await Promise.all([
                axiosInstance.get("/orders"),
                axiosInstance.get("/orders-items"),
                axiosInstance.get("/food"),
            ]);

            setOrders(ordersRes.data.data || []);
            setOrderItems(itemsRes.data.data || []);
            setFoods(foodRes.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "selesai": return <Badge bg="success">Selesai</Badge>;
            case "pending": return <Badge bg="warning">Pending</Badge>;
            case "diproses": return <Badge bg="info">Diproses</Badge>;
            case "dibatalkan": return <Badge bg="danger">Dibatalkan</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const getFoodsByOrder = (order_id) => {
        const items = orderItems.filter((item) => item.order_id === order_id);

        return items.map((item) => {
            const food = foods.find((f) => f.id === item.food_id);
            return food ? food.nama_makanan : "Unknown";
        }).join(", ");
    };

    return (
        <section className="orders-page">
            <Container>
                <h1 className="orders-title">Pesanan Saya</h1>

                <div className="orders-card">
                    {loading ? (
                        <div className="text-center py-4">Memuat pesanan...</div>
                    ) : orders.length > 0 ? (
                        <Table responsive hover className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID Order</th>
                                    <th>Tanggal</th>
                                    <th>Produk</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                        </td>
                                        <td>
                                            {getFoodsByOrder(order.id) || "Tidak ada item"}
                                        </td>
                                        <td>
                                            {formatRupiah(order.total_harga)}
                                        </td>
                                        <td>
                                            {getStatusBadge(order.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-4">Belum ada pesanan.</div>
                    )}
                </div>
            </Container>
        </section>
    );
};

export default OrdersPage;