import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // ✅ THÊM useNavigate
import { getProduct, searchProduct } from "../api/productAPI";
import { BASE_URL } from "../api";

export default function SanPham() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category"); 
  const brandId = searchParams.get("brand");
  const keyword = searchParams.get("keyword");
  
  // ✅ Khởi tạo hàm điều hướng để làm nút Quay lại
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [sortOrder, setSortOrder] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (keyword) {
          data = await searchProduct(keyword);
        } else {
          data = await getProduct();
        }
        
        let filteredData = Array.isArray(data) ? data : [];

        if (categoryId) {
          filteredData = filteredData.filter(p => String(p.maLoai) === String(categoryId));
        }

        if (brandId) {
          filteredData = filteredData.filter(p => String(p.maBrand) === String(brandId));
        }

        setProducts(filteredData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Không thể tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, brandId]); 

  let processedProducts = [...products];

  if (sortOrder !== 'default') {
    processedProducts.sort((a, b) => {
      const priceA = a.donGia || 0;
      const priceB = b.donGia || 0;
      const nameA = a.tenSanPham || "";
      const nameB = b.tenSanPham || "";

      if (sortOrder === 'priceAsc') return priceA - priceB;
      if (sortOrder === 'priceDesc') return priceB - priceA;
      if (sortOrder === 'nameAsc') return nameA.localeCompare(nameB);
      return 0;
    });
  }

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = processedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortClick = (type) => {
    setSortOrder(prev => prev === type ? 'default' : type);
    setCurrentPage(1);
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
    return <div className="alert alert-danger" role="alert">Lỗi: {error}</div>;
  }

  return (
    <div className="bg-light" style={{ minHeight: "80vh" }}>
      <div className="container pt-4">
        
        {/* ✅ KHUNG TIÊU ĐỀ VÀ NÚT QUAY LẠI */}
        <div className="position-relative text-center mb-4 pt-3">
          
          {/* Nút Quay lại hoặc Xóa tìm kiếm */}
          {(categoryId || brandId || keyword) && (
            <button 
              className="btn btn-outline-secondary btn-sm position-absolute top-0 start-0 mt-3"
              onClick={() => keyword ? navigate('/sanpham') : navigate(-1)}
            >
              <i className="bi bi-arrow-left me-1"></i> {keyword ? 'Xóa tìm kiếm' : 'Quay lại'}
            </button>
          )}

          <h2 className="fw-bold text-primary">
            {keyword 
              ? `Kết quả tìm kiếm "${keyword}": ${products.length} sản phẩm` 
              : categoryId 
                ? `SẢN PHẨM THEO DANH MỤC` 
                : brandId 
                  ? `SẢN PHẨM THEO THƯƠNG HIỆU` 
                  : "TẤT CẢ SẢN PHẨM"
            }
          </h2>
          <p className="text-muted">
            {keyword ? `Tìm thấy ${products.length} sản phẩm phù hợp` : 'Danh sách các sản phẩm của chúng tôi'}
          </p>
        </div>

        <div className="d-flex justify-content-between mb-4 bg-white p-3 rounded shadow-sm">
          <div>
            <button className={`btn btn-sm me-2 ${sortOrder === 'priceAsc' ? 'btn-primary' : 'btn-light'}`} onClick={() => handleSortClick('priceAsc')}>Giá tăng dần</button>
            <button className={`btn btn-sm me-2 ${sortOrder === 'priceDesc' ? 'btn-primary' : 'btn-light'}`} onClick={() => handleSortClick('priceDesc')}>Giá giảm dần</button>
            <button className={`btn btn-sm me-2 ${sortOrder === 'nameAsc' ? 'btn-primary' : 'btn-light'}`} onClick={() => handleSortClick('nameAsc')}>Tên A-Z</button>
          </div>
          <div className="d-flex align-items-center">
            <i className={`bi bi-grid fs-5 me-3 ${viewMode === 'grid' ? 'text-primary' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => setViewMode('grid')}></i>
            <i className={`bi bi-list fs-5 ${viewMode === 'list' ? 'text-primary' : 'text-muted'}`} style={{ cursor: 'pointer' }} onClick={() => setViewMode('list')}></i>
          </div>
        </div>

        {currentProducts.length > 0 ? (
          <div className="row mb-4">
            {currentProducts.map((p) => (
              viewMode === 'grid' ? (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={p.maSanPham}>
                  <div className="card shadow-sm border-0 h-100 position-relative hover-card">
                    {p.soLuong > 0 ? <span className="badge bg-success position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>SẴN HÀNG</span> : <span className="badge bg-danger position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>HẾT HÀNG</span>}
                    <img src={p.hangHoaImages ? p.hangHoaImages.startsWith("http") ? p.hangHoaImages : `${BASE_URL}/public/imagesProduct/${p.hangHoaImages}` : "/images/placeholder.png"} className="card-img-top p-2" alt={p.tenSanPham} style={{ height: "200px", objectFit: "cover" }} onError={(e) => { e.target.src = "/images/placeholder.png"; }} />
                    <div className="card-body p-2 d-flex flex-column">
                      <h6 className="small text-truncate" title={p.tenSanPham}>{p.tenSanPham}</h6>
                      <p className="text-danger fw-bold mb-1">{p.donGia?.toLocaleString("vi-VN")} đ</p>
                      <p className="small text-muted mb-2">Số lượng: {p.soLuong} cái</p>
                      <Link to={`/sanpham/${p.maSanPham}`} className="btn btn-primary btn-sm w-100 text-decoration-none mt-auto"><i className="bi bi-eye me-2"></i> Xem sản phẩm</Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-12 mb-3" key={p.maSanPham}>
                  <div className="card shadow-sm border-0 hover-card">
                    <div className="row g-0 align-items-center">
                      <div className="col-md-3 p-3 text-center position-relative">
                        {p.soLuong > 0 ? <span className="badge bg-success position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>SẴN HÀNG</span> : <span className="badge bg-danger position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>HẾT HÀNG</span>}
                        <img src={p.hangHoaImages ? p.hangHoaImages.startsWith("http") ? p.hangHoaImages : `${BASE_URL}/public/imagesProduct/${p.hangHoaImages}` : "/images/placeholder.png"} className="img-fluid rounded" alt={p.tenSanPham} style={{ maxHeight: "150px", objectFit: "contain" }} onError={(e) => { e.target.src = "/images/placeholder.png"; }} />
                      </div>
                      <div className="col-md-6 p-3">
                        <h5 className="fw-bold text-primary">{p.tenSanPham}</h5>
                        <p className="text-muted small">{p.shortDescription || p.description || "Chưa có mô tả."}</p>
                        <small className="text-muted">Số lượng: {p.soLuong} cái</small>
                      </div>
                      <div className="col-md-3 p-3 text-md-end border-start">
                        <p className="text-danger fw-bold fs-4 mb-3">{p.donGia?.toLocaleString("vi-VN")} đ</p>
                        <Link to={`/sanpham/${p.maSanPham}`} className="btn btn-primary btn-sm w-100">Xem chi tiết</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center py-5" role="alert">
            <i className="bi bi-inbox fs-1 d-block mb-3 text-muted"></i>
            Hiện tại chưa có sản phẩm nào cho mục này.
          </div>
        )}

        {totalPages > 1 && (
          <nav className="d-flex justify-content-center mb-5">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Trước</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Sau</button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      <style>{`
        .hover-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}