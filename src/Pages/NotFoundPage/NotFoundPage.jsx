import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaHome, FaUtensils } from "react-icons/fa";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <Container fluid className="not-found-wrapper d-flex align-items-center justify-content-center">
      <Row className="w-100 text-center">
        <Col md={8} lg={6} className="mx-auto">
          <div className="error-content">
            <h1 className="error-code">404</h1>
            <h2 className="error-title">Oops! Halaman Tidak Ditemukan</h2>
            <p className="error-description text-muted">
              Kami tidak dapat menemukan halaman yang Anda cari. Halaman mungkin telah dipindahkan, 
              atau URL yang dimasukkan salah. Mari kembali ke jalan yang benar!
            </p>
            <div className="error-actions mt-4 d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/">
                <Button variant="primary" className="btn-modern rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                  <FaHome /> Kembali ke Beranda
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline-primary" className="btn-modern-outline rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                  <FaUtensils /> Jelajahi Menu
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
