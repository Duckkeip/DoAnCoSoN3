import React, { useEffect, useState } from "react";
import api from "../api/check";
import "./Admin.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdate = async () => {
    try {
      // Loại bỏ hoàn toàn trường verified trước khi gửi lên server
      const { verified, ...dataToUpdate } = formData;
      await api.put(`/admin/users/${selectedUser._id}`, dataToUpdate);
      alert("Cập nhật thành công!");
      fetchUsers();
      setShowDetailModal(false);
    } catch (err) {
      alert("Thao tác thất bại");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Loại bỏ verified khỏi form data khi thêm mới
      const { verified, ...dataToAdd } = formData;
      await api.post("/admin/users", dataToAdd);
      alert("Đã thêm người dùng mới");
      fetchUsers();
      setShowAddModal(false);
      setFormData({});
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cảnh báo: Hành động này không thể hoàn tác!")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      alert("Đã xóa tài khoản.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="userlist-container">
      <div className="admin-header-actions">
        <h2>👥 QUẢN LÝ NGƯỜI DÙNG</h2>
        <p>Tổng cộng: {users.length} tài khoản</p>

        <button
          className="add-btn"
          onClick={() => {
            setFormData({});
            setShowAddModal(true);
          }}
        >
          + Thêm người dùng
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Liên hệ</th>
            <th>Quyền hạn</th>
            <th>Trạng thái</th>
            {/* Cột Xác thực đã được xóa */}
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <div style={{ fontWeight: "bold" }}>{user.username}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {user.email}
                </div>
              </td>

              <td>{user.SDT || "Chưa cập nhật"}</td>

              <td>
                <span className={`role-badge ${user.role}`}>
                  {user.role?.toUpperCase()}
                </span>
              </td>

              <td>
                <span className={`status-badge ${user.tinhtrang || "pending"}`}>
                  {user.tinhtrang === "active" ? "Hoạt động" : "Bị chặn"}
                </span>
              </td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData(user);
                    setShowDetailModal(true);
                  }}
                >
                  Chi tiết & Sửa
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDetailModal && selectedUser && (
        <div className="admin-modal">
          <div className="modal-content">
            <h3>Hồ sơ & Chỉnh sửa</h3>
            <hr />

            <div className="user-info-grid">
              <p><strong>ID:</strong> {selectedUser._id}</p>
              <p>
                <strong>Ngày tham gia:</strong>{" "}
                {new Date(selectedUser.ngayTao).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div className="user-edit-form">
              <label>Họ tên:</label>
              <input
                type="text"
                value={formData.username || ""}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

              <label>Email:</label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <label>Số điện thoại:</label>
              <input
                type="text"
                value={formData.SDT || ""}
                onChange={(e) =>
                  setFormData({ ...formData, SDT: e.target.value })
                }
              />

              <label>Địa chỉ:</label>
              <textarea
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <label>Quyền hạn:</label>
              <select
                value={formData.role || "user"}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
              </select>

              <label>Trạng thái:</label>
              <select
                value={formData.tinhtrang || "active"}
                onChange={(e) =>
                  setFormData({ ...formData, tinhtrang: e.target.value })
                }
              >
                <option value="active">Hoạt động</option>
                <option value="blocked">Chặn</option>
              </select>
              {/* Select Xác thực đã xóa */}
            </div>

            <div className="modal-actions">
              <button className="save-btn" onClick={handleUpdate}>
                Lưu thay đổi
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="admin-modal">
          <form className="modal-content" onSubmit={handleAddUser}>
            <h3>Tạo tài khoản mới</h3>

            <div className="user-edit-form">
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                required
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

              <label>Email:</label>
              <input
                type="email"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <label>Mật khẩu:</label>
              <input
                type="password"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <label>Số điện thoại:</label>
              <input
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, SDT: e.target.value })
                }
              />

              <label>Địa chỉ:</label>
              <textarea
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <label>Quyền hạn:</label>
              <select
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="user">USER</option>
                <option value="admin">ADMIN</option>
              </select>

              <label>Trạng thái:</label>
              <select
                onChange={(e) =>
                  setFormData({ ...formData, tinhtrang: e.target.value })
                }
              >
                <option value="active">Hoạt động</option>
                <option value="blocked">Chặn</option>
              </select>
              {/* Select Xác thực đã xóa */}
            </div>

            <div className="modal-actions">
              <button type="submit" className="add-btn">
                Xác nhận thêm
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserList;