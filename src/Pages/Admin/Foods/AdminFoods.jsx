import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Row, Col } from "react-bootstrap";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import ConfirmModal from "../../../Components/ConfirmModal/ConfirmModal";
import axiosInstance from "../../../Utils/axiosInstance";
import "./AdminFoods.css";

const AdminFoods = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({
        nama_makanan: "",
        harga: "",
        deskripsi: "",
        category_id: "",
        foto: null
    });

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [foodRes, catRes] = await Promise.all([
                axiosInstance.get("/food"),
                axiosInstance.get("/kategori")
            ]);
            setFoods(foodRes.data.data || []);
            setCategories(catRes.data.data || []);
        } catch (err) {
            toast.error("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (data = null) => {
        if (data) {
            setEditData(data);
            setFormData({
                nama_makanan: data.nama_makanan,
                harga: data.harga,
                deskripsi: data.deskripsi,
                category_id: data.category_id,
                foto: null
            });
        } else {
            setEditData(null);
            setFormData({
                nama_makanan: "",
                harga: "",
                deskripsi: "",
                category_id: "",
                foto: null
            });
        }
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, foto: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("nama_makanan", formData.nama_makanan);
        data.append("harga", formData.harga);
        data.append("deskripsi", formData.deskripsi);
        data.append("category_id", formData.category_id);
        if (formData.foto) data.append("foto", formData.foto);

        try {
            if (editData) {
                await axiosInstance.patch(`/food/update/${editData.id}`, data);
                toast.success("Makanan berhasil diupdate");
            } else {
                await axiosInstance.post("/food/create", data);
                toast.success("Makanan berhasil ditambahkan");
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
            await axiosInstance.delete(`/food/delete/${deleteTarget}`);
            toast.success("Makanan berhasil dihapus");
            fetchData();
        } catch (err) {
            toast.error("Gagal menghapus data");
        } finally {
            setDeleteTarget(null);
        }
    };

    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    return (
        <div className="admin-foods-page">
            <div className="admin-page-header">
                <h2 className="admin-page-title">Manage Foods</h2>
                <Button className="btn-add-admin" onClick={() => handleShowModal()}>
                    <FiPlus /> Tambah Makanan
                </Button>
            </div>

            <div className="admin-table-card">
                <Table responsive hover className="admin-table">
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Nama</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.map((food) => {
                            const cat = categories.find(c => c.id === food.category_id);
                            return (
                                <tr key={food.id}>
                                    <td>
                                        <img src={food.foto || "https://via.placeholder.com/50"} alt={food.nama_makanan} className="table-img-admin" />
                                    </td>
                                    <td>
                                        <div className="fw-bold">{food.nama_makanan}</div>
                                        <small className="text-muted">{food.deskripsi.substring(0, 40)}...</small>
                                    </td>
                                    <td>
                                        <Badge bg="light" className="text-dark border">{cat?.nama_category || "N/A"}</Badge>
                                    </td>
                                    <td className="text-orange fw-bold">{formatRupiah(food.harga)}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button className="btn-action-edit" onClick={() => handleShowModal(food)}><FiEdit2 /></button>
                                            <button className="btn-action-delete" onClick={() => handleDeleteClick(food.id)}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editData ? "Edit Makanan" : "Tambah Makanan Baru"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nama Makanan</Form.Label>
                                    <Form.Control 
                                        className="form-control-custom"
                                        value={formData.nama_makanan}
                                        onChange={(e) => setFormData({ ...formData, nama_makanan: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Harga (IDR)</Form.Label>
                                    <Form.Control 
                                        type="number"
                                        className="form-control-custom"
                                        value={formData.harga}
                                        onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Kategori</Form.Label>
                            <Form.Select 
                                className="form-control-custom"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nama_category}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Deskripsi</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                className="form-control-custom"
                                value={formData.deskripsi}
                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Foto Makanan</Form.Label>
                            <Form.Control 
                                type="file"
                                className="form-control-custom"
                                onChange={handleFileChange}
                            />
                            {editData && !formData.foto && <small className="text-muted">Biarkan kosong jika tidak ingin mengubah foto</small>}
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="light" onClick={() => setShowModal(false)}>Batal</Button>
                            <Button type="submit" className="btn-add-admin">
                                {editData ? "Update Makanan" : "Simpan Makanan"}
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
                message="Makanan ini akan dihapus dari menu!" 
                confirmText="Ya, Hapus" 
            />
        </div>
    );
};

export default AdminFoods;
