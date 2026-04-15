import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrderById } from "../api/orderAPI";
import { BASE_URL } from "../api";
import { getProduct } from "../api/productAPI";

export default function OrderDetail() {
  const { id } = useParams();
  const { auth } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(id);
        setOrder(orderData);

        // Load sản phẩm details
        const productPromises = orderData.OrderDetailIds?.map(async (detail) => {
          const product = await getProduct();
          return product.find(p => p.maSanPham === detail.MaSanPham);
        }) || [];

        const productData = await Promise.all(productPromises);
        setProducts(productData.filter(p => p));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Không tìm thấy đơn hàng hoặc lỗi tải dữ liệu
        </div>
        <Link to="/orders" className="btn btn-primary">← Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Chi tiết đơn hàng #{order.MaDonHang}
              </h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <strong>Ngày đặt:</strong> {new Date(order.NgayDat).toLocaleString("vi-VN")}
                </div>
                <div className="col-md-6">
                  <strong>Phương thức:</strong> {order.PhuongThucThanhToan}
                </div>
                <div className="col-md-6">
                  <strong>Trạng thái:</strong> 
                  <span className={`badge ms-2 ${order.TrangThai === "Đã thanh toán" ? "bg-success" : "bg-warning"}`}>
                    {order.TrangThai}
                  </span>
                </div>
                {order.VnpTransactionNo && (
                  <div className="col-md-6">
                    <strong>Mã VNPAY:</strong> {order.VnpTransactionNo}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Sản phẩm trong đơn ({order.OrderDetailIds?.length || 0})
              </h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.OrderDetailIds?.map((detail, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src="/images/placeholder.png" 
                            alt="product"
                            style={{ width: "50px", height: "50px", objectFit: "contain" }}
                            className="rounded border"
                          />
                          <span>{detail.MaSanPham}</span>
                        </div>
                      </td>
                      <td>{detail.DonGia?.toLocaleString("vi-VN")} đ</td>
                      <td>{detail.SoLuong}</td>
                      <td className="text-danger fw-bold">
                        {detail.ThanhTien?.toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Tổng thanh toán</h5>
            </div>
            <div className="card-body text-center p-4">
              <h2 className="text-danger fw-bold mb-3">
                {order.TongTien.toLocaleString("vi-VN")} đ
              </h2>
              <div className="d-grid gap-2">
                <button className="btn btn-success btn-lg">
                  <i className="bi bi-telephone me-2"></i>
                  Liên hệ giao hàng
                </button>
                <Link to="/orders" className="btn btn-outline-primary">
                  ← Danh sách đơn hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

