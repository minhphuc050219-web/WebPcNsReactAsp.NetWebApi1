import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { searchProduct } from "../api/productAPI";
import { searchBrand } from "../api/brandAPI";
import { searchArticle } from "../api/articleAPI";
import { BASE_URL } from "../api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    if (!keyword) {
      navigate("/sanpham");
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const [prodData, brandData, articleData] = await Promise.all([
          searchProduct(keyword),
          searchBrand(keyword),
          searchArticle(keyword)
        ]);
        setProducts(Array.isArray(prodData) ? prodData : []);
        setBrands(Array.isArray(brandData) ? brandData : []);
        setArticles(Array.isArray(articleData) ? articleData : []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, navigate]);

  const TabContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tìm kiếm...</span>
          </div>
          <p className="mt-3">Đang tìm "{keyword}"...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "products":
        return products.length > 0 ? (
          <div className="row">
            {products.slice(0, 12).map((p) => (
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={p.maSanPham}>
                <div className="card shadow-sm border-0 h-100 hover-effect">
                  <span className={`badge position-absolute top-0 start-0 m-2 ${
                    p.soLuong > 0 ? "bg-success" : "bg-danger"
                  }`} style={{ zIndex: 10 }}>
                    {p.soLuong > 0 ? "SẴN HÀNG" : "HẾT HÀNG"}
                  </span>
                  <img
                    src={
                      p.hangHoaImages
                        ? p.hangHoaImages.startsWith("http")
                          ? p.hangHoaImages
                          : `${BASE_URL}/public/imagesProduct/${p.hangHoaImages}`
                        : "/images/placeholder.png"
                    }
                    className="card-img-top p-3"
                    alt={p.tenSanPham}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body p-3">
                    <h6 className="fw-bold text-truncate-2">{p.tenSanPham}</h6>
                    <p className="text-danger fw-bold fs-6 mb-2">
                      {p.donGia?.toLocaleString("vi-VN")} đ
                    </p>
                    <Link to={`/sanpham/${p.maSanPham}`} className="btn btn-primary btn-sm w-100">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-boxes fs-1 text-muted mb-3"></i>
            <p>Không tìm thấy sản phẩm nào phù hợp với "{keyword}"</p>
          </div>
        );

      case "brands":
        return brands.length > 0 ? (
          <div className="row">
            {brands.map((b) => (
              <div className="col-md-4 col-lg-3 mb-4" key={b.maBrand}>
                <div className="card shadow-sm border-0 h-100 text-center">
                  <img
                    src={`${BASE_URL}/public/imagesBrand/${b.hangHoaImagesBrand || 'placeholder.png'}`}
                    className="card-img-top p-3"
                    alt={b.tenBrand}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">{b.tenBrand}</h6>
                    <Link to={`/thuonghieu?brand=${b.maBrand}`} className="btn btn-outline-primary btn-sm">
                      Xem sản phẩm
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-building fs-1 text-muted mb-3"></i>
            <p>Không tìm thấy thương hiệu nào</p>
          </div>
        );

      case "articles":
        return articles.length > 0 ? (
          <div className="row">
            {articles.slice(0, 12).map((a) => (
              <div className="col-md-6 col-lg-4 mb-4" key={a.maBV}>
                <div className="card shadow-sm border-0 h-100 hover-effect">
                  <img
                    src={`${BASE_URL}/public/imagesArticle/${a.hinhAnhBV || 'placeholder.png'}`}
                    className="card-img-top"
                    alt={a.tenBV}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h6 className="fw-bold">{a.tenBV}</h6>
                    <p className="text-muted small">{a.noiDungBV?.slice(0, 100)}...</p>
                    <Link to={`/article-detail/${a.maBV}`} className="btn btn-outline-primary btn-sm">
                      Đọc bài
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-newspaper fs-1 text-muted mb-3"></i>
            <p>Không tìm thấy bài viết nào</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!keyword) {
    return null;
  }

  return (
    <div className="bg-light py-4">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary mb-3">🔍 Kết quả tìm kiếm: "{keyword}"</h1>
          <p className="text-muted mb-4">
            Sản phẩm: {products.length} | Thương hiệu: {brands.length} | Bài viết: {articles.length}
          </p>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Quay lại
          </button>
        </div>

        <div className="d-flex justify-content-center mb-5 gap-1 flex-wrap">
          <button
            className={`btn btn-sm fw-bold px-4 ${activeTab === "products" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("products")}
          >
            Sản phẩm ({products.length})
          </button>
          <button
            className={`btn btn-sm fw-bold px-4 ${activeTab === "brands" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("brands")}
          >
            Thương hiệu ({brands.length})
          </button>
          <button
            className={`btn btn-sm fw-bold px-4 ${activeTab === "articles" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("articles")}
          >
            Bài viết ({articles.length})
          </button>
        </div>

        <TabContent />
      </div>

      <style>{`
        .hover-effect {
          transition: all 0.3s ease;
        }
        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

