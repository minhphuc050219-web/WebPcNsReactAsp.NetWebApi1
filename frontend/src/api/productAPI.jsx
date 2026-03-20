const API_URL = "http://localhost:5226/api/Product";

export async function getProduct() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return await response.json();
}