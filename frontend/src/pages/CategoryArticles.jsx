import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getArticle } from "../api/articleAPI";
import { getArticleCategory } from "../api/articleCategoryAPI";
import { BASE_URL } from "../api";

export default function CategoryArticles() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching articles for category:", categoryId);

        // Fetch all articles
        const articleData = await getArticle();
        console.log("All articles:", articleData);

        // Fetch all categories
        const categoryData = await getArticleCategory();
        console.log("All article categories:", categoryData);

        // Filter articles by category
        const filtered = Array.isArray(articleData)
          ? articleData.filter(a => String(a.maLoaiBV) === String(categoryId))
          : [];
        console.log("Filtered articles:", filtered);

        // Find category info
        const foundCategory = Array.isArray(categoryData)
          ? categoryData.find(c => String(c.maLoaiBV) === String(categoryId))
          : null;

        setArticles(filtered);
        setCategory(foundCategory);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu");
        setArticles([]);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/loaibv")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại danh mục
        </button>
      </div>
    );
  }

  return (
    <div className="bg-light">
      <div className="container">
        {/* HEADER */}
        <div className="mb-4">
          <button
            className="btn btn-outline-primary btn-sm mb-3"
            onClick={() => navigate("/loaibv")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại danh mục
          </button>

          <h2 className="fw-bold text-primary mb-2">
            {category ? category.tenLoaiBV : "Danh mục bài viết"}
          </h2>
          {category && (
            <p className="text-muted mb-4">
              Mã danh mục: <strong>{category.maLoaiBV}</strong>
            </p>
          )}
        </div>

        {/* ARTICLES GRID */}
        {currentArticles.length > 0 ? (
          <div className="row mb-4">
            {currentArticles.map((article) => (
              <div className="col-lg-4 col-md-6 mb-4" key={article.maBV}>
                <div className="card shadow-sm border-0 h-100 hover-card">
                  <img
                    src={
                      (article.anhBV || article.bvImages || article.image || article.hinhAnh)
                        ? (() => {
                            const imageField = article.anhBV || article.bvImages || article.image || article.hinhAnh;
                            if (imageField.startsWith("http")) {
                              return imageField;
                            }
                            if (imageField.startsWith("/")) {
                              return `${BASE_URL}${imageField}`;
                            }
                            return `${BASE_URL}/public/imagesArticle/${imageField}`;
                          })()
                        : "/images/placeholder.png"
                    }
                    className="card-img-top"
                    alt={article.tenBV}
                    style={{ height: "250px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                  <div className="card-body p-3">
                    <h5 className="card-title fw-bold text-truncate" title={article.tenBV}>
                      {article.tenBV}
                    </h5>
                    <p
                      className="card-text text-muted small text-truncate"
                      style={{ maxHeight: "60px", overflow: "hidden" }}
                      title={article.tomTatBV}
                    >
                      {article.tomTatBV || "Không có mô tả"}
                    </p>
                    {article.trangThaiBV && (
                      <span className="badge bg-success mb-2">Đang hoạt động</span>
                    )}
                    <Link
                      to={`/baiviet/${article.maBV}`}
                      className="btn btn-primary btn-sm w-100 d-block mt-3"
                    >
                      Đọc thêm
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center" role="alert">
            <i className="bi bi-inbox"></i> Không có bài viết nào trong danh mục này
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mb-5">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${page === currentPage ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
