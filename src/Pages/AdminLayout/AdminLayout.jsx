import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import AdminSidebar from "../../Components/AdminSidebar/AdminSidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="admin-layout">
            <button className="admin-mobile-toggle" onClick={toggleSidebar}>
                <FiMenu />
            </button>
            <div className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
            
            <AdminSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
            
            <main className="admin-main-content">
                <div className="admin-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
