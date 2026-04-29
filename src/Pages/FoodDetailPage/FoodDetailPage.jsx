import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiCheck, FiMinus, FiPlus } from "react-icons/fi";
import axiosInstance from "../../Utils/axiosInstance";
import { useCart } from "../../Context/CartContext";
import "./FoodDetailPage.css";

const FoodDetailPage = () => {
    const { id } = useParams();
    const [food, setFood] = useState(null);
    const [category, setCategory] = useState(null);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchFood();
    }, [id]);

    const fetchFood = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/food/find/${id}`);
            const data = res.data.data;
            setFood(data);

            if (data?.category_id) {
                try {
                    const catRes = await axiosInstance.get(`/kategori/find/${data.category_id}`);
                    setCategory(catRes.data.data);
                } catch {}
            }
        } catch (err) {
            console.error("Error fetching food:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < qty; i++) {
            addToCart(food);
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80";

    if (loading) {
        return (
            <section className="detail-page">
                <Container>
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: "var(--accent-orange)" }} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    if (!food) {
        return (
            <section className="detail-page">
                <Container className="text-center py-5">
                    <h3>Makanan tidak ditemukan</h3>
                    <Link to="/menu" style={{ color: "var(--accent-orange)" }}>Kembali ke Menu</Link>
                </Container>
            </section>
        );
    }

    return (
        <section className="detail-page">
            <Container>
                <div className="detail-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/menu">Menu</Link>
                    <span>/</span>
                    <span>{food.nama_makanan}</span>
                </div>

                <Row className="g-5">
                    <Col lg={6}>
                        <div className="detail-image-wrapper">
                            <img
                                src={food.foto || fallbackImg}
                                alt={food.nama_makanan}
                                className="detail-image"
                                onError={(e) => { e.target.src = fallbackImg; }}
                            />
                            {category && (
                                <span className="detail-category-badge">{category.nama_category}</span>
                            )}
                        </div>
                    </Col>
                    <Col lg={6}>
                        <div className="detail-info">
                            <h1 className="detail-name">{food.nama_makanan}</h1>
                            <div className="detail-price">{formatRupiah(food.harga)}</div>

                            <h5 className="detail-desc-title">Deskripsi</h5>
                            <p className="detail-desc">{food.deskripsi}</p>

                            <div className="detail-quantity">
                                <label>Jumlah:</label>
                                <div className="qty-controls">
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="qty-value">{qty}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQty(qty + 1)}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>
                            </div>

                            <button
                                className={`btn-detail-cart ${added ? "added" : ""}`}
                                onClick={handleAddToCart}
                            >
                                {added ? (
                                    <><FiCheck size={20} /> Ditambahkan!</>
                                ) : (
                                    <><FiShoppingCart size={20} /> Tambah ke Keranjang — {formatRupiah(food.harga * qty)}</>
                                )}
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default FoodDetailPage;
