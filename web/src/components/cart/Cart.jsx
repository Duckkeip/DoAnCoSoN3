import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const location = useLocation();
  const user_id = location.state?.user_id || JSON.parse(localStorage.getItem("user"))?.id;

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  
  useEffect(() => {
    if (!user_id) return;
    fetchCart();
  }, [user_id]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user_id}`);
      const data = await res.json();

      if (data.cart && data.cart.chitietgiohang) {
        setCartItems(data.cart.chitietgiohang);
        const sum = data.cart.chitietgiohang.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        );
        setTotal(sum);
      }
    } catch (err) {
      console.error("💥 Lỗi lấy giỏ hàng:", err);
    }
  };

  const handleDecrease = async (productId, currentQuantity, name) => {
    try {
      const newQuantity = currentQuantity - 1;
      if (newQuantity < 1) return;

      const res = await fetch(`http://localhost:5000/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user_id, productId, quantity: newQuantity }),
      });

      const data = await res.json();
      if (data.success) {
        fetchCart();
        window.alert(`Đã giảm số lượng ${name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncrease = async (productId, currentQuantity, name) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user_id, productId, quantity: currentQuantity + 1 }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCart();
        window.alert(`Đã tăng số lượng ${name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAll = async (productId, name) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user_id, productId }),
      });
      const data = await res.json();
      
      if (data.success) {
        fetchCart();
        window.alert(`Đã xoá ${name} khỏi giỏ`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    if (!user_id) return;
    const confirm = window.confirm("Bạn có chắc muốn xoá toàn bộ giỏ hàng không?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user_id}/clear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setCartItems([]);
        setTotal(0);
        window.alert("Đã xoá toàn bộ giỏ hàng!");
      }
    } catch (err) {
      console.error("💥 Lỗi xoá toàn bộ giỏ hàng:", err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const resOrder = await fetch(`http://localhost:5000/api/pay/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user_id,
          chitietdonhang: cartItems,
          tongtien: total,
          thanhtoan: false,
          status: "dangcho",
          address: "",
        }),
      });

      const data = await resOrder.json();
      if (!data.success) return window.alert("💥 Lỗi tạo đơn hàng");

      setOrderStatus(data.order);
      setShowModal(true);
    } catch (err) {
      console.error("💥 Lỗi đặt hàng:", err);
    }
  };

  return (

  <div className="cart-page">
    <div className="cart-container">
      <h3>Giỏ hàng của bạn</h3>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Hình</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td>
                    {/* Sửa lại cách hiển thị ảnh: 
                        Nếu item.image là mảng, lấy [0].anhDaiDien 
                        Nếu item.image là string, dùng trực tiếp */}
                    <img 
                      src={Array.isArray(item.image) ? item.image[0]?.anhDaiDien : item.image || "/no-image.png"} 
                      alt={item.name} 
                      className="cart-img" 
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price ? item.price.toLocaleString("vi-VN") : "0"}₫</td>
                  <td className="quantity-controls">
                    <button onClick={() => handleDecrease(item.productId, item.quantity, item.name)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.productId, item.quantity, item.name)}>+</button>
                  </td>
                  <td>
                    {(item.quantity * item.price).toLocaleString("vi-VN")}₫
                  </td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemoveAll(item.productId, item.name)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="cart-summary">
            <h4>Tổng cộng: <span className="total-price">{total.toLocaleString("vi-VN")}₫</span></h4>
            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={handleClearCart}>Xoá giỏ hàng</button>
              <button className="place-order-btn" onClick={handlePlaceOrder}>Đặt hàng ngay</button>
            </div>
          </div>
        </>
      )}

      {/* Modal Hóa đơn */}
      {showModal && orderStatus && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Hóa đơn của bạn</h3>
            <div className="order-info">
              <p><strong>Mã đơn hàng:</strong> {orderStatus._id}</p>
              <p><strong>Tổng tiền:</strong> {orderStatus.tongtien.toLocaleString("vi-VN")}₫</p>
              <p><strong>Trạng thái:</strong> {orderStatus.status}</p>
            </div>

            <table className="cart-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {orderStatus.chitietdonhang.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString("vi-VN")}₫</td>
                    <td>{(item.quantity * item.price).toLocaleString("vi-VN")}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={async () => {
                await fetch(`http://localhost:5000/api/pay/${orderStatus._id}/cancel`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                });
                setShowModal(false);
              }}>Hủy đơn</button>

              <button className="btn-pay" onClick={async () => {
                  try {
                    // Dữ liệu chuẩn bị cho PayOS (Tùy thuộc vào Backend của bạn định nghĩa)
                    const orderData = { 
                      orderId: orderStatus._id, // ID đơn hàng từ DB của bạn
                      amount: orderStatus.tongtien,
                      description: `Thanh toán đơn hàng ${orderStatus._id.slice(-6)}`,
                      items: orderStatus.chitietdonhang.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                      }))
                    };

                    // Gọi API Backend đã tích hợp PayOS SDK
                    const res = await fetch(`http://localhost:5000/api/pay/create-payos-checkout`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(orderData),
                    });

                    const result = await res.json();

                    // PayOS trả về checkoutUrl
                    if (result.success && result.checkoutUrl) {
                      window.location.href = result.checkoutUrl; 
                    } else {
                      window.alert("💥 Lỗi tạo link thanh toán PayOS: " + (result.message || ""));
                    }
                  } catch (err) {
                    console.error("💥 Lỗi kết nối PayOS:", err);
                    window.alert("Không thể kết nối đến máy chủ thanh toán.");
                  }
              }}>
                Thanh toán qua PayOS
              </button>
            </div>
          </div>
        </div>
      )}

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
  </div>  
  );
}

export default Cart;