const API_URL = "http://localhost:5226/api/Article";

export async function getArticle() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return await response.json();
}
