import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "../component/UserDropdown";
import ProfileModal from "../component/ProfileModal";
import { getBrand } from "../api/brandAPI";
import { getCategory } from "../api/categoryAPI";
import { getArticleCategory } from "../api/articleCategoryAPI";
import "../pages/CSS/weblayout.css"; // Tạo file CSS riêng nếu cần
import { searchProduct } from "../api/productAPI"; // ✅ Import API tìm SP
import { searchArticle } from "../api/articleAPI"; // ✅ Import API tìm Bài viết
import { BASE_URL } from "../api";

export default function MainLayout() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [articleCategories, setArticleCategories] = useState([]);

  useEffect(() => {
    const loadNavbarData = async () => {
      try {
        const [brandData, categoryData, articleCategoryData] =
          await Promise.all([getBrand(), getCategory(), getArticleCategory()]);

        setBrands(Array.isArray(brandData) ? brandData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setArticleCategories(
          Array.isArray(articleCategoryData) ? articleCategoryData : [],
        );
      } catch {
        setBrands([]);
        setCategories([]);
        setArticleCategories([]);
      }
    };

    loadNavbarData();
  }, []);

  // ✅ STATE CHO TÍNH NĂNG TÌM KIẾM ĐỔ XUỐNG
  // searchKeyword bắt buộc phải có vì được dùng ở input, debounce và handleSearch
  const [searchKeyword, setSearchKeyword] = useState("");
  const [liveResults, setLiveResults] = useState({
    products: [],
    articles: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null); // Dùng để click ra ngoài thì ẩn dropdown

  // ✅ LOGIC TÌM KIẾM TRỰC TIẾP (DEBOUNCE 0.5 GIÂY)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const keyword = searchKeyword.trim();
      if (keyword.length > 0) {
        setIsSearching(true);
        setShowSearchDropdown(true);
        try {
          // Gọi API tìm kiếm SP và Bài viết cùng lúc
          const [prodData, articleData] = await Promise.all([
            searchProduct(keyword),
            searchArticle(keyword),
          ]);

          // Lấy 5 SP và 3 Bài viết đầu tiên để show cho gọn
          setLiveResults({
            products: Array.isArray(prodData) ? prodData.slice(0, 5) : [],
            articles: Array.isArray(articleData) ? articleData.slice(0, 3) : [],
          });
        } catch (error) {
          console.error("Lỗi tìm kiếm live:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowSearchDropdown(false);
        setLiveResults({ products: [], articles: [] });
      }
    }, 500); // Chờ 0.5s sau khi ngưng gõ mới gọi API

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // ✅ TẮT DROPDOWN KHI CLICK RA NGOÀI
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearch = () => {
    const keyword = searchKeyword.trim();
    if (!keyword) return;
    setShowSearchDropdown(false); // Ẩn dropdown khi bấm enter
    navigate(`/sanpham?keyword=${encodeURIComponent(keyword)}`);
  };

  // Chuẩn hóa đường dẫn ảnh cho dropdown tìm kiếm
  const getImageUrl = (imgPath, type = "product") => {
    if (!imgPath) return "/images/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath;
    const folder = type === "article" ? "imagesArticle" : "imagesProduct";
    return `${BASE_URL}/public/${folder}/${imgPath}`;
  };

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất không?")) return;
    logout(); // xóa token, quay lại trạng thái chưa đăng nhập
    navigate("/"); // ở lại weblayout nhưng trạng thái chưa login
  };

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="bg-primary text-white py-2 fixed-top shadow">
        <div className="container">
          <div className="row align-items-center">
            {/* LOGO */}
            <div className="col-6 col-md-3">
               <Link className="nav-link fw-bold" to="/">
              <h5 className="fw-bold m-0">NHÓM 3 PC SHOP</h5>
              </Link>
            </div>

            {/* SEARCH */}
            <div
              className="col-12 col-md-6 my-2 my-md-0 position-relative"
              ref={searchRef}
            >
              <div className="input-group">
                <input
                  type="text"
                  className="form-control rounded-start"
                  placeholder="🔍 Tìm sản phẩm, bài viết..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onFocus={() => {
                    if (searchKeyword.trim()) setShowSearchDropdown(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
                <button
                  className="btn btn-light rounded-end"
                  type="button"
                  onClick={handleSearch}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>

              {/* ✅ BẢNG DROPDOWN TÌM KIẾM ĐỔ XUỐNG */}
              {showSearchDropdown && searchKeyword.trim().length > 0 && (
                <div
                  className="position-absolute bg-white shadow-lg rounded mt-1 w-100"
                  style={{
                    zIndex: 1050,
                    top: "100%",
                    left: 0,
                    maxHeight: "450px",
                    overflowY: "auto",
                  }}
                >
                  {isSearching ? (
                    <div className="p-3 text-center text-muted">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Đang tìm kiếm...
                    </div>
                  ) : liveResults.products.length === 0 &&
                    liveResults.articles.length === 0 ? (
                    <div className="p-3 text-center text-muted">
                      Không tìm thấy kết quả cho "{searchKeyword}"
                    </div>
                  ) : (
                    <>
                      {/* HIỂN THỊ SẢN PHẨM */}
                      {liveResults.products.length > 0 && (
                        <div className="p-2">
                          <h6 className="fw-bold text-primary border-bottom pb-2 mb-2 px-2 small text-uppercase">
                            <i className="bi bi-box-seam me-2"></i>Sản phẩm
                          </h6>
                          {liveResults.products.map((p) => (
                            <Link
                              to={`/sanpham/${p.maSanPham}`}
                              key={p.maSanPham}
                              className="d-flex align-items-center text-decoration-none text-dark p-2 search-item-hover rounded mb-1"
                              onClick={() => {
                                setShowSearchDropdown(false);
                                setSearchKeyword("");
                              }}
                            >
                              <img
                                src={getImageUrl(p.hangHoaImages)}
                                alt={p.tenSanPham}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit: "contain",
                                }}
                                className="me-3 rounded border p-1 bg-light"
                              />
                              <div className="flex-grow-1 overflow-hidden">
                                <h6
                                  className="mb-0 fw-bold text-truncate"
                                  style={{ fontSize: "14px" }}
                                >
                                  {p.tenSanPham}
                                </h6>
                                <span className="text-danger fw-bold small">
                                  {p.donGia?.toLocaleString("vi-VN")} đ
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* HIỂN THỊ BÀI VIẾT */}
                      {liveResults.articles.length > 0 && (
                        <div className="p-2 border-top">
                          <h6 className="fw-bold text-success border-bottom pb-2 mb-2 px-2 small text-uppercase mt-2">
                            <i className="bi bi-newspaper me-2"></i>Bài viết
                          </h6>
                          {liveResults.articles.map((a) => (
                            <Link
                              to={`/article-detail/${a.maBV}`}
                              key={a.maBV}
                              className="d-flex align-items-center text-decoration-none text-dark p-2 search-item-hover rounded mb-1"
                              onClick={() => {
                                setShowSearchDropdown(false);
                                setSearchKeyword("");
                              }}
                            >
                              <img
                                src={getImageUrl(a.hinhAnhBV, "article")}
                                alt={a.tenBV}
                                style={{
                                  width: "50px",
                                  height: "40px",
                                  objectFit: "cover",
                                }}
                                className="me-3 rounded border"
                              />
                              <div className="flex-grow-1 overflow-hidden">
                                <h6
                                  className="mb-0 text-truncate"
                                  style={{ fontSize: "13px" }}
                                >
                                  {a.tenBV}
                                </h6>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* NÚT XEM TẤT CẢ */}
                      <div className="p-2 border-top text-center bg-light rounded-bottom">
                        <button
                          className="btn btn-link text-decoration-none fw-bold small w-100"
                          onClick={handleSearch}
                        >
                          Xem tất cả kết quả tìm kiếm{" "}
                          <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* BUTTON - đã đăng nhập: hiện UserDropdown; chưa đăng nhập: hiện nút Login */}
            <div className="col-6 col-md-3 text-end d-flex align-items-center justify-content-end gap-2">
              {isLoggedIn ? (
                /* Đã đăng nhập: avatar + tên → dropdown (Settings, Giỏ hàng, Đăng xuất) */
                <UserDropdown
                  onOpenSettings={() => setShowProfile(true)}
                  onLogout={handleLogout}
                  extraItems={[
                    {
                      icon: "🛒",
                      label: "Giỏ hàng",
                      onClick: () => navigate("/giohang"),
                    },
                  ]}
                />
              ) : (
                /* Chưa đăng nhập: nút Login và Giỏ hàng */
                <>
                  <Link to="/login" className="btn btn-light btn-sm">
                    Đăng nhập
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => navigate("/giohang")}
                  >
                    🛒 Giỏ hàng
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow-sm"
        style={{ marginTop: "70px", zIndex: 1020 }}
      >
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            style={{ marginTop: "65px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/">
                  <i className="bi bi-house me-1"></i>Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle text-decoration-none"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-building me-1"></i>Thương hiệu
                  </button>
                  <ul className="dropdown-menu">
                    {brands.length === 0 ? (
                      <li>
                        <span className="dropdown-item-text text-muted">
                          Không có thương hiệu
                        </span>
                      </li>
                    ) : (
                      brands.map((brand) => (
                        <li key={brand.maBrand ?? brand.tenBrand}>
                          <Link
                            className="dropdown-item "
                            to={`/thuonghieu?brand=${encodeURIComponent(brand.maBrand ?? "")}`}
                          >
                            {brand.tenBrand}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle text-decoration-none"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-box-seam me-1"></i>Loại sản phẩm
                  </button>
                  <ul className="dropdown-menu">
                    {categories.length === 0 ? (
                      <li>
                        <span className="dropdown-item-text text-muted">
                          Không có loại sản phẩm
                        </span>
                      </li>
                    ) : (
                      categories.map((category) => (
                        <li key={category.maLoai ?? category.tenLoai}>
                          <Link
                            className="dropdown-item"
                            to={`/loaisp?maloai=${encodeURIComponent(category.maLoai ?? "")}`}
                          >
                            {category.tenLoai}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/sanpham">
                  <i className="bi bi-box2 me-1"></i>Sản phẩm
                </Link>
              </li>
              <li className="nav-item">
                <div className="dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle text-decoration-none"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-journal-text me-1"></i>Loại bài viết
                  </button>
                  <ul className="dropdown-menu">
                    {articleCategories.length === 0 ? (
                      <li>
                        <span className="dropdown-item-text text-muted">
                          Không có loại bài viết
                        </span>
                      </li>
                    ) : (
                      articleCategories.map((item) => (
                        <li key={item.maLoaiBV ?? item.tenLoaiBV}>
                          <Link
                            className="dropdown-item"
                            to={`/loaibv?maloaibv=${encodeURIComponent(item.maLoaiBV ?? "")}`}
                          >
                            {item.tenLoaiBV}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/baiviet">
                  <i className="bi bi-newspaper me-1"></i>Bài viết
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/giohang">
                  <i className="bi bi-cart me-1"></i>Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HIỆU ỨNG TÌM KIẾM & BANNER */}
      <style>{`
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.05); }
        .search-item-hover { transition: background-color 0.2s ease; }
        .search-item-hover:hover { background-color: #f1f3f5; cursor: pointer; }
      `}</style>
      {/* BANNER TRÁI */}
      <div className="position-fixed top-50 start-0 translate-middle-y d-none d-xl-block ms-2">
        <img
          src="/images/panelPC3.jpg"
          width="130"
          className="rounded shadow"
        />
      </div>

      {/* BANNER PHẢI */}
      <div className="position-fixed top-50 end-0 translate-middle-y d-none d-xl-block me-2">
        <img
          src="/images/panelPC4.jpg"
          width="130"
          className="rounded shadow"
        />
      </div>

      {/* CONTENT */}

      <div className="container mt-4">
        <Outlet />
      </div>

      {/* Modal sửa thông tin tài khoản - hiện khi bấm Settings trong UserDropdown */}
      <ProfileModal show={showProfile} onClose={() => setShowProfile(false)} />

      <hr />
      <footer className="bg-light pt-4 mt-5">
        <div className="container">
          {/* VIDEO */}
          <div className="text-center mb-4">
            <div className="ratio ratio-16x9">
              <iframe
                src="https://www.youtube.com/embed/Df2z0F1Wm4"
                title="YouTube video"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* FAQ */}
          <div className="text-center mb-4">
            <h4>Câu hỏi thường gặp</h4>

            <div className="accordion" id="faq">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    data-bs-toggle="collapse"
                    data-bs-target="#q1"
                  >
                    PC Gaming là gì?
                  </button>
                </h2>

                <div id="q1" className="accordion-collapse collapse show">
                  <div className="accordion-body">
                    PC tối ưu cho chơi game và đồ họa.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#q2"
                  >
                    Bảo hành bao lâu?
                  </button>
                </h2>

                <div id="q2" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    Bảo hành từ 12 - 36 tháng.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SERVICES */}
          {/* FEATURED BENEFITS (GIỮ NGUYÊN) */}
        <div className="row mb-5 text-center">
          <div className="col-md-3 mb-3">
            <div className="p-3">
              <i className="bi bi-truck fs-2 text-primary mb-2 d-block"></i>
              <h6 className="fw-bold">Giao hàng nhanh</h6>
              <small className="text-muted">Toàn quốc trong 3-5 ngày</small>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3">
              <i className="bi bi-arrow-repeat fs-2 text-success mb-2 d-block"></i>
              <h6 className="fw-bold">Đổi trả 7 ngày</h6>
              <small className="text-muted">Miễn phí, không yêu cầu</small>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3">
              <i className="bi bi-credit-card fs-2 text-warning mb-2 d-block"></i>
              <h6 className="fw-bold">Thanh toán linh hoạt</h6>
              <small className="text-muted">
                Tiền mặt, chuyển khoản, trả góp
              </small>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="p-3">
              <i className="bi bi-headset fs-2 text-danger mb-2 d-block"></i>
              <h6 className="fw-bold">Hỗ trợ 24/7</h6>
              <small className="text-muted">Chat, email, điện thoại</small>
            </div>
          </div>
        </div>
          <hr />
          {/* STORE LIST */}
          <div className="row text-center mb-4">
            <div className="col-md-4 mb-3">
              <h6 className="fw-bold">Chi nhánh Hà Nội</h6>

              <p className="mb-1">4/51 Nguyễn Văn Huyên, Cầu Giấy</p>

              <p className="mb-1">83 Thái Hà, Đống Đa</p>

              <p className="mb-1">Số 6 Trần Đại Nghĩa</p>
            </div>

            <div className="col-md-4 mb-3">
              <h6 className="fw-bold">Chi nhánh Hồ Chí Minh</h6>

              <p className="mb-1">602 Lê Hồng Phong, Q10</p>

              <p className="mb-1">28 Nguyễn Tri Phương</p>
            </div>

            <div className="col-md-4 mb-3">
              <h6 className="fw-bold">Chi nhánh Đà Nẵng</h6>

              <p className="mb-1">81 Hàm Nghi</p>

              <p className="mb-1">215 Nguyễn Văn Linh</p>
            </div>
          </div>
          <hr />
          {/* INFO */}
          <div className="row">
            <div className="col-6 col-md-3 mb-3">
              <h6 className="fw-bold">Về chúng tôi</h6>
              <ul className="list-unstyled">
                <li>Giới thiệu</li>
                <li>Tuyển dụng</li>
                <li>Tin công nghệ</li>
                <li>Liên hệ</li>
              </ul>
            </div>

            <div className="col-6 col-md-3 mb-3">
              <h6 className="fw-bold">Chính sách</h6>
              <ul className="list-unstyled">
                <li>Bảo hành</li>
                <li>Đổi trả</li>
                <li>Giao hàng</li>
                <li>Bảo mật</li>
              </ul>
            </div>

            <div className="col-6 col-md-3 mb-3">
              <h6 className="fw-bold">Hỗ trợ</h6>
              <ul className="list-unstyled">
                <li>Mua hàng</li>
                <li>Thanh toán</li>
                <li>Trả góp</li>
                <li>Hướng dẫn</li>
              </ul>
            </div>
          </div>
          {/* ICON */}

          <div className="col-6 col-md-3 mb-3">
            <h6 className="fw-bold">Kết nối với chúng tôi</h6>
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-facebook"></i>
              </button>

              <button className="btn btn-danger btn-sm">
                <i className="bi bi-youtube"></i>
              </button>

              <button className="btn btn-dark btn-sm">
                <i className="bi bi-tiktok"></i>
              </button>
            </div>
          </div>
          <hr />

          {/* !-- COPYRIGHT -- */}
          <div className="text-center pb-3">
            <p className="mb-0">© 2026 PHUC TRUONG PC Gaming Store</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
