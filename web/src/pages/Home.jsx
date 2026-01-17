import { useEffect, useRef } from 'react';
import './Home.css';
import React, { useState } from 'react';

const products = [
  { id: 1, gender: 'male', name: 'ÁO KHOÁC', image: '/images/ao-khoac_13.avif' },
  { id: 2, gender: 'male', name: 'HOODIE & SWEATER', image: '/images/hoodie_93.avif' },
  { id: 3, gender: 'male', name: 'ÁO DÀI TAY', image: '/images/ao-dai-tay_75.avif' },
  { id: 4, gender: 'male', name: 'ÁO POLO', image: '/images/polo_77.avif' },
  { id: 5, gender: 'male', name: 'SƠ MI', image: '/images/so-mi_4.avif' },
  { id: 6, gender: 'male', name: 'ÁO THUN', image: '/images/ao-thun_63.avif' },
  { id: 7, gender: 'female', name: 'ÁO THỂ THAO', image: '/images/Ao_the_thao_31.5x.avif' },
  { id: 8, gender: 'female', name: 'VỢ t', image: '/images/Quan_the_thao_31.5x.avif' },
  { id: 9, gender: 'female', name: 'HOODIE & SWEATER', image: '/images/Hoodie__Sweater_31.5x.avif' },
  { id: 10, gender: 'female', name: 'BRA & LEGGINGS', image: '/images/Bra__Legging_31.5x.avif' },
  { id: 11, gender: 'female', name: 'VÁY THỂ THAO', image: '/images/Vay_nu_3a1.5x.avif' },
  { id: 12, gender: 'female', name: 'PHỤ KIỆN', image: '/images/Phu_kien_31.5x.avif' },
];
export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  const images = [
    "../../public/images/giay.webp",
    "../../public/images/vot.webp",
    "../../public/images/bata.webp",
    
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

  const [gender, setGender] = useState("male");
  const filtered = products.filter((p) => p.gender === gender);

  return (
    <>
      {/*  SLIDER */}
      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {images.concat(images[0]).map((img, i) => (
            <div className="carousel-slide" key={i}>
              <img src={img} alt={`slide-${i}`} />
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON LỌC GIỚI TÍNH */}
      <div className="gender-buttons">
        <button
          className={gender === "male" ? "active" : ""}
          onClick={() => setGender("male")}
        >
          VỢT
        </button>
        <button
          className={gender === "female" ? "active" : ""}
          onClick={() => setGender("female")}
        >
          GIÀY
        </button>
        <button
          className={gender === "female" ? "active" : ""}
          onClick={() => setGender("female")}
        >
          ÁO
        </button>
        <button
          className={gender === "female" ? "active" : ""}
          onClick={() => setGender("female")}
        >
          QUẦN
        </button>
        <button
          className={gender === "female" ? "active" : ""}
          onClick={() => setGender("female")}
        >
          TÚI VỢT
        </button>
        <button
          className={gender === "female" ? "active" : ""}
          onClick={() => setGender("female")}
        >
          PHỤ KIỆN
        </button>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="product-list">
        {filtered.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="product-image-wrapper">
              <img src={item.image} alt={item.name} />
            </div>
            <p>{item.name}</p>
          </div>
        ))}
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