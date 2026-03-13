import React, { useEffect, useRef } from "react"; // Thêm useRef để tránh gọi API 2 lần
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const calledAPI = useRef(false); // Dùng để chặn React StrictMode gọi 2 lần

  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    // 1. Nếu khách bấm hủy
    if (status === "CANCELLED") {
      window.alert("Thanh toán đã bị hủy.");
      navigate("/cart");
      return;
    }

    // 2. Nếu thanh toán thành công (PAID) và chưa gọi API cập nhật
    if (status === "PAID" && orderCode && !calledAPI.current) {
      calledAPI.current = true; // Đánh dấu đã gọi

      // GỌI BACKEND CẬP NHẬT MONGODB NGAY TẠI ĐÂY
      fetch(`http://localhost:5000/api/pay/confirm-order/${orderCode}`, {
        method: "PUT",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("✅ Đã cập nhật MongoDB thành công");
          }
        })
        .catch((err) => console.error("❌ Lỗi cập nhật đơn hàng:", err));
    }
  }, [status, orderCode, navigate]);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h2>Thanh toán thành công!</h2>
        <p>Cảm ơn bạn đã tin tưởng mua sắm tại <strong>BMT Store</strong>.</p>
        
        <div className="order-details">
          <p>Mã đơn hàng: <strong>#{orderCode}</strong></p>
          <p>Trạng thái: <span className="status-badge">Đã hoàn tất</span></p>
        </div>

        <div className="success-actions">
          <button onClick={() => navigate("/")} className="btn-home">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;