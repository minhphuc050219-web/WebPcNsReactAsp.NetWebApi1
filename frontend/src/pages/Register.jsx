import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/accountAPI";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    diaChi: "",
    dienThoai: "",
    gioiTinh: true,
    images: null,
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh hợp lệ");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 5MB");
      return;
    }

    setForm({ ...form, images: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      alert("Vui lòng nhập username");
      return;
    }

    if (!form.email.trim()) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!form.password) {
      alert("Vui lòng nhập password");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        diaChi: form.diaChi,
        dienThoai: form.dienThoai,
        gioiTinh: form.gioiTinh,
        images: form.images,
      });
      alert("Đăng ký thành công!");

      navigate("/login");

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        diaChi: "",
        dienThoai: "",
        gioiTinh: true,
        images: null,
      });
      setImagePreview(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      {/* Bootstrap Responsive Grid */}
      <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
        {/* Bootstrap Card */}
        <div className="card shadow-lg border-0 rounded-4 p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-success fw-bold">PHUC TRUONG PC SHOP</h3>
            <p className="text-muted small">Your Social Campaigns</p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label">User Name</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="form-control rounded-3"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={form.diaChi}
                onChange={handleChange}
                className="form-control rounded-3"
                placeholder="Enter your address"
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                name="dienThoai"
                value={form.dienThoai}
                onChange={handleChange}
                className="form-control rounded-3"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control rounded-3"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control rounded-3"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-control rounded-3"
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label d-block">Giới tính</label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gioiTinh"
                  id="genderMale"
                  checked={form.gioiTinh === true}
                  onChange={() => setForm({ ...form, gioiTinh: true })}
                />
                <label className="form-check-label" htmlFor="genderMale">
                  Nam
                </label>
              </div>

              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gioiTinh"
                  id="genderFemale"
                  checked={form.gioiTinh === false}
                  onChange={() => setForm({ ...form, gioiTinh: false })}
                />
                <label className="form-check-label" htmlFor="genderFemale">
                  Nữ
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Ảnh đại diện</label>
              <input
                type="file"
                accept="image/*"
                className="form-control rounded-3"
                onChange={handleImage}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="mt-3 rounded-3"
                  width="120"
                  height="120"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="btn btn-success w-100 rounded-pill py-2"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-4 small">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
