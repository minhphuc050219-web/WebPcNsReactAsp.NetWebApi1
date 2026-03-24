const API_URL = "http://localhost:5226/api/Product";

export async function getProduct() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return await response.json();
}

export async function createProduct(productData) {
  const formData = new FormData();
  formData.append("maSanPham", productData.maSanPham || "");
  formData.append("tenSanPham", productData.tenSanPham);
  formData.append("soLuong", productData.soLuong || 0);
  formData.append("donGia", productData.donGia || 0);
  formData.append("ngayNhap", productData.ngayNhap || "");
  formData.append("hanBaoHanh", productData.hanBaoHanh || 0);
  formData.append("shortDescription", productData.shortDescription || "");
  formData.append("description", productData.description || "");
  formData.append("tinhTrangSanPham", productData.tinhTrangSanPham !== undefined ? productData.tinhTrangSanPham : true);
  formData.append("trangThaiSanPham", productData.trangThaiSanPham !== undefined ? productData.trangThaiSanPham : true);
  formData.append("maLoai", productData.maLoai || "");
  formData.append("maBrand", productData.maBrand || "");
  if (productData.hangHoaImages) {
    formData.append("hangHoaImages", productData.hlangHoaImages);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create product");
  }

  return await response.json();
}

export async function updateProduct(maSanPham, productData) {
  const formData = new FormData();
  formData.append("maSanPham", maSanPham);
  formData.append("tenSanPham", productData.tenSanPham);
  formData.append("soLuong", productData.soLuong || 0);
  formData.append("donGia", productData.donGia || 0);
  formData.append("ngayNhap", productData.ngayNhap || "");
  formData.append("hanBaoHanh", productData.hanBaoHanh || 0);
  formData.append("shortDescription", productData.shortDescription || "");
  formData.append("description", productData.description || "");
  formData.append("tinhTrangSanPham", productData.tinhTrangSanPham !== undefined ? productData.tinhTrangSanPham : true);
  formData.append("trangThaiSanPham", productData.trangThaiSanPham !== undefined ? productData.trangThaiSanPham : true);
  formData.append("maLoai", productData.maLoai || "");
  formData.append("maBrand", productData.maBrand || "");
  if (productData.hangHoaImages) {
    formData.append("hangHoaImages", productData.hangHoaImages);
  }

  const response = await fetch(`${API_URL}/${maSanPham}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update product");
  }

  return await response.json();
}

export async function searchProduct(keyword) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(keyword)}`);

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const data = await response.json();
  // Always return an array, even if empty
  return Array.isArray(data) ? data : [];
}

export async function deleteProduct(maSanPham) {
  const response = await fetch(`${API_URL}/${maSanPham}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete product");
  }

  return await response.json();
}