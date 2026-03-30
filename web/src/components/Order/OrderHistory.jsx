// components/cart/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import "./OrderHistory.css"; // Bạn có thể tự tạo CSS để trang trí thêm

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy user_id từ localStorage (giống cách bạn làm ở trang Cart)
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id || user?._id;

  useEffect(() => {
    if (user_id) {
      fetchOrders();
    }
  }, [user_id]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/order/user/${user_id}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Lỗi lấy lịch sử đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "dangcho": return <span className="status-pending">Đang chờ</span>;
      case "dathanhtoan": return <span className="status-success">Đã thanh toán</span>;
      case "huy": return <span className="status-cancel">Đã hủy</span>;
      default: return status;
    }
  };

  if (loading) return <div className="container mt-5">Đang tải đơn hàng...</div>;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4">Lịch sử đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="card mb-4 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center bg-white">
                <span><strong>Mã ĐH:</strong> {order.payosOrderCode || order._id}</span>
                <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h6>Chi tiết sản phẩm:</h6>
                    {order.chitietdonhang.map((item, index) => (
                      <div key={index} className="d-flex align-items-center mb-2 border-bottom pb-2">
                        <img src={item.image} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "contain" }} className="me-3" />
                        <div>
                          <p className="mb-0 fw-bold">{item.name}</p>
                          <small className="text-muted">Số lượng: {item.quantity} x {item.price?.toLocaleString()}₫</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-md-4 border-start text-end">
                    <p className="mb-1"><strong>Tổng tiền:</strong> <span className="text-danger fs-5">{order.tongtien?.toLocaleString()}₫</span></p>
                    <p className="mb-1"><strong>Trạng thái:</strong> {getStatusText(order.status)}</p>
                    <p className="mb-1"><strong>Thanh toán:</strong> {order.thanhtoan ? "Đã trả tiền" : "Chưa trả tiền"}</p>
                    <p className="mb-0 text-muted small"><strong>Địa chỉ:</strong> {order.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;