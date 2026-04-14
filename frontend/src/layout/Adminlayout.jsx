import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "../component/UserDropdown";
import ProfileModal from "../component/ProfileModal";
import { BASE_URL } from "../api";
import "../admin/CSS/admin.css";

export default function AdminLayout() {
  const { auth, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const avatarSrc = auth?.images
    ? `${BASE_URL}/public/imagesAccount/${auth.images}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.username || "A")}&background=EEF2FF&color=1E3A8A&size=80`;

  const isActive = (path, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất không?")) return;
    logout();        // xóa token khỏi localStorage và reset context
    navigate("/");   // quay về trang web (không chuyển sang login)
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <h4 className="mb-4">ADMIN PANEL</h4>

          <div className="sidebar-profile">
            <img src={avatarSrc} alt="avatar" className="sidebar-profile-avatar" />
            <div className="sidebar-profile-name">{auth?.username || "Admin User"}</div>
            <div className="sidebar-profile-role">{auth?.role || "Administrator"}</div>
          </div>

          <ul className="nav flex-column">
            <p className="menu-title">
              HOME
              <li className="nav-item">
                <Link className={`menu ${isActive("/admin", true) ? "active-menu" : ""}`} to="/admin">
                  <span className="menu-icon">▣</span>
                  <span className="menu-text">Dashboard</span>
                </Link>
                <Link className={`menu ${isActive("/", true) ? "active-menu" : ""}`} to="/">
                  <span className="menu-icon">⌂</span>
                  <span className="menu-text">Home</span>
                </Link>
              </li>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT PRODUCTS
              <Link className={`menu ${isActive("/admin/brand") ? "active-menu" : ""}`} to="/admin/brand">
                <span className="menu-icon">◈</span>
                <span className="menu-text">Brand</span>
              </Link>
              <Link className={`menu ${isActive("/admin/category") ? "active-menu" : ""}`} to="/admin/category">
                <span className="menu-icon">◍</span>
                <span className="menu-text">Category</span>
              </Link>
              <Link className={`menu ${isActive("/admin/product") ? "active-menu" : ""}`} to="/admin/product">
                <span className="menu-icon">◉</span>
                <span className="menu-text">Product</span>
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT STAFFS
              <Link className={`menu ${isActive("/admin/phongban") ? "active-menu" : ""}`} to="/admin/phongban">
                <span className="menu-icon">⌘</span>
                <span className="menu-text">Department</span>
              </Link>
              <Link className={`menu ${isActive("/admin/staff") ? "active-menu" : ""}`} to="/admin/staff">
                <span className="menu-icon">⚑</span>
                <span className="menu-text">Staff</span>
              </Link>
              <Link className={`menu ${isActive("/admin/salary") ? "active-menu" : ""}`} to="/admin/salary">
                <span className="menu-icon">$</span>
                <span className="menu-text">Salary</span>
              </Link>
              <Link className={`menu ${isActive("/admin/leaves") ? "active-menu" : ""}`} to="/admin/leaves">
                <span className="menu-icon">✈</span>
                <span className="menu-text">Leaves</span>
              </Link>
              <Link className={`menu ${isActive("/admin/leaves-staff") ? "active-menu" : ""}`} to="/admin/leaves-staff">
                <span className="menu-icon">☑</span>
                <span className="menu-text">My Leaves</span>
              </Link>
              <Link className={`menu ${isActive("/admin/timekp") ? "active-menu" : ""}`} to="/admin/timekp">
                <span className="menu-icon">◷</span>
                <span className="menu-text">Cham Cong</span>
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT ACCOUNT
              <Link className={`menu ${isActive("/admin/account") ? "active-menu" : ""}`} to="/admin/account">
                <span className="menu-icon">⚙</span>
                <span className="menu-text">Account</span>
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT ARTICLES
              <Link className={`menu ${isActive("/admin/artcategory") ? "active-menu" : ""}`} to="/admin/artcategory">
                <span className="menu-icon">✦</span>
                <span className="menu-text">Article Category</span>
              </Link>
              <Link className={`menu ${isActive("/admin/article") ? "active-menu" : ""}`} to="/admin/article">
                <span className="menu-icon">✎</span>
                <span className="menu-text">Article</span>
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT CART
              <Link className="menu" to="">
                <span className="menu-icon">◩</span>
                <span className="menu-text">Cart</span>
              </Link>
              <Link className="menu" to="">
                <span className="menu-icon">◪</span>
                <span className="menu-text">Cart Detail</span>
              </Link>
            </p>
          </ul>
        </aside>

        {/* MAIN */}
        <div className="admin-right">
          {/* HEADER */}
          <header className="admin-header">
            <h5 className="m-0 admin-page-title">{auth?.username || "Admin Dashboard"}</h5>

            <div className="admin-header-right">
              <button className="header-bell-btn" type="button" title="Notifications">
                <span className="bell-dot" />
                🔔
              </button>
              <UserDropdown
                onOpenSettings={() => setShowProfile(true)}
                onLogout={handleLogout}
              />
            </div>
          </header>

          {/* Modal sửa thông tin tài khoản */}
          <ProfileModal
            show={showProfile}
            onClose={() => setShowProfile(false)}
          />

          {/* CONTENT */}
          <div className="admin-content">
            <Outlet />
          </div>

          {/* FOOTER */}
          <footer className="bg-light text-center p-3">
            © 2026 Admin Dashboard | Powered by You 🚀
          </footer>
        </div>
      </div>
    </div>
  );
}
