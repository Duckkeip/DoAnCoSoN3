import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { GoPersonFill } from "react-icons/go";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // ✅ Lấy user và xử lý ID (Ưu tiên _id từ MongoDB)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user ? (user._id || user.id) : "guest";

  const handleLogout = async () => {
    if (user) {
      try {
        // Xóa giỏ hàng trên server nếu cần thiết khi logout
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
        {/* Logo */}
        <div className="navbar-left">
          <Link to="/">
            <img
              src="/images/logoBMT.png" // Đường dẫn chuẩn từ thư mục public
              alt="BMT"
              className="logo"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="navbar-center">
          <div className="navbar-links">
            <Link to="/">TRANG CHỦ</Link>
          </div>
          
          <div className="navbar-links has-dropdown">
            <Link to="/products" className="main-link">SẢN PHẨM </Link>
            
            {/* MEGA MENU Đầy đủ */}
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
            <Link to="/">TIN TỨC</Link>
          </div>
          <div className="navbar-links">
            <Link to="/">GIỚI THIỆU</Link>
          </div>
          <div className="navbar-links">
            <Link to="/">LIÊN HỆ</Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm..." />
            <FaSearch size={18} color="gray" className="search-icon" />
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
            {/* Bạn có thể thêm badge số lượng sản phẩm ở đây */}
          </Link>
        </div>
      </div>

      {/* Marquee Promotion */}
      <div className="sales">
        <div className="marquee-text">
          NHẬP BMT GIẢM 50K ĐƠN ĐẦU TIÊN TỪ 299K - GIAO HÀNG TOÀN QUỐC
        </div>
      </div>
    </>
  );
}

export default Navbar;