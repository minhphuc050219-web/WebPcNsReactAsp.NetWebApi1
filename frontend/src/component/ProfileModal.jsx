import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAccountById, updateAccount } from "../api/accountAPI";
import { BASE_URL } from "../api";

/**
 * ProfileModal - Hiển thị và cho phép sửa thông tin tài khoản đang đăng nhập
 * Props:
 *   show     - boolean: hiểu thị/ẩn modal
 *   onClose  - function: đóng modal
 */
export default function ProfileModal({ show, onClose }) {
  const { auth, updateAuth } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    diaChi: "",
    dienThoai: "",
    gioiTinh: true,
    images: null,
    role: "user",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Khi modal mở: load thông tin mới nhất từ API theo id đang đăng nhập
  useEffect(() => {
    if (!show || !auth?.id) return;

    getAccountById(auth.id)
      .then((data) => {
        setForm({
          username:  data.username  || "",
          email:     data.email     || "",
          password:  "",
          diaChi:    data.diaChi    || "",
          dienThoai: data.dienThoai || "",
          gioiTinh:  data.gioiTinh  ?? true,
          images:    null,
          role:      data.role      || "user",
        });
        setImagePreview(
          data.images
            ? `${BASE_URL}/public/imagesAccount/${data.images}`
            : null
        );
      })
      .catch(() => {});
  }, [show, auth?.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Ảnh không được vượt quá 5MB"); return; }
    if (!file.type.startsWith("image/")) { alert("Vui lòng chọn file ảnh"); return; }
    setForm({ ...form, images: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gửi toàn bộ thông tin, giữ nguyên role hiện tại (không đổi role tại đây)
      const result = await updateAccount(auth.id, form);

      // Cập nhật lại context để header hiển thị tên/ảnh mới ngay lập tức
      updateAuth({
        username: result.data?.username ?? form.username,
        images:   result.data?.images   ?? auth.images,
      });

      alert("Cập nhật thành công!");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ảnh đại diện: ảnh thật hoặc avatar chữ cái đầu
  const avatarSrc = imagePreview
    || (auth?.images ? `${BASE_URL}/public/imagesAccount/${auth.images}` : null)
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.username || "U")}&background=0D6EFD&color=fff&size=128`;

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,0.55)", zIndex: 9999 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">⚙️ Thông tin tài khoản</h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Avatar + Role */}
              <div className="text-center mb-4">
                <img
                  src={avatarSrc}
                  alt="avatar"
                  width="100" height="100"
                  className="rounded-circle border shadow-sm"
                  style={{ objectFit: "cover" }}
                />
                <div className="mt-2">
                  <span className="fw-semibold">{form.username}</span>
                  <span className="badge bg-secondary ms-2">{form.role}</span>
                </div>
                <div className="text-muted small">{form.email}</div>
              </div>

              <div className="row g-3">
                {/* Username */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    className="form-control"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Mật khẩu mới
                    <span className="text-muted fw-normal ms-1 small">(bỏ trống nếu không đổi)</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                {/* Điện thoại */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Điện thoại</label>
                  <input
                    className="form-control"
                    name="dienThoai"
                    value={form.dienThoai}
                    onChange={handleChange}
                  />
                </div>

                {/* Địa chỉ */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Địa chỉ</label>
                  <input
                    className="form-control"
                    name="diaChi"
                    value={form.diaChi}
                    onChange={handleChange}
                  />
                </div>

                {/* Giới tính */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold d-block">Giới tính</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="pm-male"
                        checked={form.gioiTinh === true}
                        onChange={() => setForm({ ...form, gioiTinh: true })}
                      />
                      <label className="form-check-label" htmlFor="pm-male">Nam</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="pm-female"
                        checked={form.gioiTinh === false}
                        onChange={() => setForm({ ...form, gioiTinh: false })}
                      />
                      <label className="form-check-label" htmlFor="pm-female">Nữ</label>
                    </div>
                  </div>
                </div>

                {/* Ảnh đại diện */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Ảnh đại diện</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleImage}
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
