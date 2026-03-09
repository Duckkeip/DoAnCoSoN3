
import React, { useState, useEffect ,useRef} from "react";
import { useNavigate } from "react-router-dom";

import "./Intro.css"
export default function Intro() {
  const infoSection = useRef(null);

  // 2. Hàm xử lý khi ấn nút
  const scrollToSection = () => {
    infoSection.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    // 1. Tạo Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Nếu phần tử đi vào vùng nhìn thấy của màn hình
          if (entry.isIntersecting) {
            entry.target.classList.add("active"); // Thêm class để kích hoạt CSS Transition
            // observer.unobserve(entry.target); // (Tùy chọn) Bỏ theo dõi nếu chỉ muốn hiện 1 lần duy nhất
          } else {
            // (Tùy chọn) Nếu muốn khi cuộn lên nó ẩn đi và cuộn xuống lại hiện lại
            // entry.target.classList.remove("active");
          }
        });
      },
      {
        root: null, // Lấy viewport (màn hình chính) làm chuẩn
        threshold: 0.2, // Khi 20% phần tử hiện ra thì kích hoạt
      }
    );

    // 2. Lấy tất cả các phần tử có class fade-in-element
    const hiddenElements = document.querySelectorAll(".fade-in-element");
    
    // 3. Bắt đầu theo dõi từng phần tử
    hiddenElements.forEach((el) => observer.observe(el));

    // 4. Cleanup function: Bỏ theo dõi khi component bị hủy (unmount)
    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []); // [] đảm bảo chỉ chạy 1 lần duy nhất khi component load

  return (
    <div className="intro-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>BMT STORE</h1>
          <p>Nâng tầm phong cách thể thao của bạn</p>
          <button className="cta-button" onClick={scrollToSection}>
            Khám Phá Ngay
          </button>
        </div>
      </section>

      {/* ABOUT US SECTION - Thêm các class fade-in-element vào đây */}
      <section className="about-details" ref={infoSection}>
        <div className="container">
          {/* Thêm hiệu ứng cho phần tiêu đề */}
          <div className="section-header fade-in-element">
            <h2>Câu Chuyện Của Chúng Tôi</h2>
            <div className="underline"></div>
          </div>
          
          <div className="about-grid">
            {/* Thêm hiệu ứng cho đoạn văn */}
            <div className="about-text fade-in-element">
              <p>
                Được thành lập từ năm 2024, <strong>BMT Store</strong> không chỉ bán quần áo, 
                chúng tôi mang đến giải pháp cho lối sống năng động. Mỗi sản phẩm đều được 
                chọn lọc kỹ lưỡng về chất liệu và thiết kế.
              </p>
            </div>
            
            <div className="stats-grid">
              {/* Thêm hiệu ứng cho từng thẻ thống kê (chú ý CSS nth-child bên trên) */}
              <div className="stat-box fade-in-element">
                <span className="stat-number">5+</span>
                <p>Năm kinh nghiệm</p>
              </div>
              <div className="stat-box fade-in-element">
                <span className="stat-number">10k+</span>
                <p>Khách hàng tin dùng</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
        </div>
    );
}
