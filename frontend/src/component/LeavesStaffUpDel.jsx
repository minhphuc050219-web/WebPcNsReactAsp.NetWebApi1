import { useEffect, useState } from "react";
import { BASE_URL } from "../api";

export default function LeavesStaffUpDel({ show, onClose, onSubmit, editingLeave = null }) {
  const specialReasonOptions = [
    "Nghỉ phép năm (theo Điều 113 Bộ luật Lao động 2019)",
    "Nghỉ không hưởng lương",
    "Nghỉ do hoàn cảnh đặc biệt",
    "Nghỉ do sức khỏe hoặc thai sản",
    "Other special",
  ];

  const normalReasonOptions = [
    "Nghỉ bệnh",
    "Nghỉ giải quyết công việc",
    "Nghỉ khám sức khỏe hoặc chăm sóc bản thân",
    "Di chuyển hoặc giải quyết công việc hành chính",
    "Other",
  ];

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    typeLV: "",
    ngayBD: "",
    ngayKT: "",
    reason: "",
    otherReason: "",
    customReason: "",
    imagesLV: null,
  });

  useEffect(() => {
    if (!show) return;

    if (editingLeave) {
      setFormData({
        typeLV: editingLeave.typeLV || "",
        ngayBD: editingLeave.ngayBD || "",
        ngayKT: editingLeave.ngayKT || "",
        reason:
          editingLeave.typeLV === "Loại đơn khác"
            ? ""
            : (normalReasonOptions.includes(editingLeave.lyDo || "") ? editingLeave.lyDo : ""),
        otherReason:
          editingLeave.typeLV === "Loại đơn khác"
            ? (specialReasonOptions.includes(editingLeave.lyDo || "") ? editingLeave.lyDo : "Other special")
            : "",
        customReason:
          editingLeave.typeLV === "Loại đơn khác" && !specialReasonOptions.includes(editingLeave.lyDo || "")
            ? (editingLeave.lyDo || "")
            : "",
        imagesLV: null,
      });
      setImagePreview(
        editingLeave.imagesLV ? `${BASE_URL}/public/imagesLeaves/${editingLeave.imagesLV}` : null,
      );
    } else {
      setFormData({
        typeLV: "",
        ngayBD: "",
        ngayKT: "",
        reason: "",
        otherReason: "",
        customReason: "",
        imagesLV: null,
      });
      setImagePreview(null);
    }
  }, [show, editingLeave]);

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      typeLV: value,
      reason: "",
      otherReason: "",
      customReason: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh tối đa 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, imagesLV: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.typeLV || !formData.ngayBD || !formData.ngayKT) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      if (
        formData.typeLV === "Loại đơn khác"
        && (!formData.otherReason || (formData.otherReason === "Other special" && !formData.customReason.trim()))
      ) {
        throw new Error("Vui lòng chọn lý do nghỉ đặc biệt và nhập lý do chi tiết nếu cần");
      }

      if (formData.typeLV !== "Loại đơn khác" && !formData.reason) {
        throw new Error("Vui lòng chọn lý do nghỉ");
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(formData.ngayBD);
      const end = new Date(formData.ngayKT);

      if (start > end) {
        throw new Error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
      }

      const minStartDate = new Date(today);
      minStartDate.setDate(minStartDate.getDate() + 10);
      if (start < minStartDate) {
        throw new Error("Ngày bắt đầu nghỉ phải cách ngày viết đơn ít nhất 10 ngày");
      }

      const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (formData.typeLV === "Loại theo quy định" && daysDiff > 12) {
        throw new Error("Loại theo quy định chỉ được nghỉ tối đa 12 ngày");
      }

      if (formData.typeLV === "Loại đơn khác" && daysDiff < 13) {
        throw new Error("Loại đơn khác phải nghỉ tối thiểu 13 ngày");
      }

      const computedReason =
        formData.typeLV === "Loại đơn khác"
          ? (formData.otherReason === "Other special" ? formData.customReason.trim() : formData.otherReason)
          : formData.reason;

      const computedStatus = formData.typeLV === "Loại đơn khác" ? "Chờ duyệt" : "Đã duyệt";

      await onSubmit({
        ...formData,
        lyDo: computedReason,
        trangThai: computedStatus,
      });
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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">{editingLeave ? "Sửa đơn xin nghỉ" : "Tạo đơn xin nghỉ"}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={loading}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Loại nghỉ *</label>
                <select
                  className="form-select"
                  name="typeLV"
                  value={formData.typeLV}
                  onChange={handleTypeChange}
                  disabled={loading}
                  required
                >
                  <option value="Loại theo quy định">Loại theo quy định</option>
                  <option value="Loại đơn khác">Loại đơn khác</option>
                </select>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="ngayBD"
                    value={formData.ngayBD}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Ngày kết thúc *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="ngayKT"
                    value={formData.ngayKT}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {formData.typeLV === "Loại đơn khác" ? (
                <>
                  <div className="mb-3 mt-3">
                    <label className="form-label">Lý do nghỉ đặc biệt *</label>
                    <select
                      className="form-select"
                      name="otherReason"
                      value={formData.otherReason}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      <option value="Nghỉ phép năm (theo Điều 113 Bộ luật Lao động 2019)">
                        Nghỉ phép năm (theo Điều 113 Bộ luật Lao động 2019)
                      </option>
                      <option value="Nghỉ không hưởng lương">Nghỉ không hưởng lương</option>
                      <option value="Nghỉ do hoàn cảnh đặc biệt">Nghỉ do hoàn cảnh đặc biệt</option>
                      <option value="Nghỉ do sức khỏe hoặc thai sản">Nghỉ do sức khỏe hoặc thai sản</option>
                      <option value="Other special">Khác...</option>
                    </select>
                  </div>

                  {formData.otherReason === "Other special" && (
                    <div className="mb-3">
                      <label className="form-label">Lý do khác *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="customReason"
                        value={formData.customReason}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      ></textarea>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-3 mt-3">
                  <label className="form-label">Lý do *</label>
                  <select
                    className="form-select"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  >
                    <option value="Nghỉ bệnh">Nghỉ bệnh</option>
                    <option value="Nghỉ giải quyết công việc">Nghỉ giải quyết công việc</option>
                    <option value="Nghỉ khám sức khỏe hoặc chăm sóc bản thân">Nghỉ khám sức khỏe hoặc chăm sóc bản thân</option>
                    <option value="Di chuyển hoặc giải quyết công việc hành chính">Di chuyển hoặc giải quyết công việc hành chính</option>
                    <option value="Other">Khác...</option>
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Hình minh chứng</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <small className="text-muted">JPG, PNG, GIF, WebP. Tối đa 5MB.</small>
              </div>

              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: 260, objectFit: "contain" }}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={onClose} disabled={loading}>
                Hủy
              </button>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Đang xử lý..." : editingLeave ? "Cập nhật" : "Gửi đơn"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
