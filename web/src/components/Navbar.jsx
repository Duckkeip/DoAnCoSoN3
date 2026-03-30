import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { GoPersonFill } from "react-icons/go";
import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user ? (user._id || user.id) : "guest";
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/products/sanpham")
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(err => console.log(err));
  }, []);
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const liveSearchResults = products.filter(p => 
    searchTerm.trim() !== "" && 
    (p.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase()) || 
     p.tenThuongHieu.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setShowResults(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = async () => {
    if (user) {
      try {
        await fetch(`http://localhost:5000/api/cart/${userId}/clear`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("💥 Lỗi xoá giỏ hàng:", err);
      }
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img
              src="/images/logoBMT.png"
              alt="BMT"
              className="logo"
            />
          </Link>
        </div>

        <div className="navbar-center">
          <div className="navbar-links">
            <Link to="/">TRANG CHỦ</Link>
          </div>
          
          <div className="navbar-links has-dropdown">
            <Link to="/products" className="main-link">SẢN PHẨM </Link>
            
            <div className="dropdown-menu">
              <div className="dropdown-column">
                <h4>CẦU LÔNG</h4>
                <Link to="/products?category=vot-cau-long">Vợt Cầu Lông</Link>
                <Link to="/products?category=giay-cau-long">Giày Cầu Lông</Link>
                <Link to="/products?category=ao-cau-long"> Áo cầu Lông</Link>
                <Link to="/products?category=quan-cau-long">Quần cầu Lông</Link>
                <Link to="/products?category=tui-cau-long">Túi Vợt Cầu Lông</Link>
                <Link to="/products?category=phu-kien-cau-long">Phụ Kiện Cầu Lông</Link>
              </div>
              
              <div className="dropdown-column">
                <h4>QUẦN VỢT</h4>
                <Link to="/products?category=vot-tennis">Vợt Tennis</Link>
                <Link to="/products?category=giay-tennis">Giày Tennis</Link>
                <Link to="/products?category=ao-tennis"> Áo Tennis</Link>
                <Link to="/products?category=quan-tennis">Quần Tennis</Link>
                <Link to="/products?category=tui-tennis">Túi Vợt Tennis</Link>
                <Link to="/products?category=phu-kien-tennis">Phụ Kiện Tennis</Link>
              </div>

              <div className="dropdown-column">
                <h4>THƯƠNG HIỆU</h4>
                <Link to="/products?brand=yonex">Yonex</Link>
                <Link to="/products?brand=victor">Victor</Link>
                <Link to="/products?brand=lining">Lining</Link>
                <Link to="/products?brand=asics">Asics</Link>
              </div>
            </div>
          </div>

          <div className="navbar-links">
            <Link to="/orders" style={{ marginRight: "15px", textDecoration: "none", color: "blue" }}>ĐƠN HÀNG</Link>
          </div>

          <div className="navbar-links">
            <Link to="/news">TIN TỨC</Link>
          </div>
          <div className="navbar-links">
            <Link to="/intro">GIỚI THIỆU</Link>
          </div>
          <div className="navbar-links">
            <Link to="/contact">LIÊN HỆ</Link>
          </div>
        </div>

        <div className="navbar-right">
          <div className="search-container" ref={searchRef}>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                onKeyDown={handleSearch}
                onFocus={() => setShowResults(true)}
              />
              <FaSearch size={18} color="gray" className="search-icon" />
            </div>

            {showResults && searchTerm.trim() !== "" && (
              <div className="search-results-dropdown">
                <div className="search-summary">
                  Tìm thấy {liveSearchResults.length} sản phẩm
                </div>
                
                <div className="search-results-list">
                  {liveSearchResults.length > 0 ? (
                    liveSearchResults.map((p) => (
                      <div 
                        key={p._id} 
                        className="search-item"
                        onClick={() => {
                          navigate(`/detail/${p._id}`);
                          setShowResults(false);
                          setSearchTerm("");
                        }}
                      >
                        <img src={p.anhDaiDien} alt={p.tenSanPham} />
                        <div className="search-item-info">
                          <p className="name">{p.tenSanPham}</p>
                          <p className="price">{p.gia?.toLocaleString()} ₫</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-result">Không có sản phẩm nào</div>
                  )}
                </div>

                {liveSearchResults.length > 0 && (
                  <div 
                    className="search-view-all" 
                    onClick={() => {
                      navigate(`/products?search=${searchTerm}`);
                      setShowResults(false);
                    }}
                  >
                    Xem tất cả kết quả
                  </div>
                )}
              </div>
            )}
          </div>

          {!user ? (
            <Link to="/login" className="login-icon">
              <GoPersonFill size={25} />
            </Link>
          ) : (
            <div className="user-info">
              <span className="welcome-text">Hi, {user.username}</span>
              <button className="logout-navbar-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}

          <Link to={`/cart/${userId}`} className="cart-icon">
            <FaShoppingCart size={25} />
          </Link>
        </div>
      </div>

      <div className="sales">
        <div className="marquee-text">
          NHẬP BMT GIẢM 50K ĐƠN ĐẦU TIÊN TỪ 299K - GIAO HÀNG TOÀN QUỐC
        </div>
      </div>
    </>
  );
}

export default Navbar;