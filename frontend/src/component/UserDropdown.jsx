import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../api";

/**
 * UserDropdown - Avatar + tên người dùng, bấm vào hiện dropdown menu
 *
 * Props:
 *   onLogout       - function: gọi khi bấm Đăng xuất
 *   onOpenSettings - function: gọi khi bấm Cài đặt tài khoản
 *   extraItems     - array[{ label, icon, onClick }]: menu item thêm (vd: Giỏ hàng ở web layout)
 *   light          - boolean: dùng text trắng cho nền tối (admin header)
 */
export default function UserDropdown({
  onLogout,
  onOpenSettings,
  extraItems = [],
  light = false,
}) {
  const { auth, isAdminRole } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ảnh đại diện: ảnh thật hoặc avatar chữ cái đầu
  const avatarSrc = auth?.images
    ? `${BASE_URL}/public/imagesAccount/${auth.images}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(auth?.username || "U")}&background=0D6EFD&color=fff&size=80`;

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* NÚT HIỂN THỊ - avatar + tên */}
      <button
        className={`btn btn-link p-0 d-flex align-items-center gap-2 text-decoration-none ${light ? "text-white" : "text-dark"}`}
        onClick={() => setOpen((o) => !o)}
        title="Tài khoản của bạn"
      >
        <img
          src={avatarSrc}
          alt="avatar"
          width="36"
          height="36"
          className="rounded-circle border"
          style={{ objectFit: "cover" }}
        />
        <div className="text-start d-none d-md-block lh-1">
          {/* <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>{auth?.username}</div> */}
          {/* <div className="text-muted" style={{ fontSize: "0.7rem" }}>{auth?.role}</div> */}
        </div>
        <span style={{ fontSize: "0.65rem" }}>▼</span>
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div
          className="position-absolute end-0 bg-white border rounded-3 shadow py-1"
          style={{ minWidth: "200px", zIndex: 9999, top: "calc(100% + 8px)" }}
        >
          {/* Thông tin người dùng */}
          <div className="px-3 py-2 border-bottom d-flex align-items-center gap-2">
            <img
              src={avatarSrc}
              alt="avatar"
              width="40"
              height="40"
              className="rounded-circle border"
              style={{ objectFit: "cover" }}
            />
            <div className="lh-1">
              <div className="fw-semibold small text-success">
                {auth?.username}
              </div>
              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                {auth?.email}
              </div>
              <span
                className="badge bg-success mt-1"
                style={{ fontSize: "0.65rem" }}
              >
                {auth?.role}
              </span>
            </div>
          </div>
          {/* trang admin vào 👤 - chỉ hiển thị với admin/staff/manager/leader */}
          {isAdminRole && (
            <button
              className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-secondary"
              onClick={() => {
                setOpen(false);
                window.location.href = "/admin";
              }}
            >
              🧑‍💻 <span>Trang Admin</span>
            </button>
          )}

          {/* Cài đặt tài khoản */}
          {/* UserDropdown (nhận prop)
  └─ onOpenSettings={() => setShowProfile(true)}  ← truyền từ AdminLayout  */}
          <button
            className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-warning"
            onClick={() => {
              setOpen(false);
              onOpenSettings();
            }}
          >
            ⚙️ <span>Setting</span>
          </button>

            <Link
            to="/orders"
            className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-primary"
          >
            <i className="bi bi-list-check"></i>
            <span>Đơn hàng của tôi</span>
          </Link>
          <Link
            to="/yeuthich"
            className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger"
          >
            <i className="bi bi-heart-fill"></i>
            <span>Yêu thích</span>
          </Link>

          {/* Extra items (vd: Giỏ hàng) */}
          {extraItems.map((item, i) => (
            <button
              key={i}
              className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-info"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.icon} <span>{item.label}</span>
            </button>
          ))}

          <div className="dropdown-divider my-1" />

          {/* Đăng xuất */}
          <button
            className="dropdown-item d-flex align-items-center gap-2 py-2 px-3 text-danger"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            🚪 <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}
