import { useState, useEffect } from "react";
import { BASE_URL } from "../api";

export default function AccountUpDel({
  show,
  onClose,
  onSubmit,
  editingAccount = null,
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    diaChi: "",
    dienThoai: "",
    gioiTinh: true,
    role: "user",
    images: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD DATA
  useEffect(() => {
    if (editingAccount && show) {
      // ❌ CHẶN ADMIN
      if (
        editingAccount.role === "admin" ||
        editingAccount.role === "manager" ||
        editingAccount.role === "leader" ||
        editingAccount.role === "staff"
      ) {
        alert("Không thể sửa tài khoản admin và các chức vụ trong công ty");
        onClose();
        return;
      }

      setFormData({
        username: editingAccount.username || "",
        email: editingAccount.email || "",
        password: "", // 🔥 không bind password
        diaChi: editingAccount.diaChi || "",
        dienThoai: editingAccount.dienThoai || "",
        gioiTinh:
          editingAccount.gioiTinh !== undefined
            ? editingAccount.gioiTinh
            : true,
        role: editingAccount.role || "user",
        images: null,
      });

      if (editingAccount.images) {
        setImagePreview(
          `${BASE_URL}/public/imagesAccount/${editingAccount.images}`,
        );
      } else {
        setImagePreview(null);
      }
    } else if (show) {
      // ➕ ADD MODE
      setFormData({
        username: "",
        email: "",
        password: "",
        diaChi: "",
        dienThoai: "",
        gioiTinh: true,
        role: "user",
        images: null,
      });
      setImagePreview(null);
    }
  }, [show, editingAccount]);

  // 🔄 CHANGE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🖼️ IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      // validate size
      if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh không được vượt quá 5MB");
        return;
      }

      // validate type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

      setFormData({ ...formData, images: file });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 💾 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👉 CHECK ROLE CHANGE
    try {
      if (
        editingAccount &&
        editingAccount.role === "user" &&
        ["admin", "manager", "staff", "leader"].includes(formData.role)
      ) {
        const confirmChange = window.confirm(
          "Bạn có chắc muốn đổi người này từ USER thành nhân sự có chức vụ trong công ty không?",
        );

        if (!confirmChange) return;
      }
    } catch (err) {
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }

    // ❌ CHẶN ADMIN
    if (
      editingAccount?.role === "admin" ||
      editingAccount?.role === "manager" ||
      editingAccount?.role === "leader" ||
      editingAccount?.role === "staff"
    ) {
      alert("Không thể sửa tài khoản admin và các chức vụ trong công ty");
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: "#00000066" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {editingAccount ? "Sửa Account" : "Thêm Account"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Username */}
              <input
                className="form-control mb-2"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />

              {/* Email */}
              <input
                className="form-control mb-2"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />

              {/* Password */}
              <input
                type="password"
                className="form-control mb-2"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập password (bỏ trống nếu không đổi)"
              />

              {/* Địa chỉ */}
              <input
                className="form-control mb-2"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                placeholder="Địa chỉ"
              />

              {/* Điện thoại */}
              <input
                className="form-control mb-2"
                name="dienThoai"
                value={formData.dienThoai}
                onChange={handleChange}
                placeholder="Điện thoại"
              />

              {/* Giới tính */}
              <div className="mb-2">
                <label>
                  <input
                    type="radio"
                    checked={formData.gioiTinh === true}
                    onChange={() =>
                      setFormData({ ...formData, gioiTinh: true })
                    }
                  />
                  Nam
                </label>

                <label className="ms-3">
                  <input
                    type="radio"
                    checked={formData.gioiTinh === false}
                    onChange={() =>
                      setFormData({ ...formData, gioiTinh: false })
                    }
                  />
                  Nữ
                </label>
              </div>

              {/* Role */}
              {/* Role */}
              <select
                className="form-control mb-2"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="leader">Leader</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>

              {/* Image */}
              <input
                type="file"
                className="form-control mb-2"
                //onChange={handleImage}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.files[0] })
                }
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  width="120"
                  className="mt-2"
                />
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button className="btn btn-primary" type="submit">
                {loading ? "Đang xử lý..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
