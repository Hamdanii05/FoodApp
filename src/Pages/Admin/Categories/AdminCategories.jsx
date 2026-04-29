import { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Components/ConfirmModal/ConfirmModal";
import axiosInstance from "../../../Utils/axiosInstance";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [nama_category, setNamaCategory] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get("/kategori");
            setCategories(res.data.data || []);
        } catch (err) {
            toast.error("Gagal mengambil data");
        }
    };

    const handleShowModal = (data = null) => {
        if (data) {
            setEditData(data);
            setNamaCategory(data.nama_category);
        } else {
            setEditData(null);
            setNamaCategory("");
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await axiosInstance.patch(`/kategori/update/${editData.id}`, { nama_category });
                toast.success("Kategori diupdate");
            } else {
                await axiosInstance.post("/kategori/create", { nama_category });
                toast.success("Kategori ditambahkan");
            }
            fetchData();
            setShowModal(false);
        } catch (err) {
            toast.error("Gagal menyimpan data");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteTarget(id);
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await axiosInstance.delete(`/kategori/delete/${deleteTarget}`);
            toast.success("Kategori dihapus");
            fetchData();
        } catch (err) {
            toast.error("Gagal menghapus data");
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="admin-categories-page">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Manage Categories</h2>
                <Button className="btn-add-admin" onClick={() => handleShowModal()}>
                    <FiPlus /> Tambah Kategori
                </Button>
            </div>

            <div className="admin-table-card">
                <Table responsive hover className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Kategori</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.id}.</td>
                                <td className="fw-bold">{cat.nama_category}</td>
                                <td>
                                    <div className="table-actions">
                                        <button className="btn-action-edit" onClick={() => handleShowModal(cat)}><FiEdit2 /></button>
                                        <button className="btn-action-delete" onClick={() => handleDeleteClick(cat.id)}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editData ? "Edit Kategori" : "Tambah Kategori"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label>Nama Kategori</Form.Label>
                            <Form.Control 
                                className="form-control-custom"
                                value={nama_category}
                                onChange={(e) => setNamaCategory(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="light" onClick={() => setShowModal(false)}>Batal</Button>
                            <Button type="submit" className="btn-add-admin">
                                {editData ? "Update Kategori" : "Simpan Kategori"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <ConfirmModal 
                show={showConfirmDelete} 
                onHide={() => setShowConfirmDelete(false)} 
                onConfirm={confirmDelete} 
                title="Apakah Anda Yakin?" 
                message="Kategori ini akan dihapus beserta datanya!" 
                confirmText="Ya, Hapus" 
            />
        </div>
    );
};

export default AdminCategories;
