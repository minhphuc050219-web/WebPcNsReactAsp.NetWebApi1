import { Link, Outlet } from "react-router-dom";
export default function MainLayout() {
  return (
    <div>
      {/* HEADER */}
      <div className="bg-primary text-white p-3">
        <div className="container d-flex align-items-center justify-content-between">
          <h4 className="fw-bold">NCPC</h4>

          <input className="form-control w-50" placeholder="Bạn cần tìm gì?" />

          <div>
            <button className="btn btn-light me-2">Tài khoản</button>
            <button className="btn btn-light me-2">
              <Link to="/login">Login</Link>{" "}
            </button>
            <button className="btn btn-warning">Giỏ hàng</button>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link to="/admin">Trang Admin </Link>
            </li>
            <li className="nav-item me-3">PC Gaming</li>
            <li className="nav-item me-3">Laptop</li>
            <li className="nav-item me-3">Linh kiện PC</li>
            <li className="nav-item me-3">Màn hình</li>
            <li className="nav-item me-3">Gear</li>
          </ul>
        </div>
      </nav>
      <hr />

      <Outlet />

      <hr />
      <footer class="bg-light pt-4 mt-5">
        <div class="container">
          {/* VIDEO */}
          <div className="container text-center mt-5">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/Df2z0F1Wm4"
              title="YouTube video"
            ></iframe>
          </div>

          {/* FAQ */}
          <div className="container mt-5">
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
          <div class="row text-center mb-4">
            <div class="col-md-3">
              <i class="bi bi-truck fs-3 text-primary"></i>
              <p class="fw-bold mb-0">CHÍNH SÁCH GIAO HÀNG</p>
              <small>Nhận hàng và thanh toán tại nhà</small>
            </div>

            <div class="col-md-3">
              <i class="bi bi-arrow-repeat fs-3 text-primary"></i>
              <p class="fw-bold mb-0">ĐỔI TRẢ DỄ DÀNG</p>
              <small>1 đổi 1 trong 7 ngày</small>
            </div>

            <div class="col-md-3">
              <i class="bi bi-credit-card fs-3 text-primary"></i>
              <p class="fw-bold mb-0">THANH TOÁN TIỆN LỢI</p>
              <small>Tiền mặt, chuyển khoản, trả góp</small>
            </div>

            <div class="col-md-3">
              <i class="bi bi-headset fs-3 text-primary"></i>
              <p class="fw-bold mb-0">HỖ TRỢ NHIỆT TÌNH</p>
              <small>Tư vấn và hỗ trợ 24/7</small>
            </div>
          </div>
          <hr />
          {/* STORE LIST */}
          <div class="row">
            <div class="col-md-4 mb-3">
              <h6 class="fw-bold">Chi nhánh Hà Nội</h6>

              <p class="mb-1">4/51 Nguyễn Văn Huyên, Cầu Giấy</p>

              <p class="mb-1">83 Thái Hà, Đống Đa</p>

              <p class="mb-1">Số 6 Trần Đại Nghĩa</p>
            </div>

            <div class="col-md-4 mb-3">
              <h6 class="fw-bold">Chi nhánh Hồ Chí Minh</h6>

              <p class="mb-1">602 Lê Hồng Phong, Q10</p>

              <p class="mb-1">28 Nguyễn Tri Phương</p>
            </div>

            <div class="col-md-4 mb-3">
              <h6 class="fw-bold">Chi nhánh Đà Nẵng</h6>

              <p class="mb-1">81 Hàm Nghi</p>

              <p class="mb-1">215 Nguyễn Văn Linh</p>
            </div>
          </div>
          <hr />
          {/* INFO */}
          <div class="row">
            <div class="col-md-3">
              <h6 class="fw-bold">Về chúng tôi</h6>
              <ul class="list-unstyled">
                <li>Giới thiệu</li>
                <li>Tuyển dụng</li>
                <li>Tin công nghệ</li>
                <li>Liên hệ</li>
              </ul>
            </div>
            <div class="col-md-3">
              <h6 class="fw-bold">Chính sách</h6>
              <ul class="list-unstyled">
                <li>Bảo hành</li>
                <li>Đổi trả</li>
                <li>Giao hàng</li>
                <li>Bảo mật</li>
              </ul>
            </div>

            <div class="col-md-3">
              <h6 class="fw-bold">Hỗ trợ</h6>
              <ul class="list-unstyled">
                <li>Mua hàng</li>
                <li>Thanh toán</li>
                <li>Trả góp</li>
                <li>Hướng dẫn</li>
              </ul>
            </div>
          </div>
          <div class="col-md-3">
            <h6 class="fw-bold">Kết nối với chúng tôi</h6>
            <div class="d-flex gap-2">
              <a class="btn btn-primary btn-sm">
                <i class="bi bi-facebook"></i>
              </a>

              <a class="btn btn-danger btn-sm">
                <i class="bi bi-youtube"></i>
              </a>

              <a class="btn btn-dark btn-sm">
                <i class="bi bi-tiktok"></i>
              </a>
            </div>
          </div>
          <hr />

          {/* !-- COPYRIGHT -- */}
          <div class="text-center pb-3">
            <p class="mb-0">© 2026 PC Gaming Store</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
