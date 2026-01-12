import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    SDT: "",
    email: "",
    password: "",
    addressCity: "",
    addressDetail: ""
  });
  

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Cập nhật dữ liệu form khi nhập
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("⏳ Đang xử lý...");

    const dataSend = {
      ...form,
      address: form.addressCity + " - " + form.addressDetail
    }; 

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", dataSend);
      setMessage("✅ " + (res.data.message || "Đăng ký thành công!"));

      // ⏱ Chuyển hướng sau 1 giây
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Lỗi khi đăng ký"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
  <div className="auth-right">
    <div className="auth-card">
      <h2>📝 Đăng ký</h2>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} required />

        <input name="SDT" placeholder="Số điện thoại" value={form.SDT} onChange={handleChange} />

        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} required />

        <select name="addressCity" value={form.addressCity} onChange={handleChange} required>
          <option value="">-- Chọn tỉnh / thành phố --</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="TP.HCM">TP. Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Cần Thơ">Cần Thơ</option>
          <option value="Hải Phòng">Hải Phòng</option>
          <option value="Bình Dương">Bình Dương</option>
        </select>

        <input
          type="text"
          name="addressDetail"
          placeholder="Số nhà, đường, quận, huyện..."
          value={form.addressDetail}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Đang đăng ký..." : "Tạo tài khoản"}
        </button>
      </form>

      <p className="switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>

      {message && <p className="msg">{message}</p>}
    </div>
  </div>
</div>

  );
}

export default Register;
