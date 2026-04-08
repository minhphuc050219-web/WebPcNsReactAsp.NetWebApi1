import { useEffect, useMemo, useState } from "react";
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
        if (priceFilter === "15-20") return price >= 15000000 && price < 20000000;
        if (priceFilter === "20-30") return price >= 20000000 && price < 30000000;
        if (priceFilter === "30-50") return price >= 30000000 && price < 50000000;
        if (priceFilter === "50-100") return price >= 50000000 && price <= 100000000;
        return true;
      });
    }

    if (sortType === "price-asc") {
      list.sort((a, b) => Number(a.donGia || 0) - Number(b.donGia || 0));
    } else if (sortType === "price-desc") {
      list.sort((a, b) => Number(b.donGia || 0) - Number(a.donGia || 0));
    } else if (sortType === "name-asc") {
      list.sort((a, b) => String(a.tenSanPham || "").localeCompare(String(b.tenSanPham || "")));
    }

    return list;
  }, [products, priceFilter, sortType]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));

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
            <img src="/images/panelPC.jpg" className="img-fluid rounded home-hero" />
          </div>
        </div>

        {/* TITLE */}

        <div className="text-center mt-4">
          <h4 className="fw-bold text-primary">PC GAMING</h4>

          <div className="d-flex justify-content-center gap-5 mt-3">
            <div>
              <i className="bi bi-pc-display fs-3"></i>
              <p className="small">CHỌN THEO NHU CẦU</p>
            </div>

            <div>
              <i className="bi bi-cash-stack fs-3"></i>
              <p className="small">CHỌN THEO GIÁ</p>
            </div>

            <div>
              <i className="bi bi-cpu fs-3"></i>
              <p className="small">GAME ON AMD</p>
            </div>
          </div>
        </div>

        {/* FILTER */}

        <div className="mt-3 text-center">
          <button className={`btn btn-sm m-1 ${priceFilter === "5-15" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setPriceFilter("5-15")}>
            5 triệu - 15 triệu
          </button>
          <button className={`btn btn-sm m-1 ${priceFilter === "15-20" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setPriceFilter("15-20")}>
            15 triệu - 20 triệu
          </button>
          <button className={`btn btn-sm m-1 ${priceFilter === "20-30" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setPriceFilter("20-30")}>
            20 triệu - 30 triệu
          </button>
          <button className={`btn btn-sm m-1 ${priceFilter === "30-50" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setPriceFilter("30-50")}>
            30 triệu - 50 triệu
          </button>
          <button className={`btn btn-sm m-1 ${priceFilter === "50-100" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setPriceFilter("50-100")}>
            50 triệu - 100 triệu
          </button>
          <button className={`btn btn-sm m-1 ${priceFilter === "all" ? "btn-dark" : "btn-outline-dark"}`} onClick={() => setPriceFilter("all")}>
            Tất cả
          </button>
        </div>

        {/* SORT BAR */}

        <div className="d-flex justify-content-between mt-4 bg-white p-2 rounded shadow-sm home-sort-bar">
          <div>
            <button className={`btn btn-sm me-2 ${sortType === "price-asc" ? "btn-primary" : "btn-light"}`} onClick={() => setSortType("price-asc")}>Giá tăng dần</button>
            <button className={`btn btn-sm me-2 ${sortType === "price-desc" ? "btn-primary" : "btn-light"}`} onClick={() => setSortType("price-desc")}>Giá giảm dần</button>
            <button className={`btn btn-sm me-2 ${sortType === "name-asc" ? "btn-primary" : "btn-light"}`} onClick={() => setSortType("name-asc")}>Tên A-Z</button>
          </div>

          <div className="small text-muted d-flex align-items-center">
            <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
            {filteredAndSorted.length} sản phẩm
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 mb-0">Đang tải sản phẩm...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}

        {!loading && !error && pagedProducts.length === 0 && (
          <div className="alert alert-warning mt-3">Không có sản phẩm phù hợp bộ lọc.</div>
        )}

        <div className="row mt-3">
          {pagedProducts.map((p, index) => (
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4" key={p.maSanPham ?? index}>
              <div className="card shadow-sm border-0 h-100 position-relative home-card" style={{ animationDelay: `${index * 55}ms` }}>
                {/* TAG */}

                <span
                  className={`badge position-absolute top-0 start-0 m-2 
${getTag(p) === "SẮP HẾT" ? "bg-danger" : getTag(p) === "CAO CẤP" ? "bg-warning text-dark" : "bg-primary"}`}
                >
                  {getTag(p)}
                </span>

                <img src={getProductImage(p)} className="card-img-top p-2 home-product-image" />

                <div className="card-body p-2">
                  <h6 className="small fw-semibold text-truncate" title={p.tenSanPham}>
                    {p.tenSanPham}
                  </h6>

                  <p className="text-danger fw-bold mb-1">{formatPrice(p.donGia)}</p>

                  <p className="small text-muted mb-2">
                    {Number(p.soLuong || 0) > 0 ? `Còn ${p.soLuong} sản phẩm` : "Hết hàng"}
                  </p>

                  <button className="btn btn-primary btn-sm w-100 home-detail-btn" disabled={Number(p.soLuong || 0) <= 0}>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}

        {!loading && !error && totalPages > 1 && (
          <nav className="d-flex justify-content-center">
            <ul className="pagination">
              {Array.from({ length: totalPages }).map((_, i) => (
                <li key={i + 1} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

      </div>
    </div>
  );
}
