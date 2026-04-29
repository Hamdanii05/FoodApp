import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import "./PaymentSuccessPage.css";

const PaymentSuccessPage = () => {
    return (
        <section className="success-page">
            <Container>
                <div className="success-card">
                    <div className="success-icon">
                        <FiCheck />
                    </div>
                    <h2 className="success-title">Pesanan Berhasil!</h2>
                    <p className="success-text">
                        Terima kasih telah memesan di NomNom. Pesanan Anda sedang diproses dan akan segera dikirim ke alamat tujuan.
                    </p>
                    <Link to="/" className="btn-success-home">
                        Kembali ke Home
                    </Link>
                </div>
            </Container>
        </section>
    );
};

export default PaymentSuccessPage;
