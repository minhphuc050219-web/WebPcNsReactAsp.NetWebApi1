
import { API_URL } from "../api";
export async function getSalary() {
  const response = await fetch(`${API_URL}/Salary`);

  if (!response.ok) {
    throw new Error("Failed to fetch salarys");
  }

  return await response.json();
}
