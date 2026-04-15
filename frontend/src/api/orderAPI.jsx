const API_URL = "http://localhost:5226/api";

export async function getUserOrders(maKhachHang) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/Order/user/${encodeURIComponent(maKhachHang)}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  
  return response.json();
}

export async function getOrderById(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/Order/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  
  return response.json();
}

export async function createOrderFromCart(orderData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/Order`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create order");
  }
  
  return response.json();
}

