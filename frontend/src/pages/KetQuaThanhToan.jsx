import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function KetQuaThanhToan() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    // Đọc mã phản hồi từ thanh địa chỉ do VNPAY trả về
    const responseCode = searchParams.get("vnp_ResponseCode");

    if (responseCode === "00") {
      setStatus("success");
      // 👉 Chỗ này sau này ông có thể clear(xóa) giỏ hàng đi vì mua xong rồi
    } else if (responseCode) {
      setStatus("failed");
    } else {
      setStatus("invalid");
    }
  }, [searchParams]);

  return (
    <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 p-5 mt-5 hover-scale">
            {status === "loading" && (
              <div>
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <h4>Đang đối soát giao dịch...</h4>
              </div>
            )}

            {status === "success" && (
              <div>
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "5rem" }}></i>
                <h2 className="text-success mt-3 fw-bold">Thanh Toán Thành Công!</h2>
                <p className="text-muted">Cảm ơn bạn đã mua hàng tại PHUC TRUONG PC.</p>
                <div className="bg-light p-3 rounded mb-4 text-start">
                  <p className="mb-1"><strong>Mã giao dịch:</strong> {searchParams.get("vnp_TransactionNo")}</p>
                  <p className="mb-1"><strong>Ngân hàng:</strong> {searchParams.get("vnp_BankCode")}</p>
                  <p className="mb-0 text-danger fw-bold"><strong>Số tiền:</strong> {(Number(searchParams.get("vnp_Amount")) / 100).toLocaleString("vi-VN")} đ</p>
                </div>
                <Link to="/sanpham" className="btn btn-primary px-4 rounded-pill">
                  <i className="bi bi-cart-check me-2"></i>Tiếp tục mua sắm
                </Link>
              </div>
            )}

            {status === "failed" && (
              <div>
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "5rem" }}></i>
                <h2 className="text-danger mt-3 fw-bold">Giao Dịch Thất Bại</h2>
                <p className="text-muted">Khách hàng hủy giao dịch hoặc thẻ không đủ tiền.</p>
                <Link to="/giohang" className="btn btn-outline-danger mt-3 px-4 rounded-pill">
                  <i className="bi bi-arrow-left me-2"></i>Quay lại giỏ hàng
                </Link>
              </div>
            )}

            {status === "invalid" && (
              <div>
                <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "5rem" }}></i>
                <h2 className="text-warning mt-3 fw-bold">Dữ liệu không hợp lệ</h2>
                <Link to="/" className="btn btn-outline-secondary mt-3">Về trang chủ</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}