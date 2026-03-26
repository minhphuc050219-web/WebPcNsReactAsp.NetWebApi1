import { useState, useEffect } from "react";
import { getBrand } from "../api/brandAPI";
import { BASE_URL } from "../api";

export default function CategoryUpDel({ show, onClose, onSubmit, editingCategory = null }) {
  const [formData, setFormData] = useState(
    editingCategory
      ? { maLoai: editingCategory.maLoai, tenLoai: editingCategory.tenLoai, maBrand: editingCategory.maBrand || "", loaiImages: null }
      : { maLoai: "", tenLoai: "", maBrand: "", loaiImages: null }
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  // Cập nhật formData và preview khi editingCategory thay đổi
  useEffect(() => {
    if (editingCategory && show) {
      setFormData({
        maLoai: editingCategory.maLoai,
        tenLoai: editingCategory.tenLoai,
        maBrand: editingCategory.maBrand || "",
        loaiImages: null,
      });
      // Lấy preview ảnh từ backend URL
      if (editingCategory.loaiImages) {
        setImagePreview(`${BASE_URL}/public/imagesCategory/${editingCategory.loaiImages}`);
      } else {
        setImagePreview(null);
      }
    } else if (show && !editingCategory) {
      // Mode thêm mới
      const generateId = () => {
        return "CAT" + Date.now().toString().slice(-8);
      };
      setFormData({
        maLoai: generateId(),
        tenLoai: "",
        maBrand: "",
        loaiImages: null,
      });
      setImagePreview(null);
    }
  }, [show, editingCategory]);

  // Load brands khi component mount
  useEffect(() => {
    getBrand()
      .then(setBrands)
      .catch((error) => console.error("Failed to load brands:", error));
  }, []);

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

      setFormData({ ...formData, loaiImages: file });
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
      setFormData({ maLoai: "", tenLoai: "", maBrand: "", loaiImages: null });
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
              {editingCategory ? "Sửa Loại Sản Phẩm" : "Thêm Loại Sản Phẩm Mới"}
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
              {/* Mã Loại */}
              <div className="mb-3">
                <label htmlFor="maLoai" className="form-label">
                  Mã Loại {!editingCategory && <span className="text-muted">(Tự động)</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maLoai"
                  name="maLoai"
                  value={formData.maLoai}
                  onChange={handleInputChange}
                  placeholder="Mã loại sẽ được tự động tạo"
                  disabled={editingCategory || loading}
                  required
                />
                {!editingCategory && (
                  <small className="text-muted">Mã loại sẽ được tự động tạo nếu để trống</small>
                )}
              </div>

              {/* Tên Loại */}
              <div className="mb-3">
                <label htmlFor="tenLoai" className="form-label">
                  Tên Loại Sản Phẩm *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tenLoai"
                  name="tenLoai"
                  value={formData.tenLoai}
                  onChange={handleInputChange}
                  placeholder="Nhập tên loại sản phẩm"
                  required
                  disabled={loading}
                />
              </div>

              {/* Thương Hiệu */}
              <div className="mb-3">
                <label htmlFor="maBrand" className="form-label">
                  Thương Hiệu
                </label>
                <select
                  className="form-control"
                  id="maBrand"
                  name="maBrand"
                  value={formData.maBrand}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Chọn thương hiệu (tùy chọn)</option>
                  {brands.map((brand) => (
                    <option key={brand.maBrand} value={brand.maBrand}>
                      {brand.tenBrand}
                    </option>
                  ))}
                </select>
                <small className="text-muted">Liên kết với thương hiệu (có thể để trống)</small>
              </div>

              {/* Hình Ảnh */}
              <div className="mb-3">
                <label htmlFor="loaiImages" className="form-label">
                  Hình Ảnh
                </label>
                <div className="input-group">
                  <input
                    type="file"
                    className="form-control"
                    id="loaiImages"
                    name="loaiImages"
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
                        {formData.loaiImages?.name || "Ảnh đã chọn"}
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
                ) : editingCategory ? (
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