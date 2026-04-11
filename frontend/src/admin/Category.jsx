import { useEffect, useState } from "react";
import { getCategory, createCategory, updateCategory, deleteCategory } from "../api/categoryAPI";
import CategoryList from "../component/CategoryList";
import CategoryUpDel from "../component/CategoryUpDel";
export default function Category() {
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Lấy danh sách category
  const loadCategories = async () => {
    try {
      const categoryData = await getCategory();
      setCategory(categoryData);
      setFilteredCategory(categoryData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Tìm kiếm category (client-side)
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredCategory(category);
      return;
    }

    // Tìm kiếm phía client - nhanh hơn, không gọi API
    const searchLower = keyword.toLowerCase().trim();
    const results = category.filter((item) =>
      item.maLoai.toLowerCase().includes(searchLower) ||
      item.tenLoai.toLowerCase().includes(searchLower)
    );
    setFilteredCategory(results);
  };

  useEffect(() => {
    loadCategories().then(() => setLoading(false));
  }, []);

  // Mở modal thêm category
  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  // Mở modal sửa category
  const handleEditCategory = (categoryItem) => {
    setEditingCategory(categoryItem);
    setShowModal(true);
  };

  // Xóa category
  const handleDeleteCategory = async (maLoai) => {
    if (window.confirm("Bạn chắc chắn muốn xóa loại sản phẩm này?")) {
      try {
        await deleteCategory(maLoai);
        alert("Xóa thành công!");
        // Tải lại danh sách
        await loadCategories();
        setSearchKeyword(""); // Reset search
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  // Submit form (thêm hoặc sửa)
  const handleSubmitCategory = async (formData) => {
    try {
      if (editingCategory) {
        // Cập nhật category
        await updateCategory(editingCategory.maLoai, formData);
        alert("Cập nhật thành công!");
      } else {
        // Thêm category mới
        await createCategory(formData);
        alert("Thêm thành công!");
      }
      // Tải lại danh sách
      await loadCategories();
      setSearchKeyword(""); // Reset search
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">Quản Lý Loại Sản Phẩm</h5>
            <button
              className="btn btn-primary shadow-sm"
              onClick={handleAddCategory}
            >
              + Thêm Loại Sản Phẩm
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
                placeholder="Tìm kiếm theo mã hoặc tên loại..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredCategory(category);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">
                Tìm thấy {filteredCategory.length} kết quả
              </small>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead>
                <tr>
                  <th className="text-center">Mã Loại</th>
                  <th className="text-center">Tên Loại</th>
                  <th className="text-center">Hình Ảnh</th>
                  <th className="text-center">Quản Lí</th>
                </tr>
              </thead>
              <tbody>
                <CategoryList
                  categories={filteredCategory}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa category */}
      <CategoryUpDel
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitCategory}
        editingCategory={editingCategory}
      />
    </div>
  );
}