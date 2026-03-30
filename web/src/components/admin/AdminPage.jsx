import "./Admin.css"
import React, { useEffect } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";

function AdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role !== "admin") {
      alert("❌ Bạn không có quyền truy cập trang này!");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2> Admin </h2>
        <nav>
          <button onClick={() => navigate(`/admin/${id}`)}>🏠 Dashboard</button>
          <button onClick={() => navigate(`/admin/${id}/users`)}>👥 Quản lý User</button>

          {/* 👉 THÊM MỚI */}
          <button onClick={() => navigate(`/admin/${id}/orders`)}>
            🛒 Quản lý giỏ hàng
          </button>

          <button onClick={() => navigate(`/home/${id}`)}>
            👤 Sang trang người dùng
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </nav>
      </aside>

      {/* Nội dung */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPage;