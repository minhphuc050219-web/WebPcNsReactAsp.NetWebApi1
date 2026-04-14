import { API_URL } from "../api";

// API: Lay tat ca don xin nghi
export async function getLeaves() {
  const response = await fetch(`${API_URL}/Leaves`);
  if (!response.ok) {
    throw new Error("Failed to fetch leaves");
  }
  return await response.json();
}

// API: Tim kiem don theo keyword (ma don, ma NV, loai nghi...)
export async function searchLeaves(keyword) {
  const response = await fetch(`${API_URL}/Leaves/${encodeURIComponent(keyword)}`);
  if (!response.ok) {
    throw new Error("Failed to search leaves");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

// API: Tao moi don xin nghi (multipart/form-data de gui kem anh)
export async function createLeave(leaveData) {
  const formData = new FormData();
  formData.append("maNV", leaveData.maNV || "");
  formData.append("typeLV", leaveData.typeLV || "");
  formData.append("ngayBD", leaveData.ngayBD || "");
  formData.append("ngayKT", leaveData.ngayKT || "");
  formData.append("lyDo", leaveData.lyDo || "");
  formData.append("trangThai", leaveData.trangThai || "Chờ duyệt");
  if (leaveData.imagesLV) {
    formData.append("imagesLV", leaveData.imagesLV);
  }

  const response = await fetch(`${API_URL}/Leaves`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create leave");
  }

  return await response.json();
}

// API: Cap nhat don. Chi gui nhung field duoc truyen vao
export async function updateLeave(maLV, leaveData) {
  const formData = new FormData();
  if (leaveData.maNV !== undefined) formData.append("maNV", leaveData.maNV || "");
  if (leaveData.typeLV !== undefined) formData.append("typeLV", leaveData.typeLV || "");
  if (leaveData.ngayBD !== undefined) formData.append("ngayBD", leaveData.ngayBD || "");
  if (leaveData.ngayKT !== undefined) formData.append("ngayKT", leaveData.ngayKT || "");
  if (leaveData.lyDo !== undefined) formData.append("lyDo", leaveData.lyDo || "");
  if (leaveData.trangThai !== undefined) formData.append("trangThai", leaveData.trangThai || "");
  if (leaveData.imagesLV) {
    formData.append("imagesLV", leaveData.imagesLV);
  }

  const response = await fetch(`${API_URL}/Leaves/${maLV}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update leave");
  }

  return await response.json();
}

// API: Xoa don xin nghi theo ma don
export async function deleteLeave(maLV) {
  const response = await fetch(`${API_URL}/Leaves/${maLV}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete leave");
  }

  return await response.json();
}

// Helper nhanh cho manager: duyet don
export async function approveLeave(maLV) {
  return updateLeave(maLV, { trangThai: "Đã duyệt" });
}

// Helper nhanh cho manager: tu choi don
export async function rejectLeave(maLV) {
  return updateLeave(maLV, { trangThai: "Từ chối" });
}
