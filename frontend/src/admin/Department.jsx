import { useEffect, useState } from "react";
import {
  getDepartment,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../api/departmentAPI";
import DepartmentList from "../component/DepartmentList";
import DepartmentUpDel from "../component/DepartmentUpDel";

export default function Department() {
  const [department, setDepartment] = useState([]);
  const [filteredDepartment, setFilteredDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Lấy danh sách brand
  const loadDepartments = async () => {
    try {
      const data = await getDepartment();
      setDepartment(data);
      setFilteredDepartment(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Tìm kiếm brand (client-side)
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredDepartment(department);
      return;
    }

    // Tìm kiếm phía client - nhanh hơn, không gọi API
    const searchLower = keyword.toLowerCase().trim();
    const results = department.filter(
      (item) =>
        item.maPhongBan.toLowerCase().includes(searchLower) ||
        item.tenPhongBan.toLowerCase().includes(searchLower),
    );
    setFilteredDepartment(results);
  };

  useEffect(() => {
    loadDepartments().then(() => setLoading(false));
  }, []);

  // Mở modal thêm department
  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setShowModal(true);
  };

  // Mở modal sửa department
  const handleEditDepartment = (departmentItem) => {
    setEditingDepartment(departmentItem);
    setShowModal(true);
  };

  // Xóa department
  const handleDeleteDepartment = async (maPhongBan) => {
    if (window.confirm("Bạn chắc chắn muốn xóa phòng ban này?")) {
      try {
        await deleteDepartment(maPhongBan);
        const updatedList = department.filter(
          (d) => d.maPhongBan !== maPhongBan,
        );
        setDepartment(updatedList);
        setFilteredDepartment(
          updatedList.filter(
            (d) =>
              d.maPhongBan
                .toLowerCase()
                .includes(searchKeyword.toLowerCase()) ||
              d.tenPhongBan.toLowerCase().includes(searchKeyword.toLowerCase()),
          ),
        );
        alert("Xóa thành công!");
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  // Submit form (thêm hoặc sửa)
  const handleSubmitDepartment = async (formData) => {
    try {
      if (editingDepartment) {
        // Cập nhật department
        await updateDepartment(editingDepartment.maPhongBan, formData);
        alert("Cập nhật thành công!");
      } else {
        // Thêm department mới
        await createDepartment(formData);
        alert("Thêm thành công!");
      }
      // Tải lại danh sách
      await loadDepartments();
      setSearchKeyword(""); // Reset search
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">
              Quản Lý Phòng Ban
            </h5>
            <button
              className="btn btn-primary shadow-sm"
              onClick={handleAddDepartment}
            >
              + Thêm Phòng Ban
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
                placeholder="Tìm kiếm theo mã hoặc tên phòng ban..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredDepartment(department);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">
                Tìm thấy {filteredDepartment.length} kết quả
              </small>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead>
                <tr>
                  <th className="text-center">Mã Phòng Ban</th>
                  <th className="text-center">Tên Phòng Ban</th>
                  <th className="text-center">Số Lượng Nhân Viên</th>
                  <th className="text-center">Quản Lí</th>
                </tr>
              </thead>
              <tbody>
                <DepartmentList departments={filteredDepartment} onEdit={handleEditDepartment} onDelete={handleDeleteDepartment} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal thêm/sửa department */}
            <DepartmentUpDel
              show={showModal}
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmitDepartment}
              editingDepartment={editingDepartment}
            />
    </div>
  );
}
