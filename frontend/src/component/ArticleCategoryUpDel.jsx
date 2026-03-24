import { useState, useEffect } from "react";

export default function ArticleCategoryUpDel({ show, onClose, onSubmit, editingArticleCategory = null }) {
  const [formData, setFormData] = useState(
    editingArticleCategory
      ? { maLoaiBV: editingArticleCategory.maLoaiBV, tenLoaiBV: editingArticleCategory.tenLoaiBV, thuTuBV: editingArticleCategory.thuTuBV }
      : { maLoaiBV: "", tenLoaiBV: "", thuTuBV: 0 }
  );

  const [loading, setLoading] = useState(false);

  // Cập nhật formData và preview khi editingArticleCategory thay đổi
  useEffect(() => {
    if (editingArticleCategory && show) {
      setFormData({
        maLoaiBV: editingArticleCategory.maLoaiBV,
        tenLoaiBV: editingArticleCategory.tenLoaiBV,
        thuTuBV: editingArticleCategory.thuTuBV,
      });
      
      
    } else if (show && !editingArticleCategory) {
      // Mode thêm mới
      const generateId = () => {
        return "LBV" + Date.now().toString().slice(-8);
      };
      setFormData({
        maLoaiBV: generateId(),
        tenLoaiBV: "",
        thuTuBV: 0,
      });
    }
  }, [show, editingArticleCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ maLoaiBV: "", tenLoaiBV: "", thuTuBV: 0 });
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
              {editingArticleCategory ? "Sửa Loại Bài Viết" : "Thêm Loại Bài Viết Mới"}
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
                <label htmlFor="maLoaiBV" className="form-label">
                  Mã Loại Bài Viết {!editingArticleCategory && <span className="text-muted">(Tự động)</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maLoaiBV"
                  name="maLoaiBV"
                  value={formData.maLoaiBV}
                  onChange={handleInputChange}
                  placeholder="Mã loại bài viết sẽ được tự động tạo"
                  disabled={editingArticleCategory || loading}
                  required
                />
                {!editingArticleCategory && (
                  <small className="text-muted">Mã loại bài viết sẽ được tự động tạo nếu để trống</small>
                )}
              </div>

              {/* Tên Loại Bài Viết */}
              <div className="mb-3">
                <label htmlFor="tenLoaiBV" className="form-label">
                  Tên Loại Bài Viết *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tenLoaiBV"
                  name="tenLoaiBV"
                  value={formData.tenLoaiBV}
                  onChange={handleInputChange}
                  placeholder="Nhập tên loại bài viết"
                  required
                  disabled={loading}
                />
              </div>

              {/* Thứ Tự Bài Viết */}
              <div className="mb-3">
                <label htmlFor="thuTuBV" className="form-label">
                  Thứ Tự Bài Viết *
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="thuTuBV"
                    name="thuTuBV"
                    value={formData.thuTuBV}
                    onChange={handleInputChange}
                    placeholder="Nhập thứ tự bài viết"
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
                ) : editingArticleCategory ? (
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
