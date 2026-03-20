import { useState, useEffect } from "react";

export default function DepartmentUpDel({ show, onClose, onSubmit, editingDepartment = null }) {
  const [formData, setFormData] = useState(
    editingDepartment
      ? { maPhongBan: editingDepartment.maPhongBan, tenPhongBan: editingDepartment.tenPhongBan, soLuongNV: editingDepartment.soLuongNV }
      : { maPhongBan: "", tenPhongBan: "", soLuongNV: 0 }
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cập nhật formData và preview khi editingDepartment thay đổi
  useEffect(() => {
    if (editingDepartment && show) {
      setFormData({
        maPhongBan: editingDepartment.maPhongBan,
        tenPhongBan: editingDepartment.tenPhongBan,
        soLuongNV: editingDepartment.soLuongNV,
      });
      
      
    } else if (show && !editingDepartment) {
      // Mode thêm mới
      const generateId = () => {
        return "PB" + Date.now().toString().slice(-8);
      };
      setFormData({
        maPhongBan: generateId(),
        tenPhongBan: "",
        soLuongNV: 0,
      });
      setImagePreview(null);
    }
  }, [show, editingDepartment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ maPhongBan: "", tenPhongBan: "", soLuongNV: 0 });
      setImagePreview(null);
      onClose();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {editingDepartment ? "Sửa Phòng Ban" : "Thêm Phòng Ban Mới"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Mã Brand */}
              <div className="mb-3">
                <label htmlFor="maPhongBan" className="form-label">
                  Mã Phòng Ban {!editingDepartment && <span className="text-muted">(Tự động)</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maPhongBan"
                  name="maPhongBan"
                  value={formData.maPhongBan}
                  onChange={handleInputChange}
                  placeholder="Mã phòng ban sẽ được tự động tạo"
                  disabled={editingDepartment || loading}
                  required
                />
                {!editingDepartment && (
                  <small className="text-muted">Mã phòng ban sẽ được tự động tạo nếu để trống</small>
                )}
              </div>

              {/* Tên Phòng Ban */}
              <div className="mb-3">
                <label htmlFor="tenPhongBan" className="form-label">
                  Tên Phòng Ban *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tenPhongBan"
                  name="tenPhongBan"
                  value={formData.tenPhongBan}
                  onChange={handleInputChange}
                  placeholder="Nhập tên phòng ban"
                  required
                  disabled={loading}
                />
              </div>

              {/* Số Lượng Nhân Viên */}
              <div className="mb-3">
                <label htmlFor="soLuongNV" className="form-label">
                  Số Lượng Nhân Viên *
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="soLuongNV"
                    name="soLuongNV"
                    value={formData.soLuongNV}
                    onChange={handleInputChange}
                    placeholder="Nhập số lượng nhân viên"
                    required            
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Đóng
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang xử lý...
                  </>
                ) : editingDepartment ? (
                  "Cập Nhật"
                ) : (
                  "Thêm Mới"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
