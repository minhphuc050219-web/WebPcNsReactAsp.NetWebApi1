import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProduct } from "../api/productAPI";
import { BASE_URL } from "../api";
import "./CSS/home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [priceFilter, setPriceFilter] = useState("all");
  const [sortType, setSortType] = useState("none");
  const [page, setPage] = useState(1);
  // viewMode: 'grid' = lưới (mặc định), 'list' = danh sách dọc
  const [viewMode, setViewMode] = useState("grid");

  const pageSize = 12;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProduct();
        setProducts(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        setError(err.message || "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let list = [...products].filter((p) => p.trangThaiSanPham !== false);

    if (priceFilter !== "all") {
      list = list.filter((p) => {
        const price = Number(p.donGia || 0);
        if (priceFilter === "5-15") return price >= 5000000 && price < 15000000;
        if (priceFilter === "15-20")
          return price >= 15000000 && price < 20000000;
        if (priceFilter === "20-30")
          return price >= 20000000 && price < 30000000;
        if (priceFilter === "30-50")
          return price >= 30000000 && price < 50000000;
        if (priceFilter === "50-100")
          return price >= 50000000 && price <= 100000000;
        return true;
      });
    }

    if (sortType === "price-asc") {
      list.sort((a, b) => Number(a.donGia || 0) - Number(b.donGia || 0));
    } else if (sortType === "price-desc") {
      list.sort((a, b) => Number(b.donGia || 0) - Number(a.donGia || 0));
    } else if (sortType === "name-asc") {
      list.sort((a, b) =>
        String(a.tenSanPham || "").localeCompare(String(b.tenSanPham || "")),
      );
    }

    return list;
  }, [products, priceFilter, sortType]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / pageSize),
  );

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [totalPages, page]);

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + " đ";
  };

  const getProductImage = (product) => {
    if (product.hangHoaImages) {
      return `${BASE_URL}/public/imagesProduct/${product.hangHoaImages}`;
    }
    return "/images/panelPC.jpg";
  };

  const getTag = (product) => {
    if (Number(product.soLuong || 0) <= 5) return "SẮP HẾT";
    if (Number(product.donGia || 0) >= 30000000) return "CAO CẤP";
    return "NỔI BẬT";
  };

  return (
    <div className="bg-light home-page">
      <div className="container">
        {/* BANNER */}
        <div className="row mt-3 home-hero-wrapper">
          <div className="col-12">
            <div className="home-hero-glow"></div>
            <img
              src="/images/panelPC.jpg"
              className="img-fluid rounded home-hero"
            />
          </div>
        </div>

        {/* TITLE */}

        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary mb-4">🖥️ PC GAMING & OFFICE</h2>

          <div className="d-flex justify-content-center gap-5 flex-wrap">
            <div className="feature-box">
              <i className="bi bi-pc-display-horizontal fs-3 text-primary mb-2 d-block"></i>
              <p className="small fw-bold">CHỌN THEO NHU CẦU</p>
              <small className="text-muted">Gaming, Office, Workstation</small>
            </div>

            <div className="feature-box">
              <i className="bi bi-cash-stack fs-3 text-success mb-2 d-block"></i>
              <p className="small fw-bold">CHỌN THEO GIÁ</p>
              <small className="text-muted">Phù hợp mọi ngân sách</small>
            </div>

            <div className="feature-box">
              <i className="bi bi-lightning-charge fs-3 text-warning mb-2 d-block"></i>
              <p className="small fw-bold">HIỆU NĂNG CAO</p>
              <small className="text-muted">Intel & AMD</small>
            </div>

            <div className="feature-box">
              <i className="bi bi-shield-check fs-3 text-info mb-2 d-block"></i>
              <p className="small fw-bold">BẢO HÀNH LỚN</p>
              <small className="text-muted">12-36 tháng</small>
            </div>
          </div>
        </div>

        {/* ✅ 3. NÚT LỌC SẢN PHẨM */}
        <div className="text-center mb-4">
          <h5 className="fw-bold mb-3">Chọn theo giá</h5>
          <button
            className={`btn btn-sm m-1 ${priceFilter === "5-15" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setPriceFilter("5-15")}
          >
            5 triệu - 15 triệu
          </button>
          <button
            className={`btn btn-sm m-1 ${priceFilter === "15-20" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setPriceFilter("15-20")}
          >
            15 triệu - 20 triệu
          </button>
          <button
            className={`btn btn-sm m-1 ${priceFilter === "20-30" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setPriceFilter("20-30")}
          >
            20 triệu - 30 triệu
          </button>
          <button
            className={`btn btn-sm m-1 ${priceFilter === "30-50" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setPriceFilter("30-50")}
          >
            30 triệu - 50 triệu
          </button>
          <button
            className={`btn btn-sm m-1 ${priceFilter === "50-100" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setPriceFilter("50-100")}
          >
            50 triệu - 100 triệu
          </button>
          <button
            className={`btn btn-sm m-1 ${priceFilter === "all" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setPriceFilter("all")}
          >
            Tất cả
          </button>
        </div>

        {/*4. NÚT SẮP XẾP VÀ CHẾ ĐỘ XEM: SORT BAR */}

        <div className="d-flex justify-content-between mt-4 bg-white p-2 rounded shadow-sm home-sort-bar">
          <div>
            <button
              className={`btn btn-sm me-2 ${sortType === "price-asc" ? "btn-primary" : "btn-light"}`}
              onClick={() => setSortType("price-asc")}
            >
              Giá tăng dần
            </button>
            <button
              className={`btn btn-sm me-2 ${sortType === "price-desc" ? "btn-primary" : "btn-light"}`}
              onClick={() => setSortType("price-desc")}
            >
              Giá giảm dần
            </button>
            <button
              className={`btn btn-sm me-2 ${sortType === "name-asc" ? "btn-primary" : "btn-light"}`}
              onClick={() => setSortType("name-asc")}
            >
              Tên A-Z
            </button>
          </div>

          <div className="small text-muted d-flex align-items-center">
            <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
            {filteredAndSorted.length} sản phẩm
          </div>

          <div>
            <button
              className={`btn btn-sm me-2 ${viewMode === "grid" ? "btn-primary text-white" : "btn-light"}`}
              onClick={() => setViewMode("grid")}
            >
              <i className="bi bi-grid-3x3-gap fs-5"></i>
            </button>
            <button
              className={`btn btn-sm ${viewMode === "list" ? "btn-primary text-white" : "btn-light"}`}
              onClick={() => setViewMode("list")}
            >
              <i className="bi bi-list-ul fs-5"></i>
            </button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : pagedProducts.length > 0 ? (
          <div className="row mb-5">
            {pagedProducts.map((p) =>
              /* ✅ 5. KIỂM TRA ĐỂ RENDER GRID HAY LIST */
              viewMode === "grid" ? (
                /* --- CODE GỐC CỦA ÔNG (GRID) --- */
                <div
                  className="col-lg-3 col-md-4 col-sm-6 mb-4"
                  key={p.maSanPham}
                >
                  <div className="card shadow-sm border-0 h-100 position-relative hover-effect">
                    {/* ✅ THÊM Z-INDEX VÀO NHÃN */}
                    <span
                      className={`badge position-absolute top-0 start-0 m-2 ${
                        p.soLuong > 0 ? "bg-success" : "bg-danger"
                      }`}
                      style={{ zIndex: 10 }}
                    >
                      {p.soLuong > 0 ? "SẴN HÀNG" : "HẾT HÀNG"}
                    </span>

                    <div className="product-image-container position-relative overflow-hidden">
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
                        style={{
                          height: "220px",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </div>

                    <div className="card-body p-3 d-flex flex-column">
                      <h6
                        className="card-title fw-bold text-truncate-2"
                        title={p.tenSanPham}
                      >
                        {p.tenSanPham}
                      </h6>

                      <p className="text-danger fw-bold fs-5 mb-2">
                        {p.donGia?.toLocaleString("vi-VN") || "0"} đ
                      </p>

                      <small className="text-muted mb-3">
                        Kho: {p.soLuong > 0 ? p.soLuong + " cái" : "Hết hàng"}
                      </small>

                      <div className="d-grid gap-2 mt-auto">
                        <Link
                          to={`/sanpham/${p.maSanPham}`}
                          className="btn btn-primary btn-sm text-decoration-none"
                        >
                          <i className="bi bi-eye me-2"></i>
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* --- GIAO DIỆN DẠNG DANH SÁCH (LIST) --- */
                <div className="col-12 mb-3" key={p.maSanPham}>
                  <div className="card shadow-sm border-0 hover-effect bg-white overflow-hidden">
                    <div className="row g-0 align-items-center">
                      <div className="col-md-3 p-3 text-center position-relative">
                        {/* ✅ THÊM Z-INDEX VÀO NHÃN */}
                        {p.soLuong > 0 ? (
                          <span
                            className="badge bg-success position-absolute top-0 start-0 m-2"
                            style={{ zIndex: 10 }}
                          >
                            SẴN HÀNG
                          </span>
                        ) : (
                          <span
                            className="badge bg-danger position-absolute top-0 start-0 m-2"
                            style={{ zIndex: 10 }}
                          >
                            HẾT HÀNG
                          </span>
                        )}
                        <img
                          src={
                            p.hangHoaImages
                              ? p.hangHoaImages.startsWith("http")
                                ? p.hangHoaImages
                                : `${BASE_URL}/public/imagesProduct/${p.hangHoaImages}`
                              : "/images/placeholder.png"
                          }
                          className="img-fluid rounded"
                          alt={p.tenSanPham}
                          style={{ maxHeight: "150px", objectFit: "contain" }}
                        />
                      </div>
                      <div className="col-md-6 p-3">
                        <h5 className="fw-bold text-primary">{p.tenSanPham}</h5>
                        <p className="text-muted small text-truncate-2">
                          {p.shortDescription || p.description}
                        </p>
                        <small className="text-muted">
                          số lượng:{" "}
                          {p.soLuong > 0 ? p.soLuong + " cái" : "Hết hàng"}
                        </small>
                      </div>
                      <div className="col-md-3 p-3 text-md-end border-start">
                        <p className="text-danger fw-bold fs-4 mb-3">
                          {p.donGia?.toLocaleString("vi-VN") || "0"} đ
                        </p>
                        <div className="d-flex flex-column gap-2">
                          <Link
                            to={`/sanpham/${p.maSanPham}`}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-eye me-1"></i> Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="alert alert-info text-center" role="alert">
            Không có sản phẩm nào phù hợp với bộ lọc.
          </div>
        )}

        {/* SEE ALL BUTTON */}
        {products.length > 0 && (
          <div className="text-center mb-5">
            <Link to="/sanpham" className="btn btn-primary btn-lg">
              <i className="bi bi-arrow-right me-2"></i>
              Xem tất cả sản phẩm
            </Link>
          </div>
        )}

        {/* CATEGORIES SECTION (GIỮ NGUYÊN) */}
        <div className="bg-white rounded shadow p-4 mb-5">
          <h4 className="fw-bold text-center mb-4">💼 CÁC DANH MỤC</h4>
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <Link
                to="/loaisp"
                className="text-decoration-none text-dark category-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <i className="bi bi-controller fs-2 text-primary d-block mb-2"></i>
                  <h6 className="fw-bold">PC Gaming</h6>
                </div>
              </Link>
            </div>
            <div className="col-md-3 mb-3">
              <Link
                to="/loaisp"
                className="text-decoration-none text-dark category-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <i className="bi bi-briefcase fs-2 text-success d-block mb-2"></i>
                  <h6 className="fw-bold">PC Office</h6>
                </div>
              </Link>
            </div>
            <div className="col-md-3 mb-3">
              <Link
                to="/loaisp"
                className="text-decoration-none text-dark category-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <i className="bi bi-gpu-card fs-2 text-danger d-block mb-2"></i>
                  <h6 className="fw-bold">PC Workstation</h6>
                </div>
              </Link>
            </div>
            <div className="col-md-3 mb-3">
              <Link
                to="/loaisp"
                className="text-decoration-none text-dark category-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <i className="bi bi-broadcast fs-2 text-warning d-block mb-2"></i>
                  <h6 className="fw-bold">PC Streaming</h6>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* BRANDS SECTION (GIỮ NGUYÊN) */}
        <div className="bg-white rounded shadow p-4 mb-5">
          <h4 className="fw-bold text-center mb-4">🏢 THƯƠNG HIỆU</h4>
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <Link
                to="/thuonghieu"
                className="text-decoration-none text-dark brand-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <h5 className="fw-bold">Intel</h5>
                  <small className="text-muted">Bộ xử lý cao cấp</small>
                </div>
              </Link>
            </div>
            <div className="col-md-3 mb-3">
              <Link
                to="/thuonghieu"
                className="text-decoration-none text-dark brand-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <h5 className="fw-bold">AMD</h5>
                  <small className="text-muted">Hiệu suất tuyệt vời</small>
                </div>
              </Link>
            </div>
            <div className="col-md-3 mb-3">
              <Link
                to="/thuonghieu"
                className="text-decoration-none text-dark brand-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <h5 className="fw-bold">NVIDIA</h5>
                  <small className="text-muted">Card đồ họa mạnh</small>
                </div>
              </Link>
            </div>
            <div className="col-md-3 mb-3">
              <Link
                to="/thuonghieu"
                className="text-decoration-none text-dark brand-link"
              >
                <div className="p-3 border rounded hover-bg">
                  <h5 className="fw-bold">Corsair</h5>
                  <small className="text-muted">Nguồn & tản nhiệt</small>
                </div>
              </Link>
            </div>
          </div>
        </div>

        

        {/* CSS STYLES (GIỮ NGUYÊN NHƯNG THÊM 1 DÒNG CHỐNG GIẬT) */}
        <style>{`
          .hover-effect {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            will-change: transform; /* Chống giật */
          }
          .hover-effect:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          }
          .text-truncate-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .hover-bg:hover {
            background-color: #f8f9fa;
          }
          .feature-box {
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            min-width: 150px;
          }
          .category-link,
          .brand-link {
            transition: all 0.3s ease;
          }
        `}</style>
      </div>
    </div>
  );
}
