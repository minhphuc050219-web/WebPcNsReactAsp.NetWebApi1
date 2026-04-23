import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

export default function GioHang() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const { auth } = useAuth();
  const navigate = useNavigate();

  const fetchCartFromDB = async () => {
    if (!auth?.id) {
      alert("Vui lòng đăng nhập để xem giỏ hàng!");
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      // Gọi API lấy giỏ hàng của user hiện tại
      const response = await axios.get(`${BASE_URL}/api/Cart/get-cart/${auth.id}`);
      
      console.log("Dữ liệu nhận được:", response.data);
      
      if (Array.isArray(response.data)) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartFromDB();
  }, []);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/images/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath;
    return `${BASE_URL}/public/imagesProduct/${imgPath}`;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (Number(item.donGia) * Number(item.soLuong)), 0);
  };

  const updateQuantity = async (maSanPham, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.post(`${BASE_URL}/api/Cart/update-quantity`, { 
        maSanPham, 
        MaKhachHang: auth.id,
        soLuong: newQuantity
      });
      fetchCartFromDB(); // Refresh
    } catch (error) {
      alert("Lỗi cập nhật số lượng!");
    }
  };

  // Nút thanh toán VNPAY
  const handlePaymentVNPAY = async () => {
    if (cartItems.length === 0) return;
    setIsProcessing(true);
    try {
      const orderData = {
        Amount: calculateTotal(),
        OrderInfo: "Thanh toan don hang PC SHOP",
        MaKhachHang: auth.id  // Thêm ID khách hàng để backend tạo order
      };
      const res = await axios.post(`${BASE_URL}/api/Payment/create-payment-url`, orderData);
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      alert("Lỗi thanh toán!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="text-center py-5">Đang tải giỏ hàng...</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">GIỎ HÀNG CỦA BẠN</h2>

      {cartItems.length > 0 ? (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm p-3">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th className="text-end">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                  <tr key={item.maSanPham}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img src={getImageUrl(item.hinhAnh)} width="50" className="me-3 border rounded" alt="" />
                          <span className="fw-bold">{item.tenSanPham}</span>
                        </div>
                      </td>
                      <td>{Number(item.donGia).toLocaleString()} đ</td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.maSanPham, item.soLuong - 1)}>-</button>
                          <span className="mx-2">{item.soLuong}</span>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.maSanPham, item.soLuong + 1)}>+</button>
                        </div>
                      </td>
                      <td className="text-end fw-bold text-danger">
                        {(item.donGia * item.soLuong).toLocaleString()} đ
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.maSanPham)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold mb-3">Tạm tính</h5>
              <div className="d-flex justify-content-between mb-4">
                <span>Tổng tiền:</span>
                <span className="h4 fw-bold text-danger">{calculateTotal().toLocaleString()} đ</span>
              </div>
              <button className="btn btn-primary w-100 mb-2 py-3 fw-bold" onClick={handlePaymentVNPAY} disabled={isProcessing}>
                {isProcessing ? "Đang chuyển hướng..." : "THANH TOÁN VNPAY"}
              </button>
              <Link to="/sanpham" className="btn btn-outline-secondary w-100">Tiếp tục mua hàng</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5 border rounded bg-white">
          <i className="bi bi-cart-x fs-1 text-muted"></i>
          <h4 className="mt-3">Giỏ hàng trống trơn sếp ơi!</h4>
          <p className="text-muted">Kiểm tra lại xem ID khách hàng trong DB có phải là 1 chưa?</p>
          <Link to="/sanpham" className="btn btn-primary px-5">ĐI MUA SẮM NGAY</Link>
        </div>
      )}
    </div>
  );
}