const API_URL="http://localhost:5226/api/Departments";

export async function getDepartment() {
    const response=await fetch(API_URL);

    if(!response.ok){
        throw new Error("Failed to fetch departments");
    }
    return await response.json();
}

export async function createDepartment(departmentData) {
  const formData = new FormData();
  formData.append("maPhongBan", departmentData.maPhongBan || "");
  formData.append("tenPhongBan", departmentData.tenPhongBan);
  formData.append("soLuongNV", departmentData.soLuongNV || 0);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create department");
  }

  return await response.json();
}

export async function updateDepartment(maPhongBan, departmentData) {
  const formData = new FormData();
  formData.append("maPhongBan", maPhongBan);
  formData.append("tenPhongBan", departmentData.tenPhongBan);
  formData.append("soLuongNV", departmentData.soLuongNV || 0);

  const response = await fetch(`${API_URL}/${maPhongBan}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update department");
  }

  return await response.json();
}

export async function searchDepartment(keyword) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search departments");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteDepartment(maPhongBan) {
  const response = await fetch(`${API_URL}/${maPhongBan}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete department");
  }

  return await response.json();
}