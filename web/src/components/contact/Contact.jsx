
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
    return (
        <div>
            <h1>Welcome to the liên hệ</h1>
            
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
