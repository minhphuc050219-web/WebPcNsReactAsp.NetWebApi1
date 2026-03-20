const API_URL = "http://localhost:5226/api/ArticleCategory";

export async function getArticleCategory() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch article Category");
  }

  return await response.json();
}
