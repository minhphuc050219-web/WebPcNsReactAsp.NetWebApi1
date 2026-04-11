import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { getBrand } from "../api/brandAPI";
import { BASE_URL } from "../api";

export default function ThuongHieu() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const data = await getBrand();
        setBrands(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Không thể tải thương hiệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands(); // ✅ Đã dọn dẹp sạch sẽ, chỉ gọi đúng hàm này
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/images/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath; 
    if (imgPath.startsWith("/")) return imgPath; 
    return `${BASE_URL}/public/imagesBrand/${imgPath}`; 
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
    <div className="bg-light py-4" style={{ minHeight: "80vh" }}>
      <div className="container">
        <div className="text-center mb-5 pt-3">
          <h2 className="fw-bold text-primary">THƯƠNG HIỆU</h2>
          <p className="text-muted">Các thương hiệu uy tín mà chúng tôi cung cấp</p>
        </div>

        {brands.length > 0 ? (
          <div className="row mb-4">
            {brands.map((brand) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={brand.maBrand}>
                <div className="card shadow-sm border-0 h-100 hover-card">
                  <img
                    src={getImageUrl(brand.brandImages || brand.BrandImages)}
                    className="card-img-top p-3"
                    alt={brand.tenBrand}
                    style={{ height: "200px", objectFit: "contain" }}
                    onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                  />
                  <div className="card-body text-center p-3 d-flex flex-column">
                    <h5 className="card-title fw-bold">{brand.tenBrand}</h5>
                    <p className="card-text text-muted small mb-3">Mã: {brand.maBrand}</p>
                    <div className="mt-auto">
                      {/* NÚT CHUYỂN QUA TRANG SẢN PHẨM HOẠT ĐỘNG 100% */}
                      <Link 
                        to={`/sanpham?brand=${brand.maBrand}`} 
                        className="btn btn-primary btn-sm w-100 fw-bold"
                      >
                        <i className="bi bi-eye me-2"></i> Xem sản phẩm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center py-5 shadow-sm" role="alert">
            <i className="bi bi-inbox fs-1 d-block mb-3 text-muted"></i>
            Không có thương hiệu nào
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