import { useState, useEffect } from "react";
import { getBrand } from "../api/brandAPI";
import { getCategory } from "../api/categoryAPI";
import { API_URL } from "../apiImages";

export default function ProductUpDel({ show, onClose, onSubmit, editingProduct = null }) {
  const [formData, setFormData] = useState(
    editingProduct
      ? {
          maSanPham: editingProduct.maSanPham,
          tenSanPham: editingProduct.tenSanPham || "",
          soLuong: editingProduct.soLuong || 0,
          donGia: editingProduct.donGia || 0,
          ngayNhap: editingProduct.ngayNhap || "",
          hanBaoHanh: editingProduct.hanBaoHanh || 0,
          shortDescription: editingProduct.shortDescription || "",
          description: editingProduct.description || "",
          tinhTrangSanPham: editingProduct.tinhTrangSanPham !== undefined ? editingProduct.tinhTrangSanPham : true,
          trangThaiSanPham: editingProduct.trangThaiSanPham !== undefined ? editingProduct.trangThaiSanPham : true,
          maLoai: editingProduct.maLoai || "",
          maBrand: editingProduct.maBrand || "",
          hangHoaImages: null,
        }
      : {
          maSanPham: "",
          tenSanPham: "",
          soLuong: 0,
          donGia: 0,
          ngayNhap: "",
          hanBaoHanh: 0,
          shortDescription: "",
          description: "",
          tinhTrangSanPham: true,
          trangThaiSanPham: true,
          maLoai: "",
          maBrand: "",
          hangHoaImages: null,
        }
  );
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Cập nhật formData và preview khi editingProduct thay đổi
  useEffect(() => {
    if (editingProduct && show) {
      setFormData({
        maSanPham: editingProduct.maSanPham,
        tenSanPham: editingProduct.tenSanPham || "",
        soLuong: editingProduct.soLuong || 0,
        donGia: editingProduct.donGia || 0,
        ngayNhap: editingProduct.ngayNhap || "",
        hanBaoHanh: editingProduct.hanBaoHanh || 0,
        shortDescription: editingProduct.shortDescription || "",
        description: editingProduct.description || "",
        tinhTrangSanPham: editingProduct.tinhTrangSanPham !== undefined ? editingProduct.tinhTrangSanPham : true,
        trangThaiSanPham: editingProduct.trangThaiSanPham !== undefined ? editingProduct.trangThaiSanPham : true,
        maLoai: editingProduct.maLoai || "",
        maBrand: editingProduct.maBrand || "",
        hangHoaImages: null,
      });
      // Lấy preview ảnh từ backend URL
      if (editingProduct.hangHoaImages) {
         setImagePreview(`${API_URL}/public/imagesProduct/${editingProduct.hangHoaImages}`);
      } else {
        setImagePreview(null);
      }
    } else if (show && !editingProduct) {
      // Mode thêm mới
      const generateId = () => {
        return "SP" + Date.now().toString().slice(-8);
      };
      setFormData({
        maSanPham: generateId(),
        tenSanPham: "",
        soLuong: 0,
        donGia: 0,
        ngayNhap: "",
        hanBaoHanh: 0,
        shortDescription: "",
        description: "",
        tinhTrangSanPham: true,
        trangThaiSanPham: true,
        maLoai: "",
        maBrand: "",
        hangHoaImages: null,
      });
      setImagePreview(null);
    }
  }, [show, editingProduct]);

  // Load brands và categories khi component mount
  useEffect(() => {
    getBrand()
      .then(setBrands)
      .catch((error) => console.error("Failed to load brands:", error));
    
    getCategory()
      .then(setCategories)
      .catch((error) => console.error("Failed to load categories:", error));
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

      setFormData({ ...formData, hangHoaImages: file });
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
        maSanPham: "",
        tenSanPham: "",
        soLuong: 0,
        donGia: 0,
        ngayNhap: "",
        hanBaoHanh: 0,
        shortDescription: "",
        description: "",
        tinhTrangSanPham: true,
        trangThaiSanPham: true,
        maLoai: "",
        maBrand: "",
        hangHoaImages: null,
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
              {editingProduct ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
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
                <label htmlFor="maSanPham" className="form-label">
                  Mã Sản Phẩm {!editingProduct && <span className="text-muted">(Tự động)</span>}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maSanPham"
                  name="maSanPham"
                  value={formData.maSanPham}
                  onChange={handleInputChange}
                  placeholder="Mã sản phẩm sẽ được tự động tạo"
                  disabled={editingProduct || loading}
                  required
                />
              </div>

              {/* Tên Sản Phẩm */}
              <div className="mb-3">
                <label htmlFor="tenSanPham" className="form-label">
                  Tên Sản Phẩm *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tenSanPham"
                  name="tenSanPham"
                  value={formData.tenSanPham}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                  disabled={loading}
                />
              </div>

              {/* Số Lượng */}
              <div className="mb-3">
                <label htmlFor="soLuong" className="form-label">
                  Số Lượng
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="soLuong"
                  name="soLuong"
                  value={formData.soLuong}
                  onChange={handleInputChange}
                  placeholder="Nhập số lượng"
                  disabled={loading}
                />
              </div>

              {/* Đơn Giá */}
              <div className="mb-3">
                <label htmlFor="donGia" className="form-label">
                  Đơn Giá
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  id="donGia"
                  name="donGia"
                  value={formData.donGia}
                  onChange={handleInputChange}
                  placeholder="Nhập đơn giá"
                  disabled={loading}
                />
              </div>

              {/* Ngày Nhập */}
              <div className="mb-3">
                <label htmlFor="ngayNhap" className="form-label">
                  Ngày Nhập
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="ngayNhap"
                  name="ngayNhap"
                  value={formData.ngayNhap}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Hạn Bảo Hành */}
              <div className="mb-3">
                <label htmlFor="hanBaoHanh" className="form-label">
                  Hạn Bảo Hành (tháng)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="hanBaoHanh"
                  name="hanBaoHanh"
                  value={formData.hanBaoHanh}
                  onChange={handleInputChange}
                  placeholder="Nhập hạn bảo hành"
                  disabled={loading}
                />
              </div>

              {/* Mô Tả Ngắn */}
              <div className="mb-3">
                <label htmlFor="shortDescription" className="form-label">
                  Mô Tả Ngắn
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả ngắn"
                  disabled={loading}
                />
              </div>

              {/* Mô Tả */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Mô Tả
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả"
                  rows="3"
                  disabled={loading}
                ></textarea>
              </div>

              {/* Mã Loại */}
              <div className="mb-3">
                <label htmlFor="maLoai" className="form-label">
                  Loại Sản Phẩm
                </label>
                <select
                  className="form-control"
                  id="maLoai"
                  name="maLoai"
                  value={formData.maLoai}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">-- Chọn loại sản phẩm --</option>
                  {categories.map((cat) => (
                    <option key={cat.maLoai} value={cat.maLoai}>
                      {cat.tenLoai}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mã Brand */}
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
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map((brand) => (
                    <option key={brand.maBrand} value={brand.maBrand}>
                      {brand.tenBrand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hình Ảnh */}
              <div className="mb-3">
                <label htmlFor="hangHoaImages" className="form-label">
                  Hình Ảnh Sản Phẩm
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="hangHoaImages"
                  name="hangHoaImages"
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

              {/* Tình Trạng Sản Phẩm */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="tinhTrangSanPham"
                  name="tinhTrangSanPham"
                  checked={formData.tinhTrangSanPham}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <label className="form-check-label" htmlFor="tinhTrangSanPham">
                  Tình trạng sản phẩm mới
                </label>
              </div>

              {/* Trạng Thái Sản Phẩm */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="trangThaiSanPham"
                  name="trangThaiSanPham"
                  checked={formData.trangThaiSanPham}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <label className="form-check-label" htmlFor="trangThaiSanPham">
                  Sản phẩm hoạt động
                </label>
              </div>
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
                {loading ? "Đang xử lý..." : editingProduct ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
