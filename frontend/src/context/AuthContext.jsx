import { createContext, useContext, useState, useCallback } from "react";

// AuthContext là "kho" lưu trạng thái đăng nhập (token, role, username...)
// Dùng createContext để chia sẻ dữ liệu này tới mọi component trong app mà không cần truyền props
const AuthContext = createContext(null);

// Ghi chú nhanh để bảo trì về sau:
// 1) Dùng sessionStorage (không dùng localStorage) cho auth.
// 2) Treo máy/không thao tác sẽ KHÔNG tự logout.
// 3) Đóng tab hoặc đóng cửa sổ trình duyệt sẽ mất session và phải đăng nhập lại.
// 4) Refresh trang vẫn giữ đăng nhập trong cùng tab.

// Danh sách role được phép vào khu admin
const ADMIN_ROLES = ["admin", "manager", "staff", "leader"];

// AuthProvider: bao bọc toàn bộ app trong App.jsx
// Mọi component con đều có thể gọi useAuth() để lấy dữ liệu từ đây
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    // Dùng sessionStorage: dữ liệu tồn tại khi refresh trang, tự mất khi đóng tab/cửa sổ
    try {
      const stored = sessionStorage.getItem("auth");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // login: gọi sau khi API login trả về thành công
  // Lưu dữ liệu { token, id, username, email, role, images } vào state và sessionStorage
  const login = useCallback((data) => {
    sessionStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  }, []);

  // logout: xóa token khỏi sessionStorage và reset state về null
  const logout = useCallback(() => {
    sessionStorage.removeItem("auth");
    setAuth(null);
  }, []);

  // updateAuth: cập nhật một phần thông tin user trong context (vd: sau khi sửa profile)
  // Dùng sau khi gọi updateAccount thành công để sync username/images mới về context
  const updateAuth = useCallback((partialData) => {
    const newAuth = { ...auth, ...partialData };
    sessionStorage.setItem("auth", JSON.stringify(newAuth));
    setAuth(newAuth);
  }, [auth]);

  const isLoggedIn  = Boolean(auth?.token);                                          // true nếu đã đăng nhập
  const isAdminRole = ADMIN_ROLES.includes((auth?.role ?? "").toLowerCase()); // true nếu là admin/manager/staff/leader

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateAuth, isLoggedIn, isAdminRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth: custom hook tiện lợi để lấy context trong bất kỳ component nào
// Ví dụ: const { auth, logout, isAdminRole } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
