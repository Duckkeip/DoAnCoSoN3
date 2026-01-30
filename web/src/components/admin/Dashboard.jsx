import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Admin.css";

const categoriesConfig = {
  caulong: ["ao", "balo", "giay", "phukien", "quan", "tui", "vot"],
  tennis: ["ao", "balo", "giay", "phukien", "quan", "tui", "vot"]
};


export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Để lưu file khi chọn từ máy
  const [preview, setPreview] = useState(null); // Đảm bảo dòng này có tồn tại
  const [isZoomed, setIsZoomed] = useState(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 7; // Số sản phẩm mỗi trang
    
  const [formData, setFormData] = useState({
    tenSanPham: '',
    category: 'caulong', // Đổi từ 'Cầu lông' thành 'caulong'
    loai: 'vot',         // Thêm giá trị mặc định cho loai
    tenThuongHieu: 'Asics',
    brand: 'asics',
    gia: '',
    anhDaiDien: '' 
});

const [filters, setFilters] = useState({
  category: [],
  brand: [],
  priceRange: null,
  rating: 0
});

const [dropdownOpen, setDropdownOpen] = useState({
  category: false,
  brand: false,
  price: false
});

  const API_URL = "http://localhost:5000/api/admin/products"; 

  // 1. FETCH DỮ LIỆU TỪ BACKEND
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${currentPage}&limit=${limit}`);
      // Vì backend trả về object { products, totalPages... }, nên phải set đúng:
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);



  const handleSave = async () => {
    const data = new FormData();
    
    // 1. Tạo category dạng slug (vd: vot-cau-long)
    // Lưu ý: Chúng ta đảo ngược subCat-mainCat và đổi tên cho khớp mẫu của bạn
    const categorySlug = `${formData.subCat}-${formData.mainCat}`
      .replace('caulong', 'cau-long'); // Để ra đúng cau-long thay vì caulong
  
    // 2. Tạo tenDanhMuc có dấu (vd: Vợt Cầu Lông)
    const dict = {
      caulong: "Cầu Lông", tennis: "Tennis", ao: "Áo", 
      balo: "Balo", giay: "Giày", phukien: "Phụ Kiện", 
      quan: "Quần", tui: "Túi", vot: "Vợt"
    };
    const tenDanhMuc = `${dict[formData.subCat]} ${dict[formData.mainCat]}`;
  
    // 3. Append dữ liệu (Thứ tự quan trọng: Text trước, File sau)
    data.append("tenSanPham", formData.tenSanPham);
    data.append("category", categorySlug);
    data.append("tenDanhMuc", tenDanhMuc);
    data.append("brand", formData.brand); // yonex
    data.append("tenThuongHieu", formData.tenThuongHieu); // Yonex
    data.append("gia", formData.gia);
    data.append("soLuong", formData.soLuong);
    data.append("moTa", formData.moTa);
    data.append("trangThai", "dang-ban");
    
    // Gửi thông tin bổ sung để Backend biết đường dẫn lưu file
    data.append("mainCat", formData.mainCat); 
    data.append("subCat", formData.subCat);
  
    if (selectedFile) {
      data.append("image", selectedFile);
    }
  
    try {
      await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Lưu thành công!");
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };


  // 3. XÓA SẢN PHẨM
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProducts();
        alert("Xóa sản phẩm thành công!");
      } catch (error) {
        alert("Không thể xóa sản phẩm!");
      }
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.tenSanPham, 
      category: product.category, 
      brand: product.brand,
      price: product.gia, 
      image: product.anhDaiDien 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreview(null);
    setFormData({ tenSanPham: '', mainCat: 'caulong', subCat: 'vot', brand: '', gia: '', soLuong: '', moTa: '', trangThai: 'dang-ban' });
  };
  //hàm render phân trang
  const renderPagination = () => (
    <div className="pagination">
      <button 
        disabled={currentPage === 1} 
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Trước
      </button>
  
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          className={currentPage === index + 1 ? "active" : ""}
          onClick={() => setCurrentPage(index + 1)}
        >
          {index + 1}
        </button>
      ))}
  
      <button 
        disabled={currentPage === totalPages} 
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Sau
      </button>
    </div>
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Lưu file thực tế để gửi lên server bằng FormData
      setSelectedFile(file);
  
      // 2. Tạo URL tạm thời để hiển thị ảnh ngay lập tức
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // Hàm xử lý chọn cho Mảng (Category, Brand)
const handleSelect = (type, value) => {
  setFilters(prev => {
    const current = prev[type];
    const isExist = current.includes(value);
    return {
      ...prev,
      [type]: isExist ? current.filter(item => item !== value) : [...current, value]
    };
  });
};

// Hàm xử lý chọn Giá
const handlePriceSelect = (range) => {
  setFilters(prev => ({ ...prev, priceRange: range }));
};  

  return (  
    
    <div className="dashboard-container">

      <div className="admin-header-actions">
        <h2>QUẢN LÝ KHO HÀNG</h2>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ Thêm Sản Phẩm</button>
      </div>
      
      
      <div className="pagination-wrapper top">
          {renderPagination()}
      </div>
      {/* 3. Bảng danh sách sản phẩm */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Phân loại</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.anhDaiDien || "/images/no-image.png"} className="img-thumb" alt="pro" /></td>
                <td>{p.tenSanPham}</td>
                <td><span className="badge">{p.category}</span></td>
                <td>{p.brand}</td>
                <td>{Number(p.gia).toLocaleString()}đ</td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(p)}>Sửa</button>
                  <button className="delete-btn" onClick={() => handleDelete(p._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-wrapper top">
      {renderPagination()}
      </div>
      {/* Lớp phủ phóng to ảnh */}
      {isZoomed && (
        <div 
          className="image-zoom-overlay" 
          onClick={() => setIsZoomed(false)} // Ấn vào đâu cũng đóng
        >
          <div className="zoom-container">
            <img src={preview} alt="Zoomed" className="zoomed-image" />
            <span className="close-zoom">✕</span>
          </div>
        </div>
      )}      

     {/*Modal hộp thoại*/}
     {isModalOpen && (
        <div className="admin-modal">
          <div className="modal-content">
            <h3>Thêm Sản Phẩm Mới</h3>
            
            <input type="text" placeholder="Tên sản phẩm" value={formData.tenSanPham} 
              onChange={e => setFormData({...formData, tenSanPham: e.target.value})} />
            
            <div className="row">
              <select 
                value={formData.brand} 
                onChange={(e) => {
                  const selectedBrand = e.target.value;
                  setFormData({
                    ...formData, 
                    brand: selectedBrand, 
                    // Tự động viết hoa chữ cái đầu cho tenThuongHieu (vd: lining -> Lining)
                    tenThuongHieu: selectedBrand.charAt(0).toUpperCase() + selectedBrand.slice(1)
                  });
                }}
              >
                <option value="">-- Chọn Thương Hiệu --</option>
                <option value="asics">Asics</option>
                <option value="lining">Lining</option>
                <option value="victor">Victor</option>
                <option value="yonex">Yonex</option>
              </select>
              <input type="number" placeholder="Số lượng" value={formData.soLuong} 
                onChange={e => setFormData({...formData, soLuong: e.target.value})} />
            </div>

            <input type="number" placeholder="Giá bán" value={formData.gia} 
              onChange={e => setFormData({...formData, gia: e.target.value})} />

            <div className="row">
              <select value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: categoriesConfig[e.target.value][0]})}>
                <option value="caulong">Cầu lông</option>
                <option value="tennis">Tennis</option>
              </select>

              <select value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})}>
                {categoriesConfig[formData.mainCat]?.map(item => (
                  <option key={item} value={item}>{item.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <textarea placeholder="Mô tả sản phẩm" value={formData.moTa} 
              onChange={e => setFormData({...formData, moTa: e.target.value})} />

       
            <div className="upload-section">
             <label style={{marginBottom: '10px', fontWeight: 'bold'}}>Ảnh sản phẩm:</label>
  
            {!preview ? (
              <input type="file" accept="image/*" onChange={handleImageChange} />
            ) : (
              <div style={{ position: 'relative' }}>
                <img 
                  src={preview} 
                  alt="preview" 
                  className="img-preview" 
                  onClick={() => setIsZoomed(true)} // Mở chế độ phóng to
                  title="Click để phóng to"
                />
                <button 
                  type="button"
                  onClick={() => { setPreview(null); setSelectedFile(null); }}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(255,0,0,0.7)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
            <div className="modal-actions">
              <button onClick={handleSave} className="save-btn">Lưu sản phẩm</button>
              <button onClick={closeModal} className="cancel-btn">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
