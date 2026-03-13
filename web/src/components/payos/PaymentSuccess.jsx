import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css"; // Đừng quên tạo file CSS này nhé

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy các thông tin PayOS trả về trên URL (nếu cần hiển thị)
  const status = searchParams.get("status");
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    // Nếu status trả về từ PayOS là CANCELLED, có thể điều hướng về giỏ hàng
    if (status === "CANCELLED") {
      window.alert("Thanh toán đã bị hủy.");
      navigate("/cart");
    }
  }, [status, navigate]);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h2>Thanh toán thành công!</h2>
        <p>Cảm ơn bạn đã tin tưởng mua sắm tại <strong>BMT Store</strong>.</p>
        
        <div className="order-details">
          <p>Mã giao dịch PayOS: <strong>#{orderCode}</strong></p>
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