import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IoFastFoodOutline } from "react-icons/io5";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer-section">
            <Container>
                <Row className="g-4">
                    <Col lg={4} md={6}>
                        <div className="footer-brand">
                            <IoFastFoodOutline style={{ color: "var(--accent-orange)" }} />
                            Nom<span className="brand-highlight">Eat</span>
                        </div>
                        <p className="footer-desc">
                            Nikmati hidangan lezat dari restoran terbaik, langsung diantar ke pintu rumah Anda
                            dengan cepat dan aman.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="footer-social-link"><FaInstagram /></a>
                            <a href="#" className="footer-social-link"><FaTwitter /></a>
                            <a href="#" className="footer-social-link"><FaFacebookF /></a>
                        </div>
                    </Col>

                    <Col lg={2} md={6}>
                        <h5 className="footer-title">Menu</h5>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/menu">Menu</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6}>
                        <h5 className="footer-title">Quick Links</h5>
                        <ul className="footer-links">
                            <li><Link to="/register">Sign Up</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6}>
                        <h5 className="footer-title">Contact Us</h5>
                        <div className="footer-contact-item">
                            <FiMapPin className="footer-contact-icon" />
                            <span>Jl. Raya No. 123, Kota Solo</span>
                        </div>
                        <div className="footer-contact-item">
                            <FiPhone className="footer-contact-icon" />
                            <span>+62 812 3456 7890</span>
                        </div>
                        <div className="footer-contact-item">
                            <FiMail className="footer-contact-icon" />
                            <span>SaungNom@yahoo.id</span>
                        </div>
                    </Col>
                </Row>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} NomEat. Made with <span className="heart">♥</span> in Indonesia</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
