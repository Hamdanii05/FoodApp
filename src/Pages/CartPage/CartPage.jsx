import { Container, Row, Col, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi";
import { useCart } from "../../Context/CartContext";
import "./CartPage.css";

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    if (cartItems.length === 0) {
        return (
            <section className="cart-page">
                <Container>
                    <div className="empty-cart">
                        <div className="empty-cart-img">🛒</div>
                        <h3>Keranjangmu kosong</h3>
                        <p>Yuk, cari makanan lezat untuk mengisinya!</p>
                        <Link to="/menu" className="btn-back-menu">
                            Mulai Belanja <FiArrowRight />
                        </Link>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <Container>
                <h1 className="cart-title">Keranjang Belanja</h1>
                <Row className="g-4">
                    <Col lg={8}>
                        <div className="cart-table-wrapper">
                            <Table responsive className="cart-table">
                                <thead>
                                    <tr>
                                        <th>Produk</th>
                                        <th>Harga</th>
                                        <th>Jumlah</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="cart-item-info">
                                                    <img src={item.foto || "https://via.placeholder.com/80"} alt={item.nama_makanan} className="cart-item-img" />
                                                    <div>
                                                        <div className="cart-item-name">{item.nama_makanan}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cart-item-price">{formatRupiah(item.harga)}</div>
                                            </td>
                                            <td>
                                                <div className="cart-qty-controls">
                                                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                        <FiMinus />
                                                    </button>
                                                    <div className="cart-qty-val">{item.quantity}</div>
                                                    <button className="cart-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                        <FiPlus />
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold">{formatRupiah(item.harga * item.quantity)}</div>
                                            </td>
                                            <td>
                                                <FiTrash2 className="btn-remove-item" onClick={() => removeFromCart(item.id)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col lg={4}>
                        <div className="cart-summary">
                            <h3 className="summary-title">Ringkasan Pesanan</h3>
                            <div className="summary-row">
                                <span>Total Item</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="summary-row">
                                <span>Total Harga</span>
                                <span>{formatRupiah(totalPrice)}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Subtotal</span>
                                <span>{formatRupiah(totalPrice)}</span>
                            </div>
                            <button className="btn-checkout" onClick={() => navigate("/checkout")}>
                                Lanjut ke Pembayaran
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default CartPage;
