import React, { useEffect, useState } from "react";
import api from "../api/check";
import "./Admin.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load danh sách ngay khi vào trang
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Xử lý cập nhật (Trạng thái hoặc Xác thực)
  const handleUpdate = async (data) => {
    try {
      const res = await api.put(`/admin/users/${selectedUser._id}/status`, data);
      alert(res.data.message);
      
      // Cập nhật state cục bộ để UI thay đổi ngay lập tức
      const updatedUser = { ...selectedUser, ...data };
      setUsers(users.map(u => u._id === selectedUser._id ? updatedUser : u));
      setSelectedUser(updatedUser);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cảnh báo: Hành động này không thể hoàn tác!")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      alert("Đã xóa tài khoản.");
    } catch (error) { console.error(error); }
  };

  return (
    <div className="userlist-container">
      <div className="admin-header-actions">
        <h2>👥 QUẢN LÝ NGƯỜI DÙNG</h2>
        <p>Tổng cộng: {users.length} tài khoản</p>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Liên hệ</th>
            <th>Quyền hạn</th>
            <th>Trạng thái</th>
            <th>Xác thực</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <div style={{fontWeight: 'bold'}}>{user.username}</div>
                <div style={{fontSize: '12px', color: '#666'}}>{user.email}</div>
              </td>
              <td>
                <div>{user.SDT || "Chưa cập nhật"}</div>
              </td>
              <td><span className={`role-badge ${user.role}`}>{user.role?.toUpperCase()}</span></td>
              <td>
                <span className={`status-badge ${user.tinhtrang || 'pending'}`}>
                  {user.tinhtrang === "active" ? "Hoạt động" : "Bị chặn"}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>{user.verified ? "✅" : "❌"}</td>
              <td>
                <button className="edit-btn" onClick={() => { setSelectedUser(user); setShowDetailModal(true); }}>Chi tiết</button>
                <button className="delete-btn" onClick={() => handleDelete(user._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetailModal && selectedUser && (
        <div className="admin-modal">
          <div className="modal-content">
            <h3>Hồ sơ người dùng</h3>
            <hr />
            <div className="user-info-grid">
              <p><strong>ID:</strong> {selectedUser._id}</p>
              <p><strong>Ngày tham gia:</strong> {new Date(selectedUser.ngayTao).toLocaleDateString('vi-VN')}</p>
              <p><strong>Số điện thoại:</strong> {selectedUser.SDT || "N/A"}</p>
              <p><strong>Địa chỉ:</strong> {selectedUser.address || "Chưa thiết lập"}</p>
            </div>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              {selectedUser.tinhtrang === "blocked" ? (
                <button className="save-btn" onClick={() => handleUpdate({ tinhtrang: "active" })}>Mở khóa tài khoản</button>
              ) : (
                <button className="delete-btn" onClick={() => handleUpdate({ tinhtrang: "blocked" })}>Chặn truy cập</button>
              )}
              
              {!selectedUser.verified && (
                <button className="add-btn" onClick={() => handleUpdate({ verified: true })}>Xác minh Email</button>
              )}
              
              <button className="cancel-btn" onClick={() => setShowDetailModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;