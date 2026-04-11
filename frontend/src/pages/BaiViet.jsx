import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticle } from "../api/articleAPI";
import { BASE_URL } from "../api";

export default function BaiViet() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        console.log("Fetching articles from API...");
        const data = await getArticle();
        console.log("Articles fetched:", data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("First article structure:", data[0]);
          console.log("Image field (anhBV):", data[0].anhBV);
          console.log("Image field (bvImages):", data[0].bvImages);
        }
        setArticles(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err.message || "Không thể tải bài viết");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
      <div className="alert alert-danger" role="alert">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="bg-light">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">BÀI VIẾT</h2>
        <p className="text-muted">Các tin tức và bài viết mới nhất từ chúng tôi</p>
      </div>

      {currentArticles.length > 0 ? (
        <div className="row mb-4">
          {currentArticles.map((article) => (
            <div className="col-lg-4 col-md-6 mb-4" key={article.maBV}>
              <div className="card shadow-sm border-0 h-100 hover-card">
                <img
                  src={
                    (article.anhBV || article.bvImages)
                      ? (article.anhBV || article.bvImages).startsWith("http")
                        ? (article.anhBV || article.bvImages)
                        : `${BASE_URL}/public/imagesArticle/${article.anhBV || article.bvImages}`
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
                  <small className="text-muted d-block mb-2">
                    {article.maLoaiBV}
                  </small>
                  {article.trangThaiBV && (
                    <span className="badge bg-success mb-2">Đang hoạt động</span>
                  )}
                  <Link
                    to={`/baiviet/${article.maBV}`}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <i className="bi bi-eye me-2"></i> Xem sản phẩm
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          Không có bài viết nào
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
  );
}