const API_URL = "http://localhost:5226/api/Article";

export async function getArticle() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return await response.json();
}

export async function createArticle(articleData) {
  const formData = new FormData();
  formData.append("maBV", articleData.maBV || "");
  formData.append("tenBV", articleData.tenBV);
  formData.append("tomTatBV", articleData.tomTatBV || "");
  formData.append("noiDungBV", articleData.noiDungBV || "");
  formData.append("maLoaiBV", articleData.maLoaiBV || "");
  formData.append("trangThaiBV", articleData.trangThaiBV !== undefined ? articleData.trangThaiBV : true);
  if (articleData.bvImages) {
    formData.append("bvImages", articleData.bvImages);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create article");
  }

  return await response.json();
}

export async function updateArticle(maBV, articleData) {
  const formData = new FormData();
  formData.append("maBV", maBV);
  formData.append("tenBV", articleData.tenBV);
  formData.append("tomTatBV", articleData.tomTatBV || "");
  formData.append("noiDungBV", articleData.noiDungBV || "");
  formData.append("maLoaiBV", articleData.maLoaiBV || "");
  formData.append("trangThaiBV", articleData.trangThaiBV !== undefined ? articleData.trangThaiBV : true);
  if (articleData.bvImages) {
    formData.append("bvImages", articleData.bvImages);
  }

  const response = await fetch(`${API_URL}/${maBV}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update article");
  }

  return await response.json();
}

export async function searchArticle(keyword) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search articles");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteArticle(maBV) {
  const response = await fetch(`${API_URL}/${maBV}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete article");
  }

  return await response.json();
}