import { useState, useEffect } from "react";

export default function SalaryUpDel({ show, onClose, onSubmit, editing = null }) {
  const [formData, setFormData] = useState({
    maNV: "",
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear(),
    luongCoBan: 0,
    phuCap: 0,
    thuong: 0,
    soNgayCong: 0,
    tongLuong: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing && show) {
      setFormData({
        maNV: editing.maNV || "",
        thang: editing.thang || new Date().getMonth() + 1,
        nam: editing.nam || new Date().getFullYear(),
        luongCoBan: editing.luongCoBan || 0,
        phuCap: editing.phuCap || 0,
        thuong: editing.thuong || 0,
        soNgayCong: editing.soNgayCong || 0,
        tongLuong: editing.tongLuong || 0,
      });
    } else if (show && !editing) {
      setFormData({
        maNV: "",
        thang: new Date().getMonth() + 1,
        nam: new Date().getFullYear(),
        luongCoBan: 0,
        phuCap: 0,
        thuong: 0,
        soNgayCong: 0,
        tongLuong: 0,
      });
    }
  }, [show, editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  useEffect(() => {
    // Recalculate tongLuong when parts change
    const base = parseFloat(formData.luongCoBan) || 0;
    const phu = parseFloat(formData.phuCap) || 0;
    const thu = parseFloat(formData.thuong) || 0;
    const tong = base + phu + thu;
    setFormData((s) => ({ ...s, tongLuong: tong }));
  }, [formData.luongCoBan, formData.phuCap, formData.thuong]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert(err.message || "Lỗi khi lưu");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">{editing ? "Sửa Lương" : "Thêm Lương"}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Mã Nhân Viên *</label>
                <input name="maNV" value={formData.maNV} onChange={handleChange} className="form-control" required />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tháng</label>
                  <input type="number" name="thang" value={formData.thang} onChange={handleChange} className="form-control" min="1" max="12" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Năm</label>
                  <input type="number" name="nam" value={formData.nam} onChange={handleChange} className="form-control" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Lương Cơ Bản</label>
                <input type="number" step="0.01" name="luongCoBan" value={formData.luongCoBan} onChange={handleChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Phụ Cấp</label>
                <input type="number" step="0.01" name="phuCap" value={formData.phuCap} onChange={handleChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Thưởng</label>
                <input type="number" step="0.01" name="thuong" value={formData.thuong} onChange={handleChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Số Ngày Công</label>
                <input type="number" name="soNgayCong" value={formData.soNgayCong} onChange={handleChange} className="form-control" />
              </div>

              <div className="mb-3">
                <label className="form-label">Tổng Lương</label>
                <input type="number" step="0.01" name="tongLuong" value={formData.tongLuong} className="form-control" readOnly />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Hủy</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{editing ? "Lưu" : "Tạo"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
