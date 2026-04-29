import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FiUser, FiMail, FiShield } from "react-icons/fi";
import axiosInstance from "../../Utils/axiosInstance";
import { jwtDecode } from "jwt-decode";
import "./ProfilePage.css";

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const res = await axiosInstance.get("/user");

            const users = res.data.data; 

            const token = localStorage.getItem("token");
            const decoded = jwtDecode(token);

            const currentUser = users.find(
                (u) => u.id === decoded.id
            );

            setUser(currentUser);

        } catch (error) {
            console.log("Gagal ambil user:", error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="profile-page-wrapper py-5">
            <Container>
                <div className="text-center mb-5 fade-up-element">
                    <h1 className="fw-bold">Profile</h1>
                    <p className="text-muted">Manage your personal information</p>
                </div>

                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="profile-card border-0 shadow-sm fade-up-element">
                            <Card.Body className="p-4 p-md-5">

                                {!user ? (
                                    <p className="text-center">Loading...</p>
                                ) : (
                                    <>
                                        <div className="text-center mb-4">
                                            <div className="profile-avatar-large mx-auto mb-3 shadow-sm">
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </div>

                                            <h3 className="fw-bold mb-1">
                                                {user.username}
                                            </h3>

                                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'} rounded-pill px-3 py-2`}>
                                                {user.role === 'admin' ? 'Admin' : 'Customer'}
                                            </span>
                                        </div>

                                        <hr className="my-4" />

                                        <div className="profile-details">

                                            <div className="detail-item d-flex align-items-center mb-3">
                                                <div className="detail-icon-wrapper">
                                                    <FiUser className="detail-icon" />
                                                </div>
                                                <div className="ms-3">
                                                    <small className="text-muted d-block">Username</small>
                                                    <span className="fw-semibold">
                                                        {user.username}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="detail-item d-flex align-items-center mb-3">
                                                <div className="detail-icon-wrapper">
                                                    <FiMail className="detail-icon" />
                                                </div>
                                                <div className="ms-3">
                                                    <small className="text-muted d-block">Email Address</small>
                                                    <span className="fw-semibold">
                                                        {user.email || "Tidak ada email"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="detail-item d-flex align-items-center mb-3">
                                                <div className="detail-icon-wrapper">
                                                    <FiShield className="detail-icon" />
                                                </div>
                                                <div className="ms-3">
                                                    <small className="text-muted d-block">Account Role</small>
                                                    <span className="fw-semibold text-capitalize">
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                )}

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfilePage;