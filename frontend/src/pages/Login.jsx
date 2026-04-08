import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/accountAPI";
import { useAuth } from "../context/AuthContext";

const ADMIN_ROLES = ["admin", "manager", "staff", "leader"];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // lấy hàm login từ AuthContext để lưu token + role sau khi đăng nhập

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data); // lưu { token, id, username, email, role, images } vào AuthContext + localStorage

      // Phân quyền chuyển trang theo role
      if (ADMIN_ROLES.includes((data.role ?? "").toLowerCase())) {
        navigate("/admin"); // admin/manager/staff/leader → vào trang quản trị
      } else {
        navigate("/");      // user thường → về trang web
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="col-11 col-sm-8 col-md-6 col-lg-4 col-xl-3">
        <div className="card shadow-lg border-0 rounded-4 p-4">
          <div className="text-center mb-4">
            <h3 className="text-primary fw-bold">PHUC TRUONG PC SHOP</h3>
            <p className="text-muted small">Your Social Campaigns</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control rounded-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" defaultChecked />
                <label className="form-check-label">Remember this Device</label>
              </div>
              <Link to="#" className="text-decoration-none small">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill py-2"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-4 small">
            New to PHUC TRUONG PC SHOP?{" "}
            <Link to="/register" className="text-decoration-none">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
