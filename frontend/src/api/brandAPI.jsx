
import { API_URL } from "../api";
export async function getBrand() {
  const response = await fetch(`${API_URL}/Brand`);

  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }

  return await response.json();
}

export async function createBrand(brandData) {
  const formData = new FormData();
  formData.append("maBrand", brandData.maBrand || "");
  formData.append("tenBrand", brandData.tenBrand);
  if (brandData.brandImages) {
    formData.append("brandImages", brandData.brandImages);
  }

  const response = await fetch(`${API_URL}/Brand`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create brand");
  }

  return await response.json();
}

export async function updateBrand(maBrand, brandData) {
  const formData = new FormData();
  formData.append("maBrand", maBrand);
  formData.append("tenBrand", brandData.tenBrand);
  if (brandData.brandImages) {
    formData.append("brandImages", brandData.brandImages);
  }

  const response = await fetch(`${API_URL}/Brand/${maBrand}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update brand");
  }

  return await response.json();
}

export async function searchBrand(keyword) {
  const response = await fetch(`${API_URL}/Brand/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search brands");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteBrand(maBrand) {
  const response = await fetch(`${API_URL}/Brand/${maBrand}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete brand");
  }

  return await response.json();
}
