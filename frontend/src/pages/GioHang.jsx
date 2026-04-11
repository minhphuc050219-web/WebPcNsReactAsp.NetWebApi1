import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api";

export default function GioHang() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }
    setLoading(false);
  }, []);

  // Hàm xử lý ảnh cực chuẩn chống gãy hình
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/images/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/")) return imgPath;
    return `${BASE_URL}/public/imagesProduct/${imgPath}`;
  };

  // Hàm tính tổng tiền (Bao chuẩn cả donGia và price, quantity và soLuong)
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.donGia || item.price || 0);
      const qty = Number(item.soLuong || item.quantity || 1);
      return sum + (price * qty);
    }, 0);
  };

  const handleRemoveItem = (idToRemove) => {
    const updated = cartItems.filter(item => {
      const id = item.maSanPham || item.maSP;
      return id !== idToRemove;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleQuantityChange = (idToUpdate, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(idToUpdate);
      return;
    }
    const updated = cartItems.map(item => {
      const id = item.maSanPham || item.maSP;
      if (id === idToUpdate) {
        // Cập nhật cả 2 biến để tương thích mọi nơi
        return { ...item, soLuong: newQuantity, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
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

  return (
    <div className="bg-light py-4" style={{ minHeight: "80vh" }}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">GIỎ HÀNG CỦA BẠN</h2>
          <p className="text-muted">Kiểm tra và quản lý các sản phẩm trong giỏ</p>
        </div>

        {cartItems.length > 0 ? (
          <div className="row">
            {/* CART ITEMS */}
            <div className="col-lg-8 mb-4">
              <div className="bg-white rounded-4 shadow-sm p-4">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-end">Tổng cộng</th>
                      <th className="text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => {
                      // Chuẩn hóa dữ liệu đầu vào
                      const id = item.maSanPham || item.maSP || index;
                      const name = item.tenSanPham || item.tenSP || "Sản phẩm";
                      const price = Number(item.donGia || item.price || 0);
                      const qty = Number(item.soLuong || item.quantity || 1);
                      const img = item.anhSanPham || item.anhSP || item.image;

                      return (
                        <tr key={id}>
                          {/* Cột Ảnh & Tên */}
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={getImageUrl(img)}
                                alt={name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "contain",
                                }}
                                className="rounded border p-1"
                                onError={(e) => e.target.src = "/images/placeholder.png"}
                              />
                              <span className="text-truncate fw-semibold" style={{ maxWidth: "200px" }} title={name}>
                                {name}
                              </span>
                            </div>
                          </td>
                          
                          {/* Cột Đơn giá */}
                          <td className="fw-bold text-secondary">
                            {price.toLocaleString("vi-VN")} đ
                          </td>
                          
                          {/* Cột Số lượng */}
                          <td>
                            <div className="input-group mx-auto" style={{ width: "110px" }}>
                              <button
                                className="btn btn-outline-secondary px-2"
                                onClick={() => handleQuantityChange(id, qty - 1)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className="form-control text-center fw-bold px-1"
                                value={qty}
                                readOnly
                              />
                              <button
                                className="btn btn-outline-secondary px-2"
                                onClick={() => handleQuantityChange(id, qty + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          
                          {/* Cột Tổng tiền */}
                          <td className="fw-bold text-danger text-end">
                            {(price * qty).toLocaleString("vi-VN")} đ
                          </td>
                          
                          {/* Cột Hành động */}
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-light text-danger rounded-circle"
                              onClick={() => handleRemoveItem(id)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="text-end mt-4 border-top pt-3">
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                    onClick={handleClearCart}
                  >
                    <i className="bi bi-trash me-1"></i> Xóa toàn bộ giỏ hàng
                  </button>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: "90px" }}>
                <h5 className="fw-bold mb-4 border-bottom pb-3">Tóm tắt đơn hàng</h5>

                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Tổng sản phẩm:</span>
                  <span className="fw-bold text-dark">{cartItems.length} mục</span>
                </div>

                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Tổng số lượng:</span>
                  <span className="fw-bold text-dark">
                    {cartItems.reduce((sum, item) => sum + Number(item.soLuong || item.quantity || 1), 0)} cái
                  </span>
                </div>

                <hr className="my-4" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold">Thành tiền:</span>
                  <span className="fs-4 fw-bold text-danger">
                    {calculateTotal().toLocaleString("vi-VN")} đ
                  </span>
                </div>

                <button className="btn btn-danger btn-lg w-100 mb-3 rounded-pill fw-bold">
                  <i className="bi bi-credit-card me-2"></i>
                  TIẾN HÀNH THANH TOÁN
                </button>

                <Link to="/sanpham" className="btn btn-outline-primary w-100 rounded-pill fw-bold">
                  <i className="bi bi-arrow-left me-2"></i>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-5 rounded-4 shadow-sm">
            <i className="bi bi-cart-x text-secondary" style={{ fontSize: "5rem", opacity: 0.5 }}></i>
            <h4 className="mt-4 text-dark fw-bold">Giỏ hàng của bạn đang trống</h4>
            <p className="text-muted mb-4">Bạn chưa chọn sản phẩm nào để mua cả.</p>
            <Link to="/sanpham" className="btn btn-primary btn-lg rounded-pill px-5">
              <i className="bi bi-shop me-2"></i>
              Bắt đầu mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}