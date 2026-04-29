import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiCheck } from "react-icons/fi";
import { useCart } from "../../Context/CartContext";
import "./FoodCard.css";

const FoodCard = ({ food, categoryName }) => {
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(food);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    const fallbackImg = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80";

    return (
        <Link to={`/menu/${food.id}`} style={{ textDecoration: "none" }}>
            <div className="food-card">
                <div className="food-card-img-wrapper">
                    <img
                        src={food.foto || fallbackImg}
                        alt={food.nama_makanan}
                        className="food-card-img"
                        onError={(e) => { e.target.src = fallbackImg; }}
                    />
                    {categoryName && (
                        <span className="food-card-category">{categoryName}</span>
                    )}
                </div>
                <div className="food-card-body">
                    <h5 className="food-card-name">{food.nama_makanan}</h5>
                    <p className="food-card-desc">{food.deskripsi}</p>
                    <div className="food-card-footer">
                        <span className="food-card-price">{formatRupiah(food.harga)}</span>
                        <button
                            className={`btn-add-cart ${added ? "added" : ""}`}
                            onClick={handleAdd}
                        >
                            {added ? <FiCheck size={18} /> : <FiPlus size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default FoodCard;
