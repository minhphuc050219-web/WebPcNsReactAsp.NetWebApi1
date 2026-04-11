import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct } from "../api/productAPI";
import { getCategory } from "../api/categoryAPI";
import { BASE_URL } from "../api";

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching products for category:", categoryId);

        // Fetch all products
        const productData = await getProduct();
        console.log("All products:", productData);

        // Fetch all categories
        const categoryData = await getCategory();
        console.log("All categories:", categoryData);

        // Filter products by category
        const filtered = Array.isArray(productData)
          ? productData.filter(p => String(p.maLoai) === String(categoryId))
          : [];
        console.log("Filtered products:", filtered);
        if (filtered.length > 0) {
          console.log("First product image field:", filtered[0].hangHoaImages);
          console.log("First product:", filtered[0]);
        }

        // Find category info
        const foundCategory = Array.isArray(categoryData)
          ? categoryData.find(c => String(c.maLoai) === String(categoryId))
          : null;

        setProducts(filtered);
        setCategory(foundCategory);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Không thể tải dữ liệu");
        setProducts([]);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

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
          onClick={() => navigate("/loaisp")}
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
            onClick={() => navigate("/loaisp")}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại danh mục
          </button>

          <h2 className="fw-bold text-primary mb-2">
            {category ? category.tenLoai : "Danh mục sản phẩm"}
          </h2>
          {category && (
            <p className="text-muted mb-4">
              Mã danh mục: <strong>{category.maLoai}</strong>
            </p>
          )}
        </div>

        {/* SORT BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-light btn-sm">
              <i className="bi bi-arrow-up"></i> Giá tăng dần
            </button>
            <button className="btn btn-light btn-sm">
              <i className="bi bi-arrow-down"></i> Giá giảm dần
            </button>
            <button className="btn btn-light btn-sm">
              <i className="bi bi-sort-alpha-down"></i> Tên A-Z
            </button>
          </div>

          <div>
            <button className="btn btn-light btn-sm me-2">
              <i className="bi bi-grid-3x3-gap fs-5"></i>
            </button>
            <button className="btn btn-light btn-sm">
              <i className="bi bi-list-ul fs-5"></i>
            </button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {currentProducts.length > 0 ? (
          <div className="row mb-4">
            {currentProducts.map((p) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={p.maSanPham}>
                <div className="card shadow-sm border-0 h-100 position-relative hover-card">
                  {p.soLuong > 0 && (
                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                      SẴN HÀNG
                    </span>
                  )}
                  {p.soLuong <= 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      HẾT HÀNG
                    </span>
                  )}
                  <img
                    src={
                      p.hangHoaImages
                        ? p.hangHoaImages.startsWith("http")
                          ? p.hangHoaImages
                          : p.hangHoaImages.startsWith("/")
                          ? `${BASE_URL}${p.hangHoaImages}`
                          : `${BASE_URL}/public/imagesProduct/${p.hangHoaImages}`
                        : "/images/placeholder.png"
                    }
                    className="card-img-top p-2"
                    alt={p.tenSanPham}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      // Thử fallback khác nếu URL đầu tiên lỗi
                      if (e.target.src && !e.target.src.includes("placeholder")) {
                        e.target.src = "/images/placeholder.png";
                      }
                    }}
                  />
                  <div className="card-body p-2">
                    <h6 className="small text-truncate" title={p.tenSanPham}>
                      {p.tenSanPham}
                    </h6>
                    <p className="text-danger fw-bold mb-1">
                      {p.donGia?.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="small text-muted mb-2">
                      Số lượng: {p.soLuong} cái
                    </p>
                    <Link 
                      to={`/sanpham/${p.maSanPham}`}
                      className="btn btn-primary btn-sm w-100 text-decoration-none"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center" role="alert">
            <i className="bi bi-inbox"></i> Không có sản phẩm nào trong danh mục này
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
