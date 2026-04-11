import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategory } from "../api/categoryAPI";
import { BASE_URL } from "../api";

export default function LoaiSP() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategory();
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Hàm xử lý đường dẫn ảnh thông minh (Giống bên CategoryUpDel)
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/images/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath; // Nếu là link có sẵn trên mạng
    if (imgPath.startsWith("/")) return imgPath; // Nếu là link ảnh local có sẵn (như /images/gaming.png)
    return `${BASE_URL}/public/imagesCategory/${imgPath}`; // Nếu là ảnh vừa upload từ Backend C#
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
    <div className="bg-light py-4">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">LOẠI SẢN PHẨM</h2>
          <p className="text-muted">Các danh mục sản phẩm của chúng tôi</p>
        </div>

        {categories.length > 0 ? (
          <div className="row mb-4">
            {categories.map((category) => (
              <div
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
                key={category.maLoai}
              >
                <div className="card shadow-sm border-0 h-100 hover-card">
                  <img
                    /* ĐÃ SỬA: Dùng hàm getImageUrl để xử lý đường dẫn */
                    src={getImageUrl(category.loaiImages || category.LoaiImages)}
                    className="card-img-top p-3"
                    alt={category.tenLoai}
                    style={{ height: "250px", objectFit: "contain" }}
                    onError={(e) => {
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                  <div className="card-body text-center p-3 d-flex flex-column">
                    <h5 className="card-title fw-bold">{category.tenLoai}</h5>
                    <p className="card-text text-muted small mb-3">
                      Mã: {category.maLoai}
                    </p>
                    <div className="mt-auto">
                      <Link
                        to={`/sanpham?category=${category.maLoai}`} 
                        className="btn btn-primary btn-sm w-100"
                      >
                        <i className="bi bi-eye me-2"></i>Xem sản phẩm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center" role="alert">
            <i className="bi bi-inbox me-2"></i> Không có loại sản phẩm nào
          </div>
        )}
      </div>

      <style>{`
        .hover-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}