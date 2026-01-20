import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  /* ================= STATE ================= */
  const [products, setProducts] = useState([]);
  const [activeGroup, setActiveGroup] = useState("");
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);    
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  /* ================= CATEGORY MAP ================= */
  const GROUP_CATEGORY_MAP = {
    VOT: ["vot-cau-long", "vot-tennis"],
    GIAY: ["giay-cau-long", "giay-tennis"],
    AO: ["ao-cau-long", "ao-tennis"],
    QUAN: ["quan-cau-long", "quan-tennis"],
    TUI: ["tui-cau-long", "tui-tennis"],
    PHUKIEN: ["phu-kien-cau-long", "phu-kien-tennis"],
  };
  // Hàm xử lý kéo chuột
  const handleMouseDown = (e) => {
    setIsDown(true);
    setIsDragging(false); // Reset lại trạng thái khi mới nhấn xuống
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    
    // Nếu di chuyển chuột hơn 5 pixel thì xác định là đang kéo (Drag)
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true);
    }
    
    e.preventDefault();
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleLinkClick = (e) => {
    if (isDragging) {
      e.preventDefault(); // Ngăn chuyển trang khi đang kéo
    }
  };
  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/products/sanpham")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.log("Lỗi API:", err));
  }, []);

  /* ================= FILTER PRODUCTS ================= */
  const filteredProducts = products.filter((p) => {
    if (!activeGroup) return true;
    return GROUP_CATEGORY_MAP[activeGroup]?.includes(p.category);
  });

  /* ================= SLIDER ================= */
  const images = [
    "/images/giay.webp",
    "/images/vot.webp",
    "/images/bata.webp",
  ];

  const trackRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      indexRef.current += 1;
      track.style.transition = "transform 1s ease-in-out";
      track.style.transform = `translateX(-${indexRef.current * 100}%)`;

      if (indexRef.current === images.length) {
        setTimeout(() => {
          track.style.transition = "none";
          track.style.transform = "translateX(0%)";
          indexRef.current = 0;
        }, 1000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {/* ================= SLIDER ================= */}
      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {images.concat(images[0]).map((img, i) => (
            <div className="carousel-slide" key={i}>
              <img src={img} alt={`slide-${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* ================= BUTTON FILTER ================= */}
      <div className="gender-buttons">
        <button className={!activeGroup ? "active" : ""} onClick={() => setActiveGroup("")}>TẤT CẢ</button>
        <button className={activeGroup === "VOT" ? "active" : ""} onClick={() => setActiveGroup("VOT")}>VỢT</button>
        <button className={activeGroup === "GIAY" ? "active" : ""} onClick={() => setActiveGroup("GIAY")}>GIÀY</button>
        <button className={activeGroup === "AO" ? "active" : ""} onClick={() => setActiveGroup("AO")}>ÁO</button>
        <button className={activeGroup === "QUAN" ? "active" : ""} onClick={() => setActiveGroup("QUAN")}>QUẦN</button>
        <button className={activeGroup === "TUI" ? "active" : ""} onClick={() => setActiveGroup("TUI")}>TÚI VỢT</button>
        <button className={activeGroup === "PHUKIEN" ? "active" : ""} onClick={() => setActiveGroup("PHUKIEN")}>PHỤ KIỆN</button>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
     <div 
      className="product-list-container"
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => setIsDown(false)}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="product-list-wrapper">
        {filteredProducts.map((item) => (
          <Link 
            to={`/detail/${item._id}`} 
            key={item._id}
            onClick={handleLinkClick} // Thêm xử lý click ở đây
            className="product-card-link"
            draggable="false"        // Quan trọng: Chặn trình duyệt kéo Link
          >
            <div className="product-card">
              <div className="product-image-wrapper">
                <img 
                  src={item.anhDaiDien} 
                  alt={item.tenSanPham} 
                  draggable="false" // Quan trọng: Chặn trình duyệt kéo Ảnh
                />
              </div>
              <div className="product-info">
                <p className="product-brand">{item.tenThuongHieu}</p>
                <p className="product-name">{item.tenSanPham}</p>
                <p className="product-price"> </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>

      {/* BANNER SECTION */}
      <div className="banner-section">
        <div className="banner-card">
          <div className="image-wrapper">
            <img
              src="/images/pro_nam_Frame_88042_(2)-min.avif"
              alt="Men Wear"
            />
          </div>
          <div className="banner-content">
            <h2>MEN WEAR</h2>
            <p>Nhập BMT Giảm 50K đơn đầu tiên từ 299k</p>
            <button>KHÁM PHÁ</button>
          </div>
        </div>

        <div className="banner-card">
          <div className="image-wrapper">
            <img
              src="/images/pro_nu_Frame_88041_(2)-min.avif"
              alt="Women Active"
            />
          </div>
          <div className="banner-content">
            <h2>WOMEN ACTIVE</h2>
            <p>Nhập CMVSEAMLESS Giảm 50K cho BST Seamless</p>
            <button>KHÁM PHÁ</button>
          </div>
        </div>
      </div>


      {/* FOOTER SECTION */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>VỀ CHÚNG TÔI</h3>
            <p>Thương hiệu thời trang thể thao hàng đầu, mang lại sự thoải mái và tự tin cho mọi hoạt động của bạn.</p>
            <div className="social-icons">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-tiktok"></i>
            </div>
          </div>

          <div className="footer-column">
            <h3>CHÍNH SÁCH</h3>
            <ul>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Chính sách vận chuyển</a></li>
              <li><a href="#">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>HỖ TRỢ KHÁCH HÀNG</h3>
            <ul>
              <li>Hotline: 1900 1234</li>
              <li>Email:trungkienn2609@gmail.com</li>
              <li>Địa chỉ: 8A/1 Cộng Hòa, Phường Tân Sơn Nhất, Thành phố Hồ Chí Minh</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>ĐĂNG KÝ NHẬN TIN</h3>
            <div className="newsletter">
              <input type="email" placeholder="Nhập email của bạn..." />
              <button>GỬI</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 BMT Store. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </>
  );
}