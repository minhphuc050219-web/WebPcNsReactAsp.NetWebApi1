const API_URL = "http://localhost:5226/api/Brand";

export async function getBrand() {
  const response = await fetch(API_URL);

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

  const response = await fetch(API_URL, {
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

  const response = await fetch(`${API_URL}/${maBrand}`, {
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
  const response = await fetch(`${API_URL}/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search brands");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteBrand(maBrand) {
  const response = await fetch(`${API_URL}/${maBrand}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete brand");
  }

  return await response.json();
}
