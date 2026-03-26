import React from "react";
import { BASE_URL } from "../api";

export default function StaffDetail({ show, onClose, staff, showClose = true }) {
  if (!show || !staff) return null;

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  const formatMoney = (value) => {
    if (value == null || isNaN(value)) return "0 VNĐ";
    return `${Number(value).toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <div
      className="modal d-block fade show"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 1050,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        animation: "fadeIn 0.3s ease-in-out",
      }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          zIndex: 1055,
          animation: "slideIn 0.4s ease-out",
        }}
      >
        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
          <div
            className="modal-header text-white position-relative"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              animation: "headerSlide 0.5s ease-out",
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-white bg-opacity-25 p-2 me-3 d-flex align-items-center justify-content-center"
                style={{ width: 50, height: 50 }}
              >
                <i className="bi bi-box-seam fs-4 text-white"></i>
              </div>
              <div>
                <h5 className="modal-title mb-1 fw-bold">Chi Tiết Nhân Viên</h5>
                <small className="text-white-75">Mã: {staff.maNV || "N/A"}</small>
              </div>
            </div>
            {showClose && (
              <button
                type="button"
                className="btn-close btn-close-white position-absolute"
                aria-label="Close"
                onClick={handleClose}
                style={{
                  top: 15,
                  right: 15,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            )}
          </div>

          <div className="modal-body p-4 bg-light">
            <div className="row gy-4">
              <div className="col-lg-5">
                <div
                  className="card border-0 shadow-sm bg-white h-100"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    animation: "cardFadeIn 0.6s ease-out 0.2s both",
                  }}
                >
                  <div className="card-body p-0">
                    {staff.nvImages ? (
                      <div className="position-relative">
                        <img
                          src={`${BASE_URL}/public/imagesStaff/${staff.nvImages}`}
                          alt={staff.tenNV || "Nhân viên"}
                          className="img-fluid w-100"
                          style={{
                            maxHeight: 350,
                            objectFit: "cover",
                            transition: "transform 0.3s",
                          }}
                          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                        />
                        <div
                          className="position-absolute top-0 end-0 m-2"
                          style={{
                            background: "rgba(0,0,0,0.7)",
                            borderRadius: "50%",
                            width: 30,
                            height: 30,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="bi bi-zoom-in text-white" style={{ fontSize: "12px" }}></i>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center p-5 text-muted bg-light"
                        style={{ minHeight: 350, borderRadius: "15px 15px 0 0" }}
                      >
                        <div className="text-center">
                          <i className="bi bi-image fs-1 mb-2"></i>
                          <p>Không có hình ảnh</p>
                        </div>
                      </div>
                    )}
                    <div className="p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="badge bg-info text-dark px-3 py-2 rounded-pill fw-semibold"
                          style={{ animation: "badgePulse 2s infinite" }}
                        >
                          <i className="bi bi-box me-1"></i>Giới Tính: {staff.gioiTinh ? "Nam" : "Nữ"}
                        </span>
                        <span
                          className={`badge px-3 py-2 rounded-pill fw-semibold ${staff.role  ? "bg-success" : "bg-danger"}`}
                        >
                          {staff.role ? "Người dùng" : "Admin"}
                        </span>
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <small className="text-muted d-block">Phòng Ban</small>
                          <p className="mb-0 fw-semibold">{staff.maPhongBan || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div
                  className="card border-0 shadow-sm bg-white"
                  style={{
                    borderRadius: "15px",
                    animation: "cardFadeIn 0.6s ease-out 0.4s both",
                  }}
                >
                  <div className="card-body p-4">
                    <h4 className="card-title mb-3 fw-bold text-primary">{staff.tenNV || "Không có tên"}</h4>
                    <div className="mb-4">
                      <span className="fs-3 text-success fw-bold">{formatMoney(staff.luongCoBan)}</span>
                      <small className="text-muted ms-2">VNĐ</small>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded-3 h-100">
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-calendar-event text-primary me-2"></i>
                            <small className="text-muted fw-semibold">Ngày Sinh</small>
                          </div>
                          <p className="mb-0 fw-medium">{staff.ngaySinh || "Chưa cập nhật"}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded-3 h-100">
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-shield-check text-success me-2"></i>
                            <small className="text-muted fw-number">Số điện thoại</small>
                          </div>
                          <p className="mb-0 fw-medium">{staff.sdt || "Chưa cập nhật"}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="p-3 bg-light rounded-3 h-100">
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-tag text-info me-2"></i>
                            <small className="text-muted fw-semibold">Số Căn Cước Công Dân</small>
                          </div>
                          <p className="mb-0 fw-medium">{staff.ccd || "Chưa cập nhật"}</p>
                        </div>
                      </div>
                    </div>

                    {staff.email && (
                      <div className="mb-3">
                        <h6 className="text-primary mb-2">
                          <i className="bi bi-info-circle me-2"></i>Email
                        </h6>
                        <p className="text-secondary mb-0">{staff.email}</p>
                      </div>
                    )}

                    {staff.password && (
                      <div>
                        <h6 className="text-primary mb-2">
                          <i className="bi bi-file-text me-2"></i>Password
                        </h6>
                        <div
                          className="bg-light p-3 rounded-3"
                          style={{ whiteSpace: "pre-wrap", maxHeight: "200px", overflowY: "auto", type: "password" }}
                        >
                          {staff.password}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal-footer border-0 bg-white justify-content-between align-items-center"
            style={{ animation: "footerSlide 0.5s ease-out 0.6s both" }}
          >
            <small className="text-muted">
              <i className="bi bi-hash me-1"></i>Staff ID: {staff.maNV || "-"}
            </small>
            <button
              type="button"
              className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
              onClick={handleClose}
              style={{
                transition: "all 0.3s",
                boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(13, 110, 253, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(13, 110, 253, 0.3)";
              }}
            >
              <i className="bi bi-x-circle me-2"></i>Đóng
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes headerSlide {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes footerSlide {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
