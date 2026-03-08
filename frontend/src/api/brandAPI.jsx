const API_URL = "http://localhost:5226/api/Brand";

export async function getBrand() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return await response.json();
}
