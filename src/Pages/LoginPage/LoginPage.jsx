import { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock } from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "../../Utils/axiosInstance";
import "./LoginPage.css";

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axiosInstance.post("/login", form);
            login(res.data.data.token);
            toast.success("Login Berhasil! Selamat datang kembali.");
            navigate("/menu");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Username atau password salah!";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-left-content">
                    <img
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
                        alt="Food"
                        className="auth-left-img"
                    />
                    <h2>Selamat Datang Kembali!</h2>
                    <p>Login untuk memesan makanan favorit Anda dan nikmati berbagai promo menarik.</p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-wrapper">
                    <div className="auth-brand">
                        <IoFastFoodOutline style={{ color: "var(--accent-orange)" }} />
                        Nom<span className="highlight">Eat</span>
                    </div>

                    <h3 className="auth-title">Login</h3>
                    <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan</p>

                    {error && (
                        <div className="text-danger small mb-3 text-center fw-bold px-2 py-1" style={{ backgroundColor: "rgba(255,0,0,0.1)", borderRadius: "6px" }}>
                            {error}
                        </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="form-label-custom">Username</Form.Label>
                            <div className="input-icon-wrapper">
                                <FiUser className="input-icon" />
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Masukkan username"
                                    className="form-control-custom input-with-icon"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="form-label-custom">Password</Form.Label>
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Masukkan password"
                                    className="form-control-custom input-with-icon"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <button
                            type="submit"
                            className="btn-auth-submit"
                            disabled={loading}
                        >
                            {loading ? "Memproses..." : "Login"}
                        </button>
                    </Form>

                    <p className="auth-link">
                        Belum punya akun? <Link to="/register">Daftar di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
