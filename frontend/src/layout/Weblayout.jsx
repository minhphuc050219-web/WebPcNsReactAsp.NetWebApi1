import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDropdown from "../component/UserDropdown";
import ProfileModal from "../component/ProfileModal";
import { getBrand } from "../api/brandAPI";
import { getCategory } from "../api/categoryAPI";
import { getArticleCategory } from "../api/articleCategoryAPI";
import "../pages/CSS/weblayout.css"; // Tạo file CSS riêng nếu cần

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
        const [brandData, categoryData, articleCategoryData] = await Promise.all([
          getBrand(),
          getCategory(),
          getArticleCategory(),
        ]);

        setBrands(Array.isArray(brandData) ? brandData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setArticleCategories(Array.isArray(articleCategoryData) ? articleCategoryData : []);
      } catch {
        setBrands([]);
        setCategories([]);
        setArticleCategories([]);
      }
    };

    loadNavbarData();
  }, []);

  const handleLogout = () => {
    if (!window.confirm("Bạn có chắc muốn đăng xuất không?")) return;
    logout();       // xóa token, quay lại trạng thái chưa đăng nhập
    navigate("/");  // ở lại weblayout nhưng trạng thái chưa login
  };

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="bg-primary text-white py-2 fixed-top shadow">
        <div className="container">
          <div className="row align-items-center">
            {/* LOGO */}
            <div className="col-6 col-md-3">
              <h5 className="fw-bold m-0">NHÓM 3 PC SHOP</h5>
            </div>

            {/* SEARCH */}
            <div className="col-12 col-md-6 my-2 my-md-0">
              <input className="form-control" placeholder="Bạn cần tìm gì?" />
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

        style={{ marginTop: "60px", flex: 1 }}
      >
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu" style={{ marginTop: "65px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav">
              <li className="nav-item">

                <Link className="nav-link active" to="/">
                  Home
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
                    Thương hiệu
                  </button>
                  <ul className="dropdown-menu">
                    {brands.length === 0 ? (
                      <li>
                        <span className="dropdown-item-text text-muted">Không có thương hiệu</span>
                      </li>
                    ) : (
                      brands.map((brand) => (
                        <li key={brand.maBrand ?? brand.tenBrand}>
                          <Link
                            className="dropdown-item"
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
                    Loại sản phẩm
                  </button>
                  <ul className="dropdown-menu">
                    {categories.length === 0 ? (
                      <li>
                        <span className="dropdown-item-text text-muted">Không có loại sản phẩm</span>
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
                <Link className="nav-link" to="/sanpham">
                  Sản phẩm
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
                    Loại bài viết
                  </button>
                  <ul className="dropdown-menu">
                    {articleCategories.length === 0 ? (
                      <li>
                        <span className="dropdown-item-text text-muted">Không có loại bài viết</span>
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
                <Link className="nav-link" to="/baiviet">
                  Bài viết
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/giohang">
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
      <ProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
      />

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
          <div className="row text-center mb-4">
            <div className="col-6 col-md-3 mb-3">
              <i className="bi bi-truck fs-3 text-primary"></i>
              <p className="fw-bold mb-0">Giao hàng</p>
              <small>Thanh toán tại nhà</small>
            </div>

            <div className="col-6 col-md-3 mb-3">
              <i className="bi bi-arrow-repeat fs-3 text-primary"></i>
              <p className="fw-bold mb-0">Đổi trả</p>
              <small>1 đổi 1 trong 7 ngày</small>
            </div>

            <div className="col-6 col-md-3 mb-3">
              <i className="bi bi-credit-card fs-3 text-primary"></i>
              <p className="fw-bold mb-0">Thanh toán</p>
              <small>Tiền mặt / chuyển khoản</small>
            </div>

            <div className="col-6 col-md-3 mb-3">
              <i className="bi bi-headset fs-3 text-primary"></i>
              <p className="fw-bold mb-0">Hỗ trợ</p>
              <small>24/7</small>
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
