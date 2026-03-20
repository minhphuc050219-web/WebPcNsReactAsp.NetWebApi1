const API_URL = "http://localhost:5226/api/Salary";

export async function getSalary() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch salarys");
  }

  return await response.json();
}
