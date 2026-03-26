import { API_URL } from "../apiImages";
import { useState, useEffect } from "react";

export default function BrandUpDel({ show, onClose, onSubmit, editingBrand = null }) {
  const [formData, setFormData] = useState(
    editingBrand
      ? { maBrand: editingBrand.maBrand, tenBrand: editingBrand.tenBrand, brandImages: null }
      : { maBrand: "", tenBrand: "", brandImages: null }
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cập nhật formData và preview khi editingBrand thay đổi
  useEffect(() => {
    if (editingBrand && show) {
      setFormData({
        maBrand: editingBrand.maBrand,
        tenBrand: editingBrand.tenBrand,
        brandImages: null,
      });
      // Lấy preview ảnh từ backend URL
      if (editingBrand.brandImages) {
        setImagePreview(`${API_URL}/public/imagesBrand/${editingBrand.brandImages}`);
      } else {
        setImagePreview(null);
      }
    } else if (show && !editingBrand) {
      // Mode thêm mới
      const generateId = () => {
        return "BR" + Date.now().toString().slice(-8);
      };
      setFormData({
        maBrand: generateId(),
        tenBrand: "",
        brandImages: null,
      });
      setImagePreview(null);
    }
  }, [show, editingBrand]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

      setFormData({ ...formData, brandImages: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ maBrand: "", tenBrand: "", brandImages: null });
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
              {editingBrand ? "Sửa Thương Hiệu" : "Thêm Thương Hiệu Mới"}
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
                <label htmlFor="maBrand" className="form-label">
                  Mã Brand {!editingBrand && <span className="text-muted">(Tự động)</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maBrand"
                  name="maBrand"
                  value={formData.maBrand}
                  onChange={handleInputChange}
                  placeholder="Mã brand sẽ được tự động tạo"
                  disabled={editingBrand || loading}
                  required
                />
                {!editingBrand && (
                  <small className="text-muted">Mã brand sẽ được tự động tạo nếu để trống</small>
                )}
              </div>

              {/* Tên Brand */}
              <div className="mb-3">
                <label htmlFor="tenBrand" className="form-label">
                  Tên Thương Hiệu *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tenBrand"
                  name="tenBrand"
                  value={formData.tenBrand}
                  onChange={handleInputChange}
                  placeholder="Nhập tên thương hiệu"
                  required
                  disabled={loading}
                />
              </div>

              {/* Hình Ảnh */}
              <div className="mb-3">
                <label htmlFor="brandImages" className="form-label">
                  Hình Ảnh
                </label>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="brandImages"
                    name="brandImages"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={loading}
                  />
                </div>
                <small className="text-muted d-block mt-1">
                  Định dạng: JPG, PNG, GIF, WebP (Max 5MB)
                </small>

                {/* Preview Ảnh */}
                {imagePreview && (
                  <div className="mt-3">
                    <div className="border rounded p-2" style={{ textAlign: "center" }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          borderRadius: "4px",
                        }}
                      />
                      <p className="mt-2 mb-0 text-muted small">
                        {formData.brandImages?.name || "Ảnh đã chọn"}
                      </p>
                    </div>
                  </div>
                )}
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
                ) : editingBrand ? (
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
