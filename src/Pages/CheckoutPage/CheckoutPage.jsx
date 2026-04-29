import { useState } from "react";
import { Container, Row, Col, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard, FiSmartphone, FiDollarSign } from "react-icons/fi";
import { useCart } from "../../Context/CartContext";
import axiosInstance from "../../Utils/axiosInstance";
import "./CheckoutPage.css";

const CheckoutPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [address, setAddress] = useState({
        nama_penerima: "",
        no_hp: "",
        alamat: "",
        kota: "",
        kode_post: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const addrRes = await axiosInstance.post("/alamat/create", address);
            const address_id = addrRes.data.data.id;

            const orderRes = await axiosInstance.post("/orders/create", {
                total_harga: totalPrice,
                address_id: address_id
            });
            const order_id = orderRes.data.data.id;

            for (const item of cartItems) {
                await axiosInstance.post("/orders-items/create", {
                    order_id,
                    food_id: item.id,
                    quantity: item.quantity,
                    harga: item.harga
                });
            }
            await axiosInstance.post("/payment/create", {
                order_id,
                metode_pembayaran: paymentMethod,
                status_pembayaran: "pending"
            });

            clearCart();
            navigate("/payment-success");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal membuat pesanan, coba lagi.");
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

    return (
        <section className="checkout-page">
            <Container>
                <h1 className="checkout-title">Checkout</h1>
                <Form onSubmit={handlePlaceOrder}>
                    <Row className="g-4">
                        <Col lg={7}>
                            <div className="checkout-card">
                                <h3 className="checkout-card-title">
                                    <FiMapPin /> Alamat Pengiriman
                                </h3>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Nama Penerima</Form.Label>
                                            <Form.Control 
                                                className="form-control-custom"
                                                name="nama_penerima" 
                                                value={address.nama_penerima} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>No. HP</Form.Label>
                                            <Form.Control 
                                                className="form-control-custom"
                                                name="no_hp" 
                                                value={address.no_hp} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Alamat Lengkap</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3} 
                                                className="form-control-custom"
                                                name="alamat" 
                                                value={address.alamat} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Kota</Form.Label>
                                            <Form.Control 
                                                className="form-control-custom"
                                                name="kota" 
                                                value={address.kota} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Kode Pos</Form.Label>
                                            <Form.Control 
                                                className="form-control-custom"
                                                name="kode_post" 
                                                value={address.kode_post} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            <div className="checkout-card">
                                <h3 className="checkout-card-title">
                                    <FiCreditCard /> Metode Pembayaran
                                </h3>
                                <div className="payment-options">
                                    <div 
                                        className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <FiDollarSign className="payment-icon" />
                                        <div>
                                            <div className="fw-bold">Tunai (Cash)</div>
                                            <small className="text-muted">Bayar saat makanan sampai</small>
                                        </div>
                                    </div>
                                    <div 
                                        className={`payment-option ${paymentMethod === 'transfer' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('transfer')}
                                    >
                                        <FiCreditCard className="payment-icon" />
                                        <div>
                                            <div className="fw-bold">Transfer Bank</div>
                                            <small className="text-muted">BCA, Mandiri, BNI</small>
                                        </div>
                                    </div>
                                    <div 
                                        className={`payment-option ${paymentMethod === 'e-wallet' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('e-wallet')}
                                    >
                                        <FiSmartphone className="payment-icon" />
                                        <div>
                                            <div className="fw-bold">E-Wallet</div>
                                            <small className="text-muted">OVO, GoPay, Dana</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={5}>
                            <div className="checkout-card sticky-top" style={{ top: '100px' }}>
                                <h3 className="checkout-card-title">Ringkasan Order</h3>
                                {cartItems.map((item) => (
                                    <div key={item.id} className="order-summary-item">
                                        <span>{item.quantity}x {item.nama_makanan}</span>
                                        <span>{formatRupiah(item.harga * item.quantity)}</span>
                                    </div>
                                ))}
                                <div className="order-total-row">
                                    <span>Total Bayar</span>
                                    <span className="text-orange">{formatRupiah(totalPrice)}</span>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn-place-order"
                                    disabled={loading}
                                >
                                    {loading ? "Memproses..." : "Buat Pesanan"}
                                </button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </section>
    );
};

export default CheckoutPage;
