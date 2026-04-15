
import { API_URL } from "../api";
export async function getSalary() {
  const response = await fetch(`${API_URL}/Salary`);

  if (!response.ok) {
    throw new Error("Failed to fetch salarys");
  }

  return await response.json();
}

export async function searchSalary(keyword) {
  const response = await fetch(`${API_URL}/Salary/${encodeURIComponent(keyword)}`);
  if (!response.ok) {
    throw new Error("Failed to search salarys");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function createSalary(salaryData) {
  const response = await fetch(`${API_URL}/Salary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salaryData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to create salary");
  }

  return await response.json();
}

export async function updateSalary(id, salaryData) {
  const response = await fetch(`${API_URL}/Salary/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salaryData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to update salary");
  }

  return await response.json();
}

export async function deleteSalary(id) {
  const response = await fetch(`${API_URL}/Salary/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to delete salary");
  }

  return await response.json();
}
