import { useState, useEffect } from "react";
import { Table, Badge } from "react-bootstrap";
import { FiCheck, FiX, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import axiosInstance from "../../../Utils/axiosInstance";
import "./AdminOrders.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        fetchUsers();
        fetchAddress();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get("/orders");
            setOrders(res.data.data || []);
        } catch (err) {
            toast.error("Gagal mengambil data pesanan");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axiosInstance.get("/user");
            setUsers(res.data.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAddress = async () => {
    try {
        const res = await axiosInstance.get("/alamat");
        setAddresses(res.data.data || []);
    } catch (err) {
        console.log(err);
    }
};

    const getUsername = (user_id) => {
        const user = users.find((u) => u.id === user_id);
        return user ? user.username : "Guest";
    };

    const getAddress = (address_id) => {
        const addr = addresses.find((a) => a.id === address_id);
        return addr ? addr.alamat : "No address";
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axiosInstance.patch(`/orders/update/${id}`, { status: newStatus });
            toast.success(`Pesanan berhasil diupdate menjadi ${newStatus}`);
            fetchOrders();
        } catch (err) {
            toast.error("Gagal update status pesanan");
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
            case "selesai": return <Badge bg="success" className="p-2">Selesai</Badge>;
            case "pending": return <Badge bg="warning" className="p-2 text-dark">Pending</Badge>;
            case "diproses": return <Badge bg="info" className="p-2">Diproses</Badge>;
            case "dibatalkan": return <Badge bg="danger" className="p-2">Dibatalkan</Badge>;
            default: return <Badge bg="secondary" className="p-2">{status}</Badge>;
        }
    };

    return (
        <div className="admin-orders-page">
            <h2 className="admin-page-title">Manage Customer Orders</h2>

            <div className="admin-table-card">
                <Table responsive hover className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Tanggal</th>
                            <th>Total Harga</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="fw-bold">{order.id}.</td>
                                <td>
                                    <div className="fw-bold">
                                        {getUsername(order.user_id)}
                                    </div>
                                    <small className="text-muted">
                                       {getAddress(order.address_id)}
                                    </small>
                                </td>
                                <td>
                                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="fw-bold text-orange">
                                    {formatRupiah(order.total_harga)}
                                </td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>
                                    <div className="table-actions">
                                        {order.status === "pending" && (
                                            <button
                                                className="btn-action-approve"
                                                onClick={() => handleUpdateStatus(order.id, "diproses")}
                                            >
                                                <FiClock />
                                            </button>
                                        )}

                                        {order.status === "diproses" && (
                                            <button
                                                className="btn-action-complete"
                                                onClick={() => handleUpdateStatus(order.id, "selesai")}
                                            >
                                                <FiCheck />
                                            </button>
                                        )}

                                        {order.status !== "selesai" &&
                                            order.status !== "dibatalkan" && (
                                                <button
                                                    className="btn-action-cancel"
                                                    onClick={() => handleUpdateStatus(order.id, "dibatalkan")}
                                                >
                                                    <FiX />
                                                </button>
                                            )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrders;