import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute - bảo vệ các route không cho phép truy cập tùy ý
 *
 * Cách dùng trong App.jsx:
 *   <ProtectedRoute requireAdmin={true}>   → chỉ admin/manager/staff/leader vào được
 *   <ProtectedRoute>                       → chỉ cần đăng nhập là vào được
 *
 * requireAdmin = true  → user thường bị redirect về /
 * requireAdmin = false → chưa đăng nhập bị redirect về /login
 */
export default function ProtectedRoute({ children, requireAdmin = false, redirectTo = "/login" }) {
  const { isLoggedIn, isAdminRole } = useAuth();

  // Chưa đăng nhập → chuyển về trang login
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Đã đăng nhập nhưng không phải role admin → chuyển về trang web thường
  if (requireAdmin && !isAdminRole) {
    return <Navigate to="/" replace />;
  }

  // Đủ quyền → hiện thị component bên trong
  return children;
}
