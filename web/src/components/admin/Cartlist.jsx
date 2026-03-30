import React, { useEffect, useState } from "react";
import axios from "axios";

function Cartlist() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const isPaid = newStatus === "dathanhtoan";
      
      await axios.put(`http://localhost:5000/api/admin/orders/${id}`, {
        status: newStatus,
        thanhtoan: isPaid
      });
      alert("Cập nhật trạng thái thành công!");
      fetchOrders(); 
    } catch (error) {
      alert("Lỗi khi cập nhật!");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/orders/${id}`);
        alert("Xóa thành công!");
        setOrders(orders.filter(order => order._id !== id));
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="order-management">
      <h2>🛒 Quản lý đơn hàng</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th>Mã đơn hàng</th>
            <th>Khách hàng (ID)</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Địa chỉ</th>
            <th>Mã PayOS</th>
            <th>Ngày tạo</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user}</td>
              <td>
                {order.chitietdonhang.map((item, index) => (
                  <div key={index}>
                    - {item.name} (x{item.quantity})
                  </div>
                ))}
              </td>
              <td>{order.tongtien?.toLocaleString()} đ</td>
              <td>{order.address}</td>
              <td>{order.payosOrderCode}</td>
              <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}</td>
              <td>
                {order.thanhtoan ? 
                  <span style={{ color: "green" }}>Đã trả tiền</span> : 
                  <span style={{ color: "red" }}>Chưa trả tiền</span>
                }
              </td>
              <td>
                <select 
                  value={order.status} 
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                >
                  <option value="dangcho">Đang chờ</option>
                  <option value="dathanhtoan">Đã thanh toán</option>
                  <option value="huy">Đã hủy</option>
                </select>
              </td>
              <td>
                <button 
                  onClick={() => handleDeleteOrder(order._id)}
                  style={{ backgroundColor: "red", color: "white", cursor: "pointer" }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cartlist;