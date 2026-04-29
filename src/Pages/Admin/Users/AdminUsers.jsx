import { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FiTrash2, FiShield, FiEdit, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Components/ConfirmModal/ConfirmModal";
import axiosInstance from "../../../Utils/axiosInstance";

import "./AdminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: "", username: "", email: "", password: "", role: "user" });
    const [isSaving, setIsSaving] = useState(false);

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.get("/user");
            if (data?.data) {
                setUsers(data.data);
            } else {
                setUsers(data || []);
            }
        } catch (error) {
            console.error("gagal ambil data user:", error);
            toast.error("Waduh, gagal narik data pengguna. Coba refresh deh.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = (id, username) => {
        setDeleteTarget({ id, username });
        setShowConfirmDelete(true);
    };

    const confirmDeleteUser = async () => {
        if (!deleteTarget) return;
        const { id, username } = deleteTarget;
        
        try {
            await axiosInstance.delete(`/user/delete/${id}`);
            toast.success(`Berhasil menghapus user: ${username}`);
            
            setUsers((prevUsers) => prevUsers.filter(u => u.id !== id));
        } catch (error) {
            console.error("Gagal hapus user:", error);
            toast.error("Gagal menghapus user, mungkin server lagi sibuk.");
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleShowModal = (user = null) => {
        if (user) {
            setIsEditing(true);
            setFormData({ 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                password: "", 
                role: user.role 
            });
        } else {
            setIsEditing(false);
            setFormData({ id: "", username: "", email: "", password: "", role: "user" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({ id: "", username: "", email: "", password: "", role: "user" });
        setIsEditing(false);
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditing) {
                const payload = { 
                    username: formData.username, 
                    email: formData.email, 
                    role: formData.role 
                };
                if (formData.password) {
                    payload.password = formData.password;
                }
                
                await axiosInstance.patch(`/user/update/${formData.id}`, payload);
                toast.success("Data user berhasil diupdate!");
            } else {
                await axiosInstance.post("/register", {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });
                toast.success("Mantap, user baru berhasil ditambah!");
            }
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            const errorMsg = error.response?.data?.message || "Gagal menyimpan data, coba lagi!";
            toast.error(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(date);
    };

    return (
        <div className="admin-users-page">
            <div className="admin-page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="admin-page-title m-0">User Management</h2>
                    <p className="text-muted m-0 mt-1">Kelola akun pelanggan dan admin di sini.</p>
                </div>
                <Button variant="primary" onClick={() => handleShowModal()} className="d-flex align-items-center gap-2">
                    <FiPlus /> Tambah User
                </Button>
            </div>

            <div className="admin-table-card">
                {isLoading ? (
                    <div className="text-center p-5">
                        <div className="spinner-border text-orange" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Bentar ya, lagi ngambil data user...</p>
                    </div>
                ) : (
                    <Table responsive hover className="admin-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Terdaftar Sejak</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="fw-bold">{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.role === "admin" ? (
                                                <Badge bg="primary" className="p-2 d-inline-flex align-items-center gap-1">
                                                    <FiShield /> Admin
                                                </Badge>
                                            ) : (
                                                <Badge bg="secondary" className="p-2">Customer</Badge>
                                            )}
                                        </td>
                                        <td>{formatDate(user.createdAt)}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleShowModal(user)}
                                                    title="Edit user ini"
                                                >
                                                    <FiEdit />
                                                </Button>
                                               
                                                {user.role !== "admin" ? (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        className="btn-action-delete"
                                                        onClick={() => handleDeleteUser(user.id, user.username)}
                                                        title="Hapus user ini"
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline-secondary" size="sm" disabled title="Admin gak bisa dihapus dari sini">
                                                        <FiTrash2 />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        Kok sepi? Belum ada pengguna nih.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit User" : "Tambah User Baru"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveUser}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="username"
                                value={formData.username} 
                                onChange={handleFormChange} 
                                placeholder="Masukkan username"
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email"
                                value={formData.email} 
                                onChange={handleFormChange} 
                                placeholder="nama@email.com"
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select 
                                name="role" 
                                value={formData.role} 
                                onChange={handleFormChange}
                            >
                                <option value="user">Customer</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Password 
                                {isEditing && <span className="text-muted small ms-1">(Kosongin aja kalau gak mau diganti)</span>}
                            </Form.Label>
                            <Form.Control 
                                type="password" 
                                name="password"
                                value={formData.password} 
                                onChange={handleFormChange} 
                                placeholder="Masukkan password"
                                required={!isEditing}
                                minLength={6}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit" disabled={isSaving}>
                            {isSaving ? "Lagi nyimpen..." : "Simpan"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <ConfirmModal 
                show={showConfirmDelete} 
                onHide={() => setShowConfirmDelete(false)} 
                onConfirm={confirmDeleteUser} 
                title="Apakah Anda Yakin?" 
                message={`Data user ${deleteTarget?.username} akan dihapus dan tidak bisa dikembalikan!`} 
                confirmText="Ya, Hapus" 
            />
        </div>
    );
}
