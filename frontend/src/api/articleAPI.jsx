import { API_URL } from "../api";

export async function getArticle() {
  const response = await fetch(`${API_URL}/Article`);

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

  const response = await fetch(`${API_URL}/Article`, {
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

  const response = await fetch(`${API_URL}/Article/${maBV}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update article");
  }

  return await response.json();
}

export async function getArticleById(id) {
  console.log(`Calling API: ${API_URL}/Article/id/${id}`);
  try {
    let response = await fetch(`${API_URL}/Article/id/${id}`);
    console.log(`Response status: ${response.status}`);

    // Fallback: Nếu endpoint không tồn tại, fetch tất cả rồi tìm
    if (!response.ok && response.status === 404) {
      console.log("Endpoint /Article/id/{id} không tồn tại, sử dụng fallback...");
      const allArticles = await getArticle();
      const article = allArticles.find(a => String(a.maBV) === String(id));
      if (!article) {
        throw new Error("Article not found");
      }
      console.log(`Article detail (from list):`, article);
      return article;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(`API Error ${response.status}: Article not found`);
    }

    const data = await response.json();
    console.log(`Article detail:`, data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function searchArticle(keyword) {
  const response = await fetch(`${API_URL}/Article/${encodeURIComponent(keyword)}`);
  
  if (!response.ok) {
    throw new Error("Failed to search articles");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteArticle(maBV) {
  const response = await fetch(`${API_URL}/Article/${maBV}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete article");
  }

  return await response.json();
}