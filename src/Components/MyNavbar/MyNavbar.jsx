import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiSettings, FiList, FiShield } from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import { useAuth } from "../../Context/AuthContext";
import { useCart } from "../../Context/CartContext";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./MyNavbar.css";

const MyNavbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { totalItems } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogoutClick = () => {
        setShowConfirmLogout(true);
    };

    const confirmLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Navbar expand="lg" className={`navbar-custom ${scrolled ? "scrolled" : ""}`}>
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <IoFastFoodOutline className="brand-icon" />
                    Nom<span className="brand-highlight">Eat</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="mx-auto">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className={`nav-link-custom ${location.pathname === "/" ? "active" : ""}`}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/menu"
                            className={`nav-link-custom ${location.pathname === "/menu" ? "active" : ""}`}
                        >
                            Menu
                        </Nav.Link>
                    </Nav>

                    <Nav className="align-items-center gap-2">
                        <Nav.Link as={Link} to="/cart" className="nav-link-custom cart-badge">
                            <FiShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="badge-count">{totalItems}</span>
                            )}
                        </Nav.Link>

                        {isAuthenticated ? (
                            <Dropdown className="profile-dropdown" align="end">
                                <Dropdown.Toggle variant="light" id="profile-dropdown">
                                    <div className="profile-avatar">
                                        {user?.username?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                                        {user?.username || "User"}
                                    </span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {user?.role === "admin" && (
                                        <Dropdown.Item as={Link} to="/admin">
                                            <FiShield style={{ marginRight: 8 }} /> Admin Dashboard
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item as={Link} to="/profile">
                                        <FiUser style={{ marginRight: 8 }} /> My Profile
                                    </Dropdown.Item>
                                    {user?.role !== "admin" && (
                                        <Dropdown.Item as={Link} to="/orders">
                                            <FiList style={{ marginRight: 8 }} /> My Orders
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogoutClick} className="dropdown-item-logout">
                                        <FiLogOut style={{ marginRight: 8 }} /> Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-nav-login">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-nav-signup">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <ConfirmModal 
                show={showConfirmLogout} 
                onHide={() => setShowConfirmLogout(false)} 
                onConfirm={confirmLogout} 
                title="Konfirmasi Logout" 
                message="Apakah Anda yakin ingin keluar?" 
                confirmText="Ya, Logout" 
            />
        </Navbar>
    );
};

export default MyNavbar;
