import { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiMail } from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import axiosInstance from "../../Utils/axiosInstance";
import "../LoginPage/LoginPage.css";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password !== form.confirmPassword) {
            setError("Password dan konfirmasi password tidak sama!");
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post("/register", {
                username: form.username,
                email: form.email,
                password: form.password,
            });
            setSuccess("Registrasi berhasil! Silakan login.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Registrasi gagal, coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-left-content">
                    <img
                        src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80"
                        alt="Food"
                        className="auth-left-img"
                    />
                    <h2>Bergabung Bersama Kami!</h2>
                    <p>Daftar sekarang dan nikmati kemudahan memesan makanan lezat kapan saja, di mana saja.</p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-wrapper">
                    <div className="auth-brand">
                        <IoFastFoodOutline style={{ color: "var(--accent-orange)" }} />
                        Nom<span className="highlight">Nom</span>
                    </div>

                    <h3 className="auth-title">Daftar Akun</h3>
                    <p className="auth-subtitle">Buat akun baru untuk memulai</p>

                    {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}
                    {success && <Alert variant="success" className="auth-alert">{success}</Alert>}

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

                        <Form.Group className="mb-3">
                            <Form.Label className="form-label-custom">Email</Form.Label>
                            <div className="input-icon-wrapper">
                                <FiMail className="input-icon" />
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Masukkan email"
                                    className="form-control-custom input-with-icon"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="form-label-custom">Password</Form.Label>
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Buat password"
                                    className="form-control-custom input-with-icon"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="form-label-custom">Konfirmasi Password</Form.Label>
                            <div className="input-icon-wrapper">
                                <FiLock className="input-icon" />
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Ulangi password"
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
                            {loading ? "Memproses..." : "Daftar"}
                        </button>
                    </Form>

                    <p className="auth-link">
                        Sudah punya akun? <Link to="/login">Login di sini</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
