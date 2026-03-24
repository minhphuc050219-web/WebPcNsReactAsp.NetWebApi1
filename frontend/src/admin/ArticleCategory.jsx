import { useEffect, useState } from "react";
import {
  getArticleCategory,
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
} from "../api/articleCategoryAPI";
import ArticleCategoryList from "../component/ArticleCategoryList";
import ArticleCategoryUpDel from "../component/ArticleCategoryUpDel";
import "../admin/CSS/articlecategory.css";
export default function ActicleCategory() {
  const [articlecategory, setArticleCategory] = useState([]);
  const [filteredArticleCategory, setFilteredArticleCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArticleCategory, setEditingArticleCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Lấy danh sách articlecategory
  const loadArticlecategories = async () => {
    try {
      const data = await getArticleCategory();
      setArticleCategory(data);
      setFilteredArticleCategory(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Tìm kiếm articlecategory (client-side)
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredArticleCategory(articlecategory);
      return;
    }

    // Tìm kiếm phía client - nhanh hơn, không gọi API
    const searchLower = keyword.toLowerCase().trim();
    const results = articlecategory.filter(
      (item) =>
        item.maLoaiBV.toLowerCase().includes(searchLower) ||
        item.tenLoaiBV.toLowerCase().includes(searchLower),
    );
    setFilteredArticleCategory(results);
  };
  useEffect(() => {
    loadArticlecategories().then(() => setLoading(false));
  }, []);

  // Mở modal thêm articlecategory
  const handleAddArticleCategory = () => {
    setEditingArticleCategory(null);
    setShowModal(true);
  };

  // Mở modal sửa articlecategory
  const handleEditArticleCategory = (articleCategoryItem) => {
    setEditingArticleCategory(articleCategoryItem);
    setShowModal(true);
  };

  // Xóa articlecategory
  const handleDeleteArticleCategory = async (maLoaiBV) => {
    if (window.confirm("Bạn chắc chắn muốn xóa loại bài viết này?")) {
      try {
        await deleteArticleCategory(maLoaiBV);
        const updatedList = articlecategory.filter(
          (d) => d.maLoaiBV !== maLoaiBV,
        );
        setArticleCategory(updatedList);
        setFilteredArticleCategory(
          updatedList.filter(
            (d) =>
              d.maLoaiBV.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              d.tenLoaiBV.toLowerCase().includes(searchKeyword.toLowerCase()),
          ),
        );
        alert("Xóa thành công!");
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  // Submit form (thêm hoặc sửa)
  const handleSubmitArticleCategory = async (formData) => {
    try {
      if (editingArticleCategory) {
        // Cập nhật articlecategory
        await updateArticleCategory(editingArticleCategory.maLoaiBV, formData);
        alert("Cập nhật thành công!");
      } else {
        // Thêm articlecategory mới
        await createArticleCategory(formData);
        alert("Thêm thành công!");
      }
      // Tải lại danh sách
      await loadArticlecategories();
      setSearchKeyword(""); // Reset search
    } catch (err) {
      throw err;
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">
              Quản Lý Loại Bài Viết
            </h5>
            <button
              className="btn btn-primary shadow-sm"
              onClick={handleAddArticleCategory}
            >
              + Thêm Loại Bài Viết
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
                placeholder="Tìm kiếm theo mã hoặc tên loại bài viết..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredArticleCategory(articlecategory);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">
                Tìm thấy {filteredArticleCategory.length} kết quả
              </small>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead>
                <tr>
                  <th className="text-center">Mã Loại Bài Viết</th>
                  <th className="text-center">Tên Loại Bài Viết</th>
                  <th className="text-center">Thứ Tự Bài Viết</th>
                  <th className="text-center">Quản Lí</th>
                </tr>
              </thead>
              <tbody>
                <ArticleCategoryList
                  articlecategorys={filteredArticleCategory}
                  onEdit={handleEditArticleCategory}
                  onDelete={handleDeleteArticleCategory}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal thêm/sửa department */}
      <ArticleCategoryUpDel
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitArticleCategory}
        editingArticleCategory={editingArticleCategory}
      />
    </div>
  );
}
