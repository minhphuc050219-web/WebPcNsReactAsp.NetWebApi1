import React from "react";

export default function SalaryDetail({ show, onClose, salary, showClose = true }) {
  if (!show || !salary) return null;

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={handleClose}>
      <div className="modal-dialog modal-dialog-centered modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Chi Tiết Lương</h5>
            {showClose && <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>}
          </div>
          <div className="modal-body">
            <div className="mb-2"><strong>Mã Lương:</strong> {salary.maLuong}</div>
            <div className="mb-2"><strong>Mã NV:</strong> {salary.maNV}</div>
            <div className="mb-2"><strong>Tên NV:</strong> {salary.maNVNavigation?.tenNV || salary.maNV || "-"}</div>
            <div className="mb-2"><strong>Tháng / Năm:</strong> {salary.thang} / {salary.nam}</div>
            <div className="mb-2"><strong>Lương Cơ Bản:</strong> {salary.luongCoBan ?? 0}</div>
            <div className="mb-2"><strong>Phụ Cấp:</strong> {salary.phuCap ?? 0}</div>
            <div className="mb-2"><strong>Thưởng:</strong> {salary.thuong ?? 0}</div>
            <div className="mb-2"><strong>Số Ngày Công:</strong> {salary.soNgayCong ?? 0}</div>
            <div className="mb-2"><strong>Tổng Lương:</strong> {salary.tongLuong ?? 0}</div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
