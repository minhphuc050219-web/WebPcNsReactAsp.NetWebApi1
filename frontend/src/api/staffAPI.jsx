const API_URL = "http://localhost:5226/api/Staff";

export async function getStaff() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }

  return await response.json();
}