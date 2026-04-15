import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../api/orderAPI";

export default function OrderHistory() {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders(auth.id || auth.username);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth]);

  const getStatusBadge = (status) => {
    const badges = {
      "Chờ xác nhận": "bg-warning",
      "Đã thanh toán": "bg-info",
      "Đã giao": "bg-success", 
      "Hủy": "bg-danger"
    };
    return badges[status] || "bg-secondary";
  };

  if (!auth) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <i className="bi bi-box-arrow-in-right fs-1 mb-3"></i>
          <h4>Vui lòng đăng nhập để xem đơn hàng</h4>
          <Link to="/login" className="btn btn-primary mt-3">Đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">
              <i className="bi bi-receipt me-2 text-primary"></i>
              Lịch sử mua hàng
            </h2>
            <span className="badge bg-primary fs-6">{orders.length} đơn hàng</span>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3">Đang tải đơn hàng...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              Lỗi: {error}
              <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => window.location.reload()}>
                Thử lại
              </button>
            </div>
          )}

          {orders.length === 0 && !loading && (
            <div className="text-center py-5">
              <i className="bi bi-receipt-cutoff fs-1 text-muted mb-3"></i>
              <h5>Bạn chưa có đơn hàng nào</h5>
              <Link to="/sanpham" className="btn btn-primary">
                Mua sắm ngay
              </Link>
            </div>
          )}

          {orders.map((order) => (
            <div key={order.MaDonHang} className="card shadow-sm mb-4 hover-card">
              <div className="card-header bg-light d-flex justify-content-between align-items-start">
                <div>
                  <strong>Đơn hàng #{order.MaDonHang}</strong>
                  <br />
                  <small className="text-muted">
                    {new Date(order.NgayDat).toLocaleDateString("vi-VN")}
                  </small>
                </div>
                <span className={`badge ${getStatusBadge(order.TrangThai)}`}>
                  {order.TrangThai}
                </span>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <h6>Sản phẩm ({order.SoSanPham})</h6>
                    <div className="mb-3">
                      <span className="badge bg-secondary me-2">{order.SanPhamDau}</span>
                      <small className="text-muted">+{order.SoSanPham - 1} sản phẩm khác</small>
                    </div>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <h5 className="text-danger fw-bold">
                      {order.TongTien.toLocaleString("vi-VN")}đ
                    </h5>
                    {order.VnpTransactionNo && (
                      <small className="text-muted">VNPAY: {order.VnpTransactionNo}</small>
                    )}
                  </div>
                </div>
                <hr />
                <div className="d-flex gap-2">
                  <Link to={`/orders/${order.MaDonHang}`} className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-eye me-1"></i>Xem chi tiết
                  </Link>
                  {order.TrangThai === "Chờ xác nhận" && (
                    <button className="btn btn-outline-danger btn-sm">
                      <i className="bi bi-x-circle me-1"></i>Hủy đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}

