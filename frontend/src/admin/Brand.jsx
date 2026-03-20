import { useEffect, useState } from "react";
import { getBrand, createBrand, updateBrand, deleteBrand } from "../api/brandAPI";
import BrandList from "../component/BrandList";
import BrandUpDel from "../component/BrandUpDel";
import "../admin/CSS/brand.css";

export default function Brand() {
  const [brand, setBrand] = useState([]);
  const [filteredBrand, setFilteredBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Lấy danh sách brand
  const loadBrands = async () => {
    try {
      const data = await getBrand();
      setBrand(data);
      setFilteredBrand(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Tìm kiếm brand (client-side)
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredBrand(brand);
      return;
    }

    // Tìm kiếm phía client - nhanh hơn, không gọi API
    const searchLower = keyword.toLowerCase().trim();
    const results = brand.filter((item) =>
      item.maBrand.toLowerCase().includes(searchLower) ||
      item.tenBrand.toLowerCase().includes(searchLower)
    );
    setFilteredBrand(results);
  };

  useEffect(() => {
    loadBrands().then(() => setLoading(false));
  }, []);

  // Mở modal thêm brand
  const handleAddBrand = () => {
    setEditingBrand(null);
    setShowModal(true);
  };

  // Mở modal sửa brand
  const handleEditBrand = (brandItem) => {
    setEditingBrand(brandItem);
    setShowModal(true);
  };

  // Xóa brand
  const handleDeleteBrand = async (maBrand) => {
    if (window.confirm("Bạn chắc chắn muốn xóa brand này?")) {
      try {
        await deleteBrand(maBrand);
        const updatedList = brand.filter((b) => b.maBrand !== maBrand);
        setBrand(updatedList);
        setFilteredBrand(updatedList.filter((b) => 
          b.maBrand.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          b.tenBrand.toLowerCase().includes(searchKeyword.toLowerCase())
        ));
        alert("Xóa thành công!");
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  // Submit form (thêm hoặc sửa)
  const handleSubmitBrand = async (formData) => {
    try {
      if (editingBrand) {
        // Cập nhật brand
        await updateBrand(editingBrand.maBrand, formData);
        alert("Cập nhật thành công!");
      } else {
        // Thêm brand mới
        await createBrand(formData);
        alert("Thêm thành công!");
      }
      // Tải lại danh sách
      await loadBrands();
      setSearchKeyword(""); // Reset search
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">Quản Lý Thương Hiệu</h5>
            <button
              className="btn btn-primary shadow-sm"
              onClick={handleAddBrand}
            >
              + Thêm Thương Hiệu
            </button>
          </div>

          {/* Thanh Tìm Kiếm */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo mã hoặc tên brand..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredBrand(brand);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">
                Tìm thấy {filteredBrand.length} kết quả
              </small>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead>
                <tr>
                  <th className="text-center">Mã Brand</th>
                  <th className="text-center">Tên Brand</th>
                  <th className="text-center">Hình Ảnh</th>
                  <th className="text-center">Quản Lí</th>
                </tr>
              </thead>
              <tbody>
                <BrandList
                  brands={filteredBrand}
                  onEdit={handleEditBrand}
                  onDelete={handleDeleteBrand}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa brand */}
      <BrandUpDel
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitBrand}
        editingBrand={editingBrand}
      />
    </div>
  );
}

