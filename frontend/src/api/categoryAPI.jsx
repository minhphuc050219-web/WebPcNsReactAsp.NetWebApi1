const API_URL = "http://localhost:5226/api/Category";
import { API_URL } from "./api";
export async function getCategory() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return await response.json();
}

export async function createCategory(categoryData) {
  const formData = new FormData();
  formData.append("maLoai", categoryData.maLoai || "");
  formData.append("tenLoai", categoryData.tenLoai);
  formData.append("maBrand", categoryData.maBrand || "");
  if (categoryData.loaiImages) {
    formData.append("loaiImages", categoryData.loaiImages);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create category");
  }

  return await response.json();
}

export async function updateCategory(maLoai, categoryData) {
  const formData = new FormData();
  formData.append("maLoai", maLoai);
  formData.append("tenLoai", categoryData.tenLoai);
  formData.append("maBrand", categoryData.maBrand || "");
  if (categoryData.loaiImages) {
    formData.append("loaiImages", categoryData.loaiImages);
  }

  const response = await fetch(`${API_URL}/${maLoai}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update category");
  }

  return await response.json();
}

export async function searchCategory(keyword) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search categories");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteCategory(maLoai) {
  const response = await fetch(`${API_URL}/${maLoai}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete category");
  }

  return await response.json();
}