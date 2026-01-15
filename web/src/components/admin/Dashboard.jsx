import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Cầu lông', price: '', image: '' });

  const API_URL = "http://localhost:5000/api/admin"; // Thay đổi theo port của backend bạn

  // 1. FETCH DỮ LIỆU TỪ BACKEND
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. LƯU SẢN PHẨM (THÊM HOẶC SỬA)
  const handleSave = async () => {
    try {
      if (editingProduct) {
        // Gọi API cập nhật (PUT)
        await axios.put(`${API_URL}/${editingProduct._id}`, formData);
        alert("Cập nhật thành công!");
      } else {
        // Gọi API thêm mới (POST)
        await axios.post(API_URL, formData);
        alert("Thêm sản phẩm thành công!");
      }
      fetchProducts(); // Tải lại danh sách
      closeModal();
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  // 3. XÓA SẢN PHẨM
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Không thể xóa sản phẩm!");
      }
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      category: product.category, 
      price: product.price, 
      image: product.image 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'Cầu lông', price: '', image: '' });
  };

  return (
    <div className="dashboard-container">
      <div className="admin-header-actions">
        <h2>QUẢN LÝ KHO HÀNG (MONGODB)</h2>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ Thêm Sản Phẩm</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Phân loại</th>
            <th>Giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td><img src={p.image || "/images/no-image.png"} className="img-thumb" alt="pro" /></td>
              <td>{p.name}</td>
              <td><span className="badge">{p.category}</span></td>
              <td>{Number(p.price).toLocaleString()}đ</td>
              <td>
                <button className="edit-btn" onClick={() => openEdit(p)}>Sửa</button>
                <button className="delete-btn" onClick={() => handleDelete(p._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content">
            <h3>{editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>
            <input 
              type="text" placeholder="Tên sản phẩm" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Cầu lông">Cầu lông</option>
              <option value="Quần vợt">Quần vợt</option>
              <option value="Phụ kiện">Phụ kiện</option>
            </select>
            <input 
              type="number" placeholder="Giá" 
              value={formData.price} 
              onChange={(e) => setFormData({...formData, price: e.target.value})} 
            />
            <input 
              type="text" placeholder="URL Ảnh sản phẩm (tạm thời)" 
              value={formData.image} 
              onChange={(e) => setFormData({...formData, image: e.target.value})} 
            />
            <div className="modal-actions">
              <button onClick={handleSave} className="save-btn">Lưu</button>
              <button onClick={closeModal} className="cancel-btn">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}