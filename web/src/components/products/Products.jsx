import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Products.css";

const priceRanges = [
  { label: "< 100.000đ", min: 0, max: 100000 },
  { label: "100.000đ - 200.000đ", min: 100000, max: 200000 },
  { label: "200.000đ - 300.000đ", min: 200000, max: 300000 },
  { label: "300.000đ - 400.000đ", min: 300000, max: 400000 },
  { label: "400.000đ - 500.000đ", min: 400000, max: 500000 },
  { label: "> 500.000đ", min: 500000, max: Infinity }
];

function Products() {
  const location = useLocation(); 
  const user_id = location.state?.user_id || JSON.parse(localStorage.getItem("user"))?.id;
  const userId = user_id || "1";

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "", // Đổi từ types -> category
    colors: "",
    sizes: "",
    priceRange: null,
    rating: 0,
    brand: "" // Thêm brand nếu cần
  });
  
  const [dropdownOpen, setDropdownOpen] = useState({
    category: false,
    color: false,
    size: false,
    price: false,
    brand: false
  });

  // Lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    fetch("http://localhost:5000/api/products/sanpham")
      .then(res => res.json())
      .then((data) => {
        // Giả sử data.products chứa mảng các object như mẫu bạn đưa ra
        setProducts(data.products || []);
      })
      .catch((err) => console.log("Lỗi fetch sản phẩm:", err));
  }, []);

  const handleSelect = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value
    }));
  };

  const handlePriceSelect = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range
    }));
  };

  
 // 🛒 Hàm thêm vào giỏ hàng (Cập nhật key cho khớp document mới)
  const addToCart = async (product) => {
    const item = {
      product_id: product._id,
      name: product.tenSanPham, // Cập nhật từ product.name
      price: product.gia,       // Cập nhật từ product.price
      image: product.hinhAnh?.anhDaiDien, // Cập nhật từ product.image
      quantity: 1
    };

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, product: item }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Đã thêm vào giỏ hàng!");
      } else {
        alert(data.message || "Lỗi khi thêm");
      }
    } catch (err) {
      console.error(err);
      alert("💥 Lỗi khi thêm vào giỏ hàng");
    }
  };
  // Lọc sản phẩm dựa trên filters
  // Lọc sản phẩm dựa trên các thuộc tính mới
  const filteredProducts = products.filter((p) => {
    // Lưu ý: category trong document của bạn là "vot-cau-long"
    const matchCategory = !filters.category || p.category === filters.category;
    
    // Lưu ý: Giá trong document là p.gia
    const matchPrice =
      !filters.priceRange ||
      (p.gia >= filters.priceRange.min && p.gia <= filters.priceRange.max);
    
    // Các field như color, size, rating nếu trong DB mới chưa có thì mặc định true hoặc bổ sung sau
    const matchColor = !filters.colors || p.color === filters.colors;
    const matchRating = !filters.rating || (p.rating || 0) >= filters.rating;

    return matchCategory && matchPrice && matchColor && matchRating;
  });

  return (
    <div className="p-product-container">
      <aside className="p-product-sidebar">
        <h2>Bộ lọc</h2>

        <FilterDropdown
          label="Danh mục"
          open={dropdownOpen.category}
          toggle={() => setDropdownOpen((p) => ({ ...p, category: !p.category }))}
          // Value ở đây nên khớp với field 'category' trong DB (ví dụ: 'vot-cau-long')
          options={[
            "vot-cau-long",
            "giay-cau-long", 
            "ao-cau-long",
            "quan-cau-long",
            "tui-cau-long",
            "phu-kien-cau-long",
            "vot-tennis",
            "giay-tennis",
            "ao-tennis",
            "quan-tennis",
            "tui-tennis",
            "phu-kien-tennis"]} 
          active={filters.category}
          onSelect={(v) => handleSelect("category", v)}
        />

        <FilterPriceDropdown
          open={dropdownOpen.price}
          toggle={() => setDropdownOpen((p) => ({ ...p, price: !p.price }))}
          ranges={priceRanges}
          active={filters.priceRange}
          onSelect={handlePriceSelect}
        />

        <button
          className="p-btn-reset"
          onClick={() =>
            setFilters({
              category: "",
              colors: "",
              sizes: "",
              priceRange: null,
              rating: 0,
              brand: ""
            })
          }
        >
          Xóa bộ lọc
        </button>
      </aside>

      <main className="p-product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div className="p-product-card" key={p._id}>
              {/* Truy cập phần tử đầu tiên của mảng hinhAnh để lấy anhDaiDien */}
              <img 
                // Lấy phần tử đầu tiên của mảng hinhAnh, sau đó truy cập anhDaiDien
                src={p.anhDaiDien} 
                alt={p.tenSanPham} 
                className="p-product-image"
              />
              
              <div className="p-product-name">{p.tenSanPham}</div>
              <div className="p-product-info">{p.tenThuongHieu}</div>
              
              <div className="p-product-info text-success">
                {p.gia ? p.gia.toLocaleString("vi-VN") : 0} ₫
              </div>

              <button className="btn-cart" onClick={() => addToCart(p)}>
                <i className="bi bi-cart"></i> Thêm vào giỏ 
              </button>

              <Link
                to={`/detail/${p._id}`}
                state={{ user_id: userId }}
                className="btn-detail"
              >
                <i className="bi bi-eye"></i> Xem chi tiết
              </Link>
            </div>
          ))
        ) : (
          <p>Không tìm thấy sản phẩm phù hợp.</p>
        )}
      </main>
    </div>
  );
}

// Các component con (FilterPriceDropdown, FilterDropdown) giữ nguyên logic hiển thị
const FilterPriceDropdown = ({ open, toggle, ranges, active, onSelect }) => (
  <div className="p-filter-group">
    <button className="p-dropdown-toggle" onClick={toggle}>
      Giá tiền <span>▼</span>
    </button>
    {open && (
      <div className="p-dropdown-menu no-checkbox">
        {ranges.map((r, i) => (
          <div
            key={i}
            className={`p-dropdown-option ${active === r ? "active" : ""}`}
            onClick={() => onSelect(r)}
          >
            {r.label}
          </div>
        ))}
      </div>
    )}
  </div>
);

const FilterDropdown = ({ label, open, toggle, options, active, onSelect }) => (
  <div className="p-filter-group">
    <button className="p-dropdown-toggle" onClick={toggle}>
      {label} <span>▼</span>
    </button>
    {open && (
      <div className="p-dropdown-menu">
        {options.map((option, i) => (
          <div
            key={i}
            className={`p-dropdown-option ${active === option ? "active" : ""}`}
            onClick={() => onSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Products;