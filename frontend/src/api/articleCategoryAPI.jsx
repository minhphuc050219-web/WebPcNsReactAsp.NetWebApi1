
import { API_URL } from "../api";

export async function getArticleCategory() {
  const response = await fetch(`${API_URL}/ArticleCategory`);

  if (!response.ok) {
    throw new Error("Failed to fetch article Category");
  }

  return await response.json();
}

export async function createArticleCategory(articleCategoryData) {
  const formData = new FormData();
  formData.append("maLoaiBV", articleCategoryData.maLoaiBV || "");
  formData.append("tenLoaiBV", articleCategoryData.tenLoaiBV);
  formData.append("thuTuBV", articleCategoryData.thuTuBV || 0);

  const response = await fetch(`${API_URL}/ArticleCategory`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create article category");
  }

  return await response.json();
}

export async function updateArticleCategory(maLoaiBV, articleCategoryData) {
  const formData = new FormData();
  formData.append("maLoaiBV", maLoaiBV);
  formData.append("tenLoaiBV", articleCategoryData.tenLoaiBV);
  formData.append("thuTuBV", articleCategoryData.thuTuBV || 0);

  const response = await fetch(`${API_URL}/ArticleCategory/${maLoaiBV}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update article category");
  }

  return await response.json();
}

export async function searchArticleCategory(keyword) {
  const response = await fetch(`${API_URL}/ArticleCategory/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search article categories");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteArticleCategory(maLoaiBV) {
  const response = await fetch(`${API_URL}/ArticleCategory/${maLoaiBV}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete article category");
  }

  return await response.json();
}