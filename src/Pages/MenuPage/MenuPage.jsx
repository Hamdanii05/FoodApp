import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axiosInstance from "../../Utils/axiosInstance";
import FoodCard from "../../Components/FoodCard/FoodCard";
import "./MenuPage.css";

const MenuPage = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get("category") || "";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [foodRes, catRes] = await Promise.all([
                axiosInstance.get("/food"),
                axiosInstance.get("/kategori"),
            ]);
            setFoods(foodRes.data.data || []);
            setCategories(catRes.data.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryFilter = (catId) => {
        if (catId === activeCategory) {
            searchParams.delete("category");
        } else {
            searchParams.set("category", catId);
        }
        setSearchParams(searchParams);
    };

    const filteredFoods = foods.filter((food) => {
        const matchSearch = food.nama_makanan
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchCategory = activeCategory
            ? food.category_id === parseInt(activeCategory)
            : true;
        return matchSearch && matchCategory;
    });

    const SkeletonCard = () => (
        <div className="skeleton-card">
            <div className="skeleton-img"></div>
            <div className="skeleton-body">
                <div className="skeleton-line w-80"></div>
                <div className="skeleton-line w-60"></div>
                <div className="skeleton-line w-40"></div>
            </div>
        </div>
    );

    return (
        <section className="menu-page">
            <Container>
                <div className="menu-page-header">
                    <h1 className="menu-page-title">Menu Kami</h1>
                    <p className="menu-page-subtitle">
                        Jelajahi berbagai pilihan makanan lezat yang tersedia
                    </p>
                </div>

                <div className="menu-toolbar">
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" size={18} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Cari makanan favorit..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="category-filter" style={{ marginBottom: 32 }}>
                    <button
                        className={`category-pill ${!activeCategory ? "active" : ""}`}
                        onClick={() => {
                            searchParams.delete("category");
                            setSearchParams(searchParams);
                        }}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-pill ${activeCategory === String(cat.id) ? "active" : ""}`}
                            onClick={() => handleCategoryFilter(String(cat.id))}
                        >
                            {cat.nama_category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Row className="g-4">
                        {[...Array(8)].map((_, i) => (
                            <Col xs={12} sm={6} md={4} lg={3} key={i}>
                                <SkeletonCard />
                            </Col>
                        ))}
                    </Row>
                ) : filteredFoods.length > 0 ? (
                    <Row className="g-4">
                        {filteredFoods.map((food) => {
                            const cat = categories.find((c) => c.id === food.category_id);
                            return (
                                <Col xs={12} sm={6} md={4} lg={3} key={food.id}>
                                    <FoodCard food={food} categoryName={cat?.nama_category} />
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <div className="menu-empty">
                        <div className="menu-empty-icon">🍽️</div>
                        <h4>Makanan tidak ditemukan</h4>
                        <p>Coba ubah kata kunci atau filter kategori</p>
                    </div>
                )}
            </Container>
        </section>
    );
};

export default MenuPage;
