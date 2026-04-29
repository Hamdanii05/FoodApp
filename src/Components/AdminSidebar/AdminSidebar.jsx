import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiGrid, FiBox, FiLayers, FiShoppingCart, FiLogOut, FiHome, FiUsers } from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import { useAuth } from "../../Context/AuthContext";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./AdminSidebar.css";

const AdminSidebar = ({ isOpen, closeSidebar }) => {
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowConfirmLogout(true);
    };

    const confirmLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className={`admin-sidebar ${isOpen ? 'show' : ''}`}>
            <div className="admin-sidebar-header">
                <div className="admin-logo">
                    <IoFastFoodOutline color="var(--accent-orange)" />
                    Nom<span>Eat</span> 
                </div>
            </div>

            <nav className="admin-menu">
                <div className="admin-menu-label">Menu Utama</div>
                
                <NavLink to="/admin" end className="admin-menu-item" onClick={closeSidebar}>
                    <FiGrid className="admin-menu-icon" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin/foods" className="admin-menu-item" onClick={closeSidebar}>
                    <FiBox className="admin-menu-icon" />
                    <span>Manage Foods</span>
                </NavLink>

                <NavLink to="/admin/categories" className="admin-menu-item" onClick={closeSidebar}>
                    <FiLayers className="admin-menu-icon" />
                    <span>Categories</span>
                </NavLink>

                <NavLink to="/admin/orders" className="admin-menu-item" onClick={closeSidebar}>
                    <FiShoppingCart className="admin-menu-icon" />
                    <span>Customer Orders</span>
                </NavLink>

                <NavLink to="/admin/users" className="admin-menu-item" onClick={closeSidebar}>
                    <FiUsers className="admin-menu-icon" />
                    <span>Manage Users</span>
                </NavLink>

                <div className="admin-menu-label" style={{ marginTop: 24 }}>System</div>
                
                <NavLink to="/" className="admin-menu-item" onClick={closeSidebar}>
                    <FiHome className="admin-menu-icon" />
                    <span>Back to Website</span>
                </NavLink>
            </nav>

            <div className="admin-sidebar-footer">
                <button onClick={handleLogoutClick} className="btn-admin-logout">
                    <FiLogOut /> Logout
                </button>
            </div>

            <ConfirmModal 
                show={showConfirmLogout} 
                onHide={() => setShowConfirmLogout(false)} 
                onConfirm={confirmLogout} 
                title="Konfirmasi Logout" 
                message="Apakah Anda yakin ingin keluar dari panel admin?" 
                confirmText="Ya, Logout" 
            />
        </aside>
    );
};

export default AdminSidebar;
