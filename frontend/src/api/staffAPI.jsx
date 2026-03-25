const API_URL = "http://localhost:5226/api/Staff";
import { API_URL } from "./api";
export async function getStaff() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }

  return await response.json();
}

export async function createStaff(staffData) {
  const formData = new FormData();
  formData.append("maNV", staffData.maNV || "");
  formData.append("tenNV", staffData.tenNV);
  formData.append("diaChi", staffData.diaChi || "");
  formData.append("sdt", staffData.sdt || "");
  formData.append("gioiTinh", staffData.gioiTinh !== undefined ? staffData.gioiTinh    : true);
  formData.append("ngaySinh", staffData.ngaySinh || "");
  formData.append("ccd", staffData.ccd || "");
  formData.append("luongCoBan", staffData.luongCoBan || 0);
  formData.append("email", staffData.email || "");
  formData.append("password", staffData.password || "");
  formData.append("maPhongBan", staffData.maPhongBan || "");
  formData.append("role", staffData.role || "");
  
  if (staffData.nvImages) {
    formData.append("nvImages", staffData.nvImages);
  }
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to create staff");
  }
  return await response.json();
}

export async function updateStaff(maNV, staffData) {
  const formData = new FormData();
  formData.append("maNV", maNV);
  formData.append("tenNV", staffData.tenNV);
  formData.append("diaChi", staffData.diaChi || "");
  formData.append("sdt", staffData.sdt || 0);
  formData.append("gioiTinh", staffData.gioiTinh !== undefined ? staffData.gioiTinh : true);
  formData.append("ngaySinh", staffData.ngaySinh || "");
  formData.append("ccd", staffData.ccd || 0);
  formData.append("luongCoBan", staffData.luongCoBan || 0);
  formData.append("email", staffData.email || "");
  formData.append("password", staffData.password || "");
  formData.append("maPhongBan", staffData.maPhongBan || "");
  formData.append("role", staffData.role || "");
  if (staffData.nvImages) {
    formData.append("nvImages", staffData.nvImages);
  }

  const response = await fetch(`${API_URL}/${maNV}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("Lỗi phản hồi:", errorData);
    throw new Error(errorData.message || "Failed to update staff roi");
  }

  return await response.json();
}

export async function searchStaff(keyword) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search staff");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteStaff(maNV) {
  const response = await fetch(`${API_URL}/${maNV}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete staff");
  }

  return await response.json();
}