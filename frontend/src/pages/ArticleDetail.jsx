import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticleById } from "../api/articleAPI";
import { BASE_URL } from "../api";

const getImageUrl = (article) => {
  const imageField = article.anhBV || article.bvImages || article.image || article.hinhAnh;
  
  if (!imageField) return null;
  
  // Nếu là full URL
  if (imageField.startsWith("http")) {
    return imageField;
  }
  
  // Thử các đường dẫn khác nhau
  return imageField;
};

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        console.log("Fetching article detail for ID:", id);
        const data = await getArticleById(id);
        console.log("Article data:", data);
        console.log("Article image (anhBV):", data?.anhBV);
        console.log("Article image (bvImages):", data?.bvImages);
        console.log("All fields:", Object.keys(data || {}));
        setArticle(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err.message || "Bài viết không tồn tại");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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
          onClick={() => navigate("/baiviet")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại danh sách bài viết
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Bài viết không tìm thấy
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/baiviet")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại danh sách bài viết
        </button>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* HEADER */}
      <div className="mb-4">
        <button
          className="btn btn-outline-primary btn-sm mb-3"
          onClick={() => navigate("/baiviet")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại
        </button>

        <h1 className="fw-bold text-primary mb-3">{article.tenBV}</h1>

        <div className="d-flex align-items-center text-muted small mb-3 flex-wrap">
          <span className="me-3">
            <i className="bi bi-calendar-event me-1"></i>
            {new Date(article.ngayDangBV).toLocaleDateString("vi-VN")}
          </span>
          <span className="me-3">
            <i className="bi bi-tag me-1"></i>
            {article.maLoaiBV || "Chưa phân loại"}
          </span>
          {article.trangThaiBV && (
            <span>
              <span className="badge bg-success">
                <i className="bi bi-check-circle me-1"></i>
                Đang hoạt động
              </span>
            </span>
          )}
        </div>
      </div>

              {getImageUrl(article) ? (
                <img
                  src={getImageUrl(article)}
                  alt={article.tenBV}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "500px", objectFit: "cover", width: "100%" }}
                  onError={(e) => {
                    // Fallback thứ 1: thử URL với BASE_URL
                    if (!e.target.src.includes(BASE_URL)) {
                      e.target.src = `${BASE_URL}/public/imagesArticle/${getImageUrl(article)}`;
                      e.target.onerror = null; // Ngăn loop vô hạn
                    } else {
                      // Fallback thứ 2: thử /uploads/
                      if (!e.target.src.includes("uploads")) {
                        e.target.src = `${BASE_URL}/uploads/articles/${getImageUrl(article)}`;
                        e.target.onerror = null;
                      } else {
                        // Fallback cuối: placeholder
                        e.target.src = "/images/placeholder.png";
                      }
                    }
                  }}
                />
              ) : (
                <div className="bg-secondary rounded shadow p-5 text-white text-center mb-4">
                  <i className="bi bi-image fs-1"></i>
                  <p className="mt-2">Chưa có hình ảnh</p>
                </div>
              )}

      {/* CONTENT */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="article-content" style={{ lineHeight: 1.8 }}>
                {article.noiDungBV ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: article.noiDungBV }}
                  />
                ) : (
                  <p className="text-muted">{article.tomTatBV || "Chưa có nội dung"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-lg-4">
          {/* ARTICLE INFO */}
          <div className="card border-0 shadow-sm mb-4 bg-light">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Thông tin bài viết
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Loại bài viết:</strong>
                  <br />
                  <span className="text-muted">{article.maLoaiBV || "Không xác định"}</span>
                </li>
                <li className="mb-2">
                  <strong>Ngày đăng:</strong>
                  <br />
                  <span className="text-muted">
                    {new Date(article.ngayDangBV).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </li>
                <li className="mb-2">
                  <strong>Trạng thái:</strong>
                  <br />
                  <span className={article.trangThaiBV ? "text-success" : "text-danger"}>
                    {article.trangThaiBV ? "✓ Công khai" : "✗ Nháp"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <button
                className="btn btn-primary w-100 mb-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Đã sao chép liên kết!");
                }}
              >
                <i className="bi bi-share me-2"></i>
                Chia sẻ
              </button>
              <button className="btn btn-outline-primary w-100">
                <i className="bi bi-heart me-2"></i>
                Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BACK TO LIST */}
      <div className="text-center mt-5">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/baiviet")}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại danh sách bài viết
        </button>
      </div>
    </div>
  );
}
