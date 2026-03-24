import { useEffect, useState } from "react";
import {getArticle, createArticle, updateArticle, deleteArticle } from "../api/articleAPI";
import { getArticleCategory } from "../api/articleCategoryAPI";
import ArticleList from "../component/ArticleList";
import ArticleUpDel from "../component/ArticleUpDel";
import ArticleDetail from "../component/ArticleDetail";
import "../admin/CSS/article.css";

export default function Article() {
   const [article, setArticle] = useState([]);
   const [filteredArticle, setFilteredArticle] = useState([]);
    const [articlecategories, setArticleCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [detailArticle, setDetailArticle] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

// Load tất cả articles, articlecategories
  const loadArticles = async () => {
    setLoading(true);
    try {
      const [articleData, articlecategoryData] = await Promise.all([
        getArticle(),
        getArticleCategory(),
      ]);
      setArticle(articleData);
      setFilteredArticle(articleData);
      setArticleCategories(articlecategoryData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
    loadArticles();
  }, []);

  // Tìm kiếm article (client-side) - nhanh hơn, không gọi API
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredArticle(article);
      return;
    }

    // Tìm kiếm phía client
    const searchLower = keyword.toLowerCase().trim();
    const results = article.filter((item) =>
      item.maBV.toLowerCase().includes(searchLower) ||
      (item.tenBV && item.tenBV.toLowerCase().includes(searchLower))
    );
    setFilteredArticle(results);
  };

  // Handle add new ariticle
  const handleAddClick = () => {
    setEditingArticle(null);
    setShowModal(true);
  };

  // Handle edit article
  const handleEdit = (bv) => {
    setEditingArticle(bv);
    setShowModal(true);
  };

  // Handle delete article
    const handleDelete = async (maBV) => {
      if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        try {
          await deleteArticle(maBV);
          alert("Xóa bài viết thành công!");
          await loadArticles();
          setSearchKeyword(""); // Reset search
        } catch (err) {
          alert("Lỗi: " + err.message);
        }
      }
    };

  // Handle detail view
  const handleDetail = (bv) => {
    setDetailArticle(bv);
    setShowDetailModal(true);
  };

  // Handle submit (add or update)
    const handleSubmit = async (formData) => {
      try {
        if (editingArticle) {
          // Update
          await updateArticle(editingArticle.maBV, formData);
          alert("Cập nhật bài viết thành công!");
        } else {
          // Create
          await createArticle(formData);
          alert("Thêm bài viết thành công!");
        }
        await loadArticles();
        setSearchKeyword(""); // Reset search
      } catch (err) {
        throw new Error(err.message);
      }
    };



      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;
  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
        <div className="card shadow-lg border-0 flex-grow-1">
          <div className="card-body">
             <div className="d-flex justify-content-between align-items-center mb-3 header-line">
              <h5 className="card-title fw-bold text-primary">Quản Lý Bài Viết</h5>
              <button 
              className="btn btn-primary shadow-sm"
              onClick={handleAddClick}
              >
                + Thêm Bài Viết
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
                placeholder="Tìm kiếm theo mã hoặc tên bài viết..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredArticle(article);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

             <div className="table-responsive">
               <table className="table table-hover table-bordered text-nowrap align-middle">
                 <thead className="table-light">
                   <tr>
                    <th className="text-center">Mã Bài Viết</th>
                    <th className="text-center">Tên Bài Viết</th>
                    <th className="text-center">Tóm Tắt Bài Viết</th>
                    <th className="text-center">Mã Loại Bài Viết</th>
                    <th className="text-center">Hình Ảnh</th>
                    <th className="text-center">Quản Lí</th>
                   </tr>
                 </thead>
                  <tbody>
                    <ArticleList articles={filteredArticle} articlecategories={articlecategories} onEdit={handleEdit} onDelete={handleDelete} onDetail={handleDetail}/>
                  </tbody>
               </table>
             </div>
          </div>
        </div>
        {/* Article Modal (Add/Edit) */}
              <ArticleUpDel
                show={showModal}
                onClose={() => {
                  setShowModal(false);
                  setEditingArticle(null);
                }}
                onSubmit={handleSubmit}
                editingArticle={editingArticle}
              />
        
              {/* Article Detail Modal */}
              <ArticleDetail
                key={detailArticle?.maBV || 'detail-modal'}
                show={showDetailModal}
                onClose={() => {
                  setShowDetailModal(false);
                  setDetailArticle(null);
                }}
                article={detailArticle}
                hideDetails={true}
              />
        </div>
  )
}
