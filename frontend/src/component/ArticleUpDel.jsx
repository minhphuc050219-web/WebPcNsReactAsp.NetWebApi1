import { useState, useEffect } from "react";
import { getArticleCategory } from "../api/articleCategoryAPI";
import { BASE_URL } from "../api";

export default function ArticleUpDel({ show, onClose, onSubmit, editingArticle = null }) {
  const [formData, setFormData] = useState(
    editingArticle
      ? {
          maBV: editingArticle.maBV,
          tenBV: editingArticle.tenBV || "",
          tomTatBV: editingArticle.tomTatBV || "",
          noiDungBV: editingArticle.noiDungBV || "",
          maLoaiBV: editingArticle.maLoaiBV || "",
          trangThaiBV: editingArticle.trangThaiBV !== undefined ? editingArticle.trangThaiBV : true,
          bvImages: null,
        }
      : {
          maBV: "",
          tenBV: "",
          tomTatBV: "",
          noiDungBV: "",
          maLoaiBV: "",
          trangThaiBV: true,
          bvImages: null,
        }
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [articlecategories, setArticleCategories] = useState([]);

  // Cập nhật formData và preview khi editingArticle thay đổi
  useEffect(() => {
    if (editingArticle && show) {
      setFormData({
        maBV: editingArticle.maBV,
        tenBV: editingArticle.tenBV || "",
        tomTatBV: editingArticle.tomTatBV || "",
        noiDungBV: editingArticle.noiDungBV || "",
        maLoaiBV: editingArticle.maLoaiBV || "",
        trangThaiBV: editingArticle.trangThaiBV !== undefined ? editingArticle.trangThaiBV : true,
        bvImages: null,
      });
      // Lấy preview ảnh từ backend URL
      if (editingArticle.bvImages) {
        setImagePreview(`${BASE_URL}/public/imagesArticle/${editingArticle.bvImages}`);
      } else {
        setImagePreview(null);
      }
    } else if (show && !editingArticle) {
      // Mode thêm mới
      const generateId = () => {
        return "BV" + Date.now().toString().slice(-8);
      };
      setFormData({
        maBV: generateId(),
        tenBV: "",
        tomTatBV: "",
        noiDungBV: "",
        maLoaiBV: "",
        trangThaiBV: true,
        bvImages: null,
      });
      setImagePreview(null);
    }
  }, [show, editingArticle]);

  // Load articleCategories khi component mount
  useEffect(() => {
    getArticleCategory()
      .then(setArticleCategories)
      .catch((error) => console.error("Failed to load article categories:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

      setFormData({ ...formData, bvImages: file });
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
      setFormData({
        maBV: "",
        tenBV: "",
        tomTatBV: "",
        noiDungBV: "",
        maLoaiBV: "",
        trangThaiBV: true,
        bvImages: null,
      });
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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {editingArticle ? "Sửa Bài Viết" : "Thêm Bài Viết Mới"}
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
              {/* Mã Sản Phẩm */}
              <div className="mb-3">
                <label htmlFor="maBV" className="form-label">
                  Mã Bài Viết {!editingArticle && <span className="text-muted">(Tự động)</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maBV"
                  name="maBV"
                  value={formData.maBV}
                  onChange={handleInputChange}
                  placeholder="Mã bài viết sẽ được tự động tạo"
                  disabled={editingArticle || loading}
                  required
                />
              </div>

              {/* Tên Sản Phẩm */}
              <div className="mb-3">
                <label htmlFor="tenBV" className="form-label">
                  Tên Bài Viết *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tenBV"
                  name="tenBV"
                  value={formData.tenBV}
                  onChange={handleInputChange}
                  placeholder="Nhập tên bài viết"
                  required
                  disabled={loading}
                />
              </div>

              {/* Tóm Tắt Nội Dung */}
              <div className="mb-3">
                <label htmlFor="tomTatBV" className="form-label">
                  Tóm Tắt Nội Dung
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tomTatBV"
                  name="tomTatBV"
                  value={formData.tomTatBV}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả ngắn"
                  disabled={loading}
                />
              </div>

              {/* Nội Dung */}
              <div className="mb-3">
                <label htmlFor="noiDungBV" className="form-label">
                  Nội Dung
                </label>
                <textarea
                  className="form-control"
                  id="noiDungBV"
                  name="noiDungBV"
                  value={formData.noiDungBV}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung"
                  rows="3"
                  disabled={loading}
                ></textarea>
              </div>

              {/* Mã Loại Bài Viết */}
              <div className="mb-3">
                <label htmlFor="maLoaiBV" className="form-label">
                  Loại Bài Viết
                </label>
                <select
                  className="form-control"
                  id="maLoaiBV"
                  name="maLoaiBV"
                  value={formData.maLoaiBV}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">-- Chọn loại bài viết --</option>
                  {articlecategories.map((cat) => (
                    <option key={cat.maLoaiBV} value={cat.maLoaiBV}>
                      {cat.tenLoaiBV}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trạng Thái Bài Viết */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="trangThaiBV"
                  name="trangThaiBV"
                  checked={formData.trangThaiBV}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <label className="form-check-label" htmlFor="trangThaiBV">
                  Bài viết hoạt động
                </label>
              </div>
              

              {/* Hình Ảnh */}
              <div className="mb-3">
                <label htmlFor="bvImages" className="form-label">
                  Hình Ảnh Bài Viết
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="bvImages"
                  name="bvImages"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <small className="text-muted">Độ phân giải tối đa 5MB, định dạng JPG, PNG, GIF, WebP</small>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3">
                  <label className="form-label">Xem trước ảnh</label>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "5px" }}
                  />
                </div>
              )}
              
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : editingArticle ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
