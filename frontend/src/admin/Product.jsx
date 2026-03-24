import { useEffect, useState } from "react";
import { getProduct, createProduct, updateProduct, deleteProduct } from "../api/productAPI";
import { getCategory } from "../api/categoryAPI";
import { getBrand } from "../api/brandAPI";
import ProductList from "../component/ProductList";
import ProductUpDel from "../component/ProductUpDel";
import ProductDetail from "../component/ProductDetail";

export default function Product() {
  const [product, setProduct] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Load tất cả products, categories, và brands
  const loadProducts = async () => {
    setLoading(true);
    try {
      const [productData, categoryData, brandData] = await Promise.all([
        getProduct(),
        getCategory(),
        getBrand()
      ]);
      setProduct(productData);
      setFilteredProduct(productData);
      setCategories(categoryData);
      setBrands(brandData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Tìm kiếm product (client-side) - nhanh hơn, không gọi API
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredProduct(product);
      return;
    }

    // Tìm kiếm phía client
    const searchLower = keyword.toLowerCase().trim();
    const results = product.filter((item) =>
      item.maSanPham.toLowerCase().includes(searchLower) ||
      (item.tenSanPham && item.tenSanPham.toLowerCase().includes(searchLower))
    );
    setFilteredProduct(results);
  };

  // Handle add new product
  const handleAddClick = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // Handle edit product
  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setShowModal(true);
  };

  // Handle delete product
  const handleDelete = async (maSanPham) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(maSanPham);
        alert("Xóa sản phẩm thành công!");
        await loadProducts();
        setSearchKeyword(""); // Reset search
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  // Handle detail view
  const handleDetail = (prod) => {
    setDetailProduct(prod);
    setShowDetailModal(true);
  };

  // Handle submit (add or update)
  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        // Update
        await updateProduct(editingProduct.maSanPham, formData);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Create
        await createProduct(formData);
        alert("Thêm sản phẩm thành công!");
      }
      await loadProducts();
      setSearchKeyword(""); // Reset search
    } catch (err) {
      throw new Error(err.message);
    }
  };

  if (loading && product.length === 0) return <p>Loading...</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">Quản Lý Sản Phẩm</h5>
            <button 
              className="btn btn-primary shadow-sm"
              onClick={handleAddClick}
            >
              + Thêm Sản Phẩm
            </button>
          </div>

          {/* Thanh Tìm Kiếm */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredProduct(product);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">
                Tìm thấy {filteredProduct.length} kết quả
              </small>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Mã Sản Phẩm</th>
                  <th className="text-center">Tên Sản Phẩm</th>
                  <th className="text-center">Đơn Giá</th>
                  <th className="text-center">Hình Ảnh</th>
                  <th className="text-center">Mô Tả Ngắn</th>
                  <th className="text-center">Mã Loại</th>
                  <th className="text-center">Mã Brand</th>
                  <th className="text-center">Quản Lí</th>
                </tr>
              </thead>
              <tbody>
                <ProductList 
                  products={filteredProduct}
                  categories={categories}
                  brands={brands}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDetail={handleDetail}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Modal (Add/Edit) */}
      <ProductUpDel
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
      />

      {/* Product Detail Modal */}
      <ProductDetail
        key={detailProduct?.maSanPham || 'detail-modal'}
        show={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setDetailProduct(null);
        }}
        product={detailProduct}
        hideDetails={true}
      />
    </div>
  );
}