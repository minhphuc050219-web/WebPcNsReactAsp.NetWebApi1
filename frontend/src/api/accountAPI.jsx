import { API_URL } from "../api";

// ================= LOGIN =================
// Gọi API POST /api/Account/login
// Nhận email + password, trả về { token, id, username, email, role, images }
// Token sẽ được lưu vào localStorage bởi AuthContext sau khi gọi hàm này
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/Account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Đăng nhập thất bại");
  }

  return await response.json(); // { token, id, username, email, role, images }
}

// 🔥 LẤY DANH SÁCH ACCOUNT
export async function getAccounts() {
  const response = await fetch(`${API_URL}/Account/List-account`);

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return await response.json();
}
// 🔥 User Register (Trang đăng ký)
// 🔥 USER REGISTER (frontend)
export async function registerUser(accountData) {
  const formData = new FormData();

  formData.append("username", accountData.username);
  formData.append("email", accountData.email);
  formData.append("password", accountData.password);
  formData.append("diaChi", accountData.diaChi || "");
  formData.append("dienThoai", accountData.dienThoai || "");
  formData.append("gioiTinh", accountData.gioiTinh ?? true);

  if (accountData.images) {
    formData.append("images", accountData.images);
  }

  const response = await fetch(`${API_URL}/Account/register`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Đăng ký thất bại");
  }

  return await response.text(); // backend trả string
}

// 🔥 Tạo tài khoản mới (Admin tạo tài khoản cho người dùng)
// 🔥 ADMIN TẠO ACCOUNT
// 🔥 ADMIN CREATE ACCOUNT
export async function createAccountByAdmin(accountData) {
  const formData = new FormData();

  formData.append("username", accountData.username);
  formData.append("email", accountData.email);
  formData.append("password", accountData.password);
  formData.append("diaChi", accountData.diaChi || "");
  formData.append("dienThoai", accountData.dienThoai || "");
  formData.append("gioiTinh", accountData.gioiTinh ?? true);
  formData.append("role", accountData.role || "user");

  if (accountData.images) {
    formData.append("images", accountData.images);
  }

  const response = await fetch(`${API_URL}/Account/create-by-admin`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Tạo account thất bại");
  }

  return await response.text();
}

// 🔥 UPDATE ACCOUNT (SYNC 2 CHIỀU)
// 🔥 UPDATE ACCOUNT
export async function updateAccount(id, accountData) {
  const formData = new FormData();

  formData.append("username", accountData.username || "");
  formData.append("email", accountData.email || "");

  if (accountData.password) {
    formData.append("password", accountData.password);
  }

  formData.append("diaChi", accountData.diaChi || "");
  formData.append("dienThoai", accountData.dienThoai || "");
  formData.append("gioiTinh", accountData.gioiTinh ?? true);
  formData.append("role", accountData.role || "user");

  if (accountData.images) {
    formData.append("images", accountData.images);
  }

  const response = await fetch(`${API_URL}/Account/update/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Update thất bại");
  }

  return await response.json(); // { message, data }
}
// 🔥 SEARCH ACCOUNT THEO TÊN
export async function searchAccounts(keyword) {
  const response = await fetch(
    `${API_URL}/Account/search/${encodeURIComponent(keyword)}`
  );

  if (!response.ok) {
    throw new Error("Tìm kiếm account thất bại");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
export async function getAccountById(id) {
  const response = await fetch(`${API_URL}/Account/${id}`);

  if (!response.ok) {
    throw new Error("Không tìm thấy account");
  }

  return await response.json();
}

// 🔥 Xóa tài khoản
export async function deleteAccount(id) {
  const response = await fetch(`${API_URL}/Account/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || "Xóa thất bại");
  }

  return await response.text(); // backend trả string
}