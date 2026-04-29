import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import axiosInstance from "../../Utils/axiosInstance";
import FoodCard from "../../Components/FoodCard/FoodCard";
import "./LandingPage.css";

const LandingPage = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchFoods();
        fetchCategories();
    }, []);

    const fetchFoods = async () => {
        try {
            const res = await axiosInstance.get("/food");
            setFoods(res.data.data || []);
        } catch (err) {
            console.error("Error fetching foods:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/kategori");
            setCategories(res.data.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const categoryEmojis = ["🍱", "🥤", "🍜", "🍰", "🍱", "🥗", "🌮"];

    return (
        <>

            <section className="hero-section">
                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={6}>
                            <div className="hero-content">
                                <h1>
                                    Makanan <span className="highlight">Lezat</span> <br />
                                    Diantar Cepat <br />
                                    ke Rumah Anda
                                </h1>
                                <p>
                                    Pesan makanan favorit Anda dari restoran terbaik di kota.
                                    Gratis ongkir untuk pesanan pertama!
                                </p>
                                <div className="hero-buttons">
                                    <Link to="/menu" className="btn btn-hero-primary">
                                        Lihat Menu <FiArrowRight />
                                    </Link>
                                    <Link to="/register" className="btn btn-hero-secondary">
                                        Daftar Sekarang
                                    </Link>
                                </div>
                                <div className="hero-stats">
                                    <div className="hero-stat-item">
                                        <div className="hero-stat-number">500<span className="stat-highlight">+</span></div>
                                        <div className="hero-stat-label">Menu tersedia</div>
                                    </div>
                                    <div className="hero-stat-item">
                                        <div className="hero-stat-number">15k<span className="stat-highlight">+</span></div>
                                        <div className="hero-stat-label">Pelanggan puas</div>
                                    </div>
                                    <div className="hero-stat-item">
                                        <div className="hero-stat-number">30<span className="stat-highlight">min</span></div>
                                        <div className="hero-stat-label">Waktu antar</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="hero-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"
                                    alt="Delicious Food"
                                    className="hero-image"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Categories */}
            <section className="section-padding">
                <Container>
                    <div className="section-header">
                        <p className="section-subtitle">Kategori</p>
                        <h2 className="section-title">Jelajahi Berdasarkan Kategori</h2>
                        <p className="section-desc">Pilih kategori makanan favorit Anda</p>
                    </div>
                    <Row className="g-4 justify-content-center">
                        {categories.slice(0, 6).map((cat, index) => (
                            <Col xs={6} sm={4} md={3} lg={2} key={cat.id}>
                                <Link to={`/menu?category=${cat.id}`} style={{ textDecoration: "none" }}>
                                    <div className="category-card">
                                        <div className="category-icon">
                                            {categoryEmojis[index % categoryEmojis.length]}
                                        </div>
                                        <div className="category-name">{cat.nama_category}</div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Popular Menu */}
            <section className="section-padding bg-subtle">
                <Container>
                    <div className="section-header">
                        <p className="section-subtitle">Populer</p>
                        <h2 className="section-title">Menu Paling Disukai</h2>
                        <p className="section-desc">Pilihan terfavorit dari pelanggan kami</p>
                    </div>
                    <Row className="g-4">
                        {foods.slice(0, 8).map((food) => {
                            const cat = categories.find((c) => c.id === food.category_id);
                            return (
                                <Col xs={12} sm={6} md={4} lg={3} key={food.id}>
                                    <FoodCard food={food} categoryName={cat?.nama_category} />
                                </Col>
                            );
                        })}
                    </Row>
                    {foods.length > 8 && (
                        <div className="text-center mt-5">
                            <Link to="/menu" className="btn btn-hero-primary">
                                Lihat Semua Menu <FiArrowRight />
                            </Link>
                        </div>
                    )}
                </Container>
            </section>

            {/* How It Works */}
            <section className="section-padding">
                <Container>
                    <div className="section-header">
                        <p className="section-subtitle">Cara Pesan</p>
                        <h2 className="section-title">Semudah 1, 2, 3</h2>
                    </div>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <h5 className="step-title">Pilih Menu</h5>
                                <p className="step-desc">Jelajahi berbagai pilihan menu lezat dari restoran terbaik</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <h5 className="step-title">Bayar Online</h5>
                                <p className="step-desc">Bayar dengan mudah melalui transfer, e-wallet, atau cash</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <h5 className="step-title">Diantar</h5>
                                <p className="step-desc">Pesanan diantar cepat langsung ke pintu rumah Anda</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA */}
            <section className="section-padding" style={{ paddingTop: 0 }}>
                <Container>
                    <div className="cta-section">
                        <h2>Siap Memesan?</h2>
                        <p>Daftar sekarang dan dapatkan diskon 20% untuk pesanan pertama!</p>
                        <Link to="/register" className="btn btn-cta">
                            Daftar Gratis <FiArrowRight style={{ marginLeft: 8 }} />
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default LandingPage;
