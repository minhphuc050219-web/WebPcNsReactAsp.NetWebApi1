import { useEffect, useState } from "react";
import { getStaff,createStaff,updateStaff,deleteStaff} from "../api/staffAPI";
import { getDepartment } from "../api/departmentAPI";
import StaffList from "../component/StaffList";
import StafftUpDel from "../component/StaffUpDel";
import StaffDetail from "../component/StaffDetail";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [detailStaff, setDetailStaff] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Load tất cả staff, departments
  const loadStaff = async () => {
    setLoading(true);
    try {
      const [staffData, departmentData] = await Promise.all([
        getStaff(),
        getDepartment(),
      ]);
      setStaff(staffData);
      setFilteredStaff(staffData);
      setDepartments(departmentData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  // Tìm kiếm staff (client-side) - nhanh hơn, không gọi API
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredStaff(staff);
      return;
    }

    // Tìm kiếm phía client
    const searchLower = keyword.toLowerCase().trim();
    const results = staff.filter(
      (item) =>
        item.maNV.toLowerCase().includes(searchLower) ||
        (item.tenNV && item.tenNV.toLowerCase().includes(searchLower))
    );
    setFilteredStaff(results);
  };

  // Handle add new staff
  const handleAddClick = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  // Handle edit staff
  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setShowModal(true);
  };

  // Handle delete staff
  const handleDelete = async (maNV) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      try {
        await deleteStaff(maNV);
        alert("Xóa nhân viên thành công!");
        await loadStaff();
        setSearchKeyword(""); // Reset search
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  // Handle detail view
  const handleDetail = (staff) => {
    setDetailStaff(staff);
    setShowDetailModal(true);
  };

  // Handle submit (add or update)
  const handleSubmit = async (formData) => {
    try {
      if (editingStaff) {
        // Update
        await updateStaff(editingStaff.maNV, formData);
        alert("Cập nhật nhân viên thành công!");
      } else {
        // Create
        await createStaff(formData);
        alert("Thêm nhân viên thành công!");
      }
      await loadStaff();
      setSearchKeyword(""); // Reset search
    } catch (err) {
      throw new Error(err.message);
    }
  };

  if (loading && staff.length === 0) return <p>Loading...</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">
              Quản Lý Nhân Viên
            </h5>
            <button
              className="btn btn-primary shadow-sm"
              onClick={handleAddClick}
            >
              + Thêm nhân viên
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
                placeholder="Tìm kiếm theo mã hoặc tên nhân viên..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredStaff(staff);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">
                Tìm thấy {filteredStaff.length} kết quả
              </small>
            )}
          </div>
          {/* Error message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Mã Staff</th>
                  <th className="text-center">Tên Staff</th>
                  <th className="text-center">Giới Tính</th>
                  <th className="text-center">Lương CB</th>
                  <th className="text-center">Hình Ảnh</th>
                  <th className="text-center">MÃ PB</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Quản Lí</th>
                </tr>
              </thead>
              <tbody>
                <StaffList
                  staffs={filteredStaff}
                  departments={departments}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDetail={handleDetail}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Staff Modal (Add/Edit) */}
      <StafftUpDel
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStaff(null);
        }}
        onSubmit={handleSubmit}
        editingStaff={editingStaff}
      />
      {/* Staff Detail Modal */}
      <StaffDetail
        key={detailStaff?.maNV || "detail-modal"}
        show={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setDetailStaff(null);
        }}
        staff={detailStaff}
        hideDetails={true}
      />
    </div>
  );
}
