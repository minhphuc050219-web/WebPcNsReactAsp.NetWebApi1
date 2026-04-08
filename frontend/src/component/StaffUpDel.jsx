import { useState, useEffect } from "react";
import { getDepartment } from "../api/departmentAPI";
import { BASE_URL } from "../api";

export default function StaffUpDel({
  show,
  onClose,
  onSubmit,
  editingStaff = null,
}) {
  const [formData, setFormData] = useState(
    editingStaff
      ? {
          maNV: editingStaff.maNV,
          tenNV: editingStaff.tenNV || "",
          diaChi: editingStaff.diaChi || "",
          sdt: editingStaff.sdt || "",
          gioiTinh:
            editingStaff.gioiTinh !== undefined ? editingStaff.gioiTinh : true,
          ngaySinh: editingStaff.ngaySinh || "",
          ccd: editingStaff.ccd || "",
          luongCoBan: editingStaff.luongCoBan || 0,
          nvImages: null,
          email: editingStaff.email || "",
          //password: editingStaff.password || "",
          password: "", // 🔥 không bind password
          maPhongBan: editingStaff.maPhongBan || "",
          role: editingStaff.role || "user",
        }
      : {
          maNV: "",
          tenNV: "",
          diaChi: "",
          sdt: "",
          gioiTinh: true,
          ngaySinh: "",
          ccd: "",
          luongCoBan: 0,
          nvImages: null,
          email: "",
          password: "",
          maPhongBan: "",
          role: "",
        },
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState([]);

  // Cập nhật formData và preview khi editingStaff thay đổi
  useEffect(() => {
    if (editingStaff && show) {
      setFormData({
        maNV: editingStaff.maNV,
        tenNV: editingStaff.tenNV || "",
        diaChi: editingStaff.diaChi || "",
        sdt: editingStaff.sdt || "",
        gioiTinh:
          editingStaff.gioiTinh !== undefined ? editingStaff.gioiTinh : true,
        ngaySinh: editingStaff.ngaySinh || "",
        ccd: editingStaff.ccd || "",
        luongCoBan: editingStaff.luongCoBan || 0,
        nvImages: null,
        email: editingStaff.email || "",
        password: editingStaff.password || "",
        maPhongBan: editingStaff.maPhongBan || "",
        role: editingStaff.role || "user",
      });
      // Lấy preview ảnh từ backend URL
      if (editingStaff.nvImages) {
        setImagePreview(
          `${BASE_URL}/public/imagesStaff/${editingStaff.nvImages}`,
        );
      } else {
        setImagePreview(null);
      }
    } else if (show && !editingStaff) {
      // Mode thêm mới
      const generateId = () => {
        return "NV" + Date.now().toString().slice(-8);
      };
      setFormData({
        maNV: generateId(),
        tenNV: "",
        diaChi: "",
        sdt: "",
        gioiTinh: true,
        ngaySinh: "",
        ccd: "",
        luongCoBan: 0,
        nvImages: null,
        email: "",
        password: "",
        maPhongBan: "",
        role: "",
      });
      setImagePreview(null);
    }
  }, [show, editingStaff]);

  // Load brands và categories khi component mount
  useEffect(() => {
    getDepartment()
      .then(setDepartment)
      .catch((error) => console.error("Failed to load departments:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

      setFormData({ ...formData, nvImages: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        maNV: "",
        tenNV: "",
        diaChi: "",
        sdt: "",
        gioiTinh: true,
        ngaySinh: "",
        ccd: "",
        luongCoBan: 0,
        nvImages: null,
        email: "",
        password: "",
        maPhongBan: "",
        role: "",
      });
      setImagePreview(null);
      onClose();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {editingStaff ? "Sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Mã Nhân Viên */}
              <div className="mb-3">
                <label htmlFor="maNV" className="form-label">
                  Mã Nhân Viên{" "}
                  {!editingStaff && (
                    <span className="text-muted">(Tự động)</span>
                  )}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maNV"
                  name="maNV"
                  value={formData.maNV}
                  onChange={handleInputChange}
                  placeholder="Mã nhân viên sẽ được tự động tạo"
                  disabled={editingStaff || loading}
                  required
                />
              </div>

              {/* Tên Nhân Viên */}
              <div className="mb-3">
                <label htmlFor="tenNV" className="form-label">
                  Tên Nhân Viên *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tenNV"
                  name="tenNV"
                  value={formData.tenNV}
                  onChange={handleInputChange}
                  placeholder="Nhập tên nhân viên"
                  required
                  disabled={loading}
                />
              </div>

              {/* Địa Chỉ */}
              <div className="mb-3">
                <label htmlFor="diaChi" className="form-label">
                  Địa Chỉ *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="diaChi"
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                  disabled={loading}
                />
              </div>

              {/* Số Điện Thoại */}
              <div className="mb-3">
                <label htmlFor="sdt" className="form-label">
                  Số Điện Thoại
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="sdt"
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  disabled={loading}
                />
              </div>

              {/* Giới Tính*/}
              <div className="mb-3">
                <label htmlFor="gioiTinh" className="form-label">
                  Giới Tính:
                </label>
                <label className="form-check-label" htmlFor="role">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="gioiTinh"
                    name="gioiTinh"
                    checked={formData.gioiTinh === true}
                    onChange={() =>
                      setFormData({ ...formData, gioiTinh: true })
                    }
                  />
                  Nam
                </label>
                <label className="form-check-label" htmlFor="role">
                  <input
                    type="radio"
                    name="gioiTinh"
                    checked={formData.gioiTinh === false}
                    onChange={() =>
                      setFormData({ ...formData, gioiTinh: false })
                    }
                  />
                  Nữ
                </label>
              </div>

              {/* Ngay Sinh */}
              <div className="mb-3">
                <label htmlFor="ngaySinh" className="form-label">
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="ngaySinh"
                  name="ngaySinh"
                  value={formData.ngaySinh}
                  onChange={handleInputChange}
                  placeholder="Nhập ngày sinh"
                  disabled={loading}
                />
              </div>

              {/* Căn Cước Công Dân */}
              <div className="mb-3">
                <label htmlFor="ccd" className="form-label">
                  Số Căn Cước Công Dân
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="ccd"
                  name="ccd"
                  value={formData.ccd}
                  onChange={handleInputChange}
                  placeholder="Nhập số căn cước công dân"
                  disabled={loading}
                />
              </div>

              {/* Lương Cơ Bản */}
              <div className="mb-3">
                <label htmlFor="luongCoBan" className="form-label">
                  Lương Cơ Bản
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="luongCoBan"
                  name="luongCoBan"
                  value={formData.luongCoBan}
                  onChange={handleInputChange}
                  placeholder="Nhập lương cơ bản"
                  disabled={loading}
                />
              </div>

              {/* Hình Ảnh */}
              <div className="mb-3">
                <label htmlFor="nvImages" className="form-label">
                  Hình Ảnh Nhân Viên
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="nvImages"
                  name="nvImages"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <small className="text-muted">
                  Độ phân giải tối đa 5MB, định dạng JPG, PNG, GIF, WebP
                </small>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3">
                  <label className="form-label">Xem trước ảnh</label>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              )}

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mật Khẩu *
                </label>
                <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu (bỏ trống nếu không đổi)"
              />
              </div>
              

              {/* Mã Department */}
              <div className="mb-3">
                <label htmlFor="maPhongBan" className="form-label">
                  Phòng Ban
                </label>
                <select
                  className="form-control"
                  id="maPhongBan"
                  name="maPhongBan"
                  value={formData.maPhongBan}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">-- Chọn phòng ban --</option>
                  {department.map((dept) => (
                    <option key={dept.maPhongBan} value={dept.maPhongBan}>
                      {dept.tenPhongBan}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role*/}
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Vai Trò
                </label>
                <select
                  className="form-control"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="staff">Staff</option>
                  <option value="leader">Leader</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : editingStaff
                    ? "Cập nhật"
                    : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
