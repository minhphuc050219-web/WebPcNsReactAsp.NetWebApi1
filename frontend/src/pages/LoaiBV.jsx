import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getArticleCategory } from "../api/articleCategoryAPI";
import { BASE_URL } from "../api";

export default function LoaiBV() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getArticleCategory();
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Không tải được danh mục");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải danh mục...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary mb-3">📝 DANH MỤC BÀI VIẾT</h1>
          <p className="lead text-muted">
            Chọn danh mục để xem các bài viết mới nhất
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="row g-4">
            {categories.map((category) => (
              <div className="col-md-6 col-lg-4 col-xl-3" key={category.maLoaiBV}>
                <Link 
                  to={`/loaibv/${category.maLoaiBV}`}
                  className="text-decoration-none"
                >
                  <div className="card shadow-sm border-0 h-100 hover-scale">
                    <div className="card-body text-center p-4">
                      <div className="mb-3">
                        <i className="bi bi-newspaper display-4 text-primary opacity-75"></i>
                      </div>
                      <h5 className="card-title fw-bold text-dark mb-2">
                        {category.tenLoaiBV}
                      </h5>
                      <p className="text-muted mb-3">
                        Mã: <strong>{category.maLoaiBV}</strong>
                      </p>
                      <span className="badge bg-primary px-3 py-2">
                        Xem bài viết
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-folder-x display-1 text-muted mb-4"></i>
            <h4 className="text-muted">Chưa có danh mục bài viết nào</h4>
            <p className="text-muted">Danh mục sẽ được cập nhật sớm</p>
          </div>
        )}

        <style jsx>{`
          .hover-scale {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-scale:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
          }
        `}</style>
      </div>
    </div>
  );
}

