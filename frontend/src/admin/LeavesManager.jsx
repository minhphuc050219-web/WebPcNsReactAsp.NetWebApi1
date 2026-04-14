import { useEffect, useState } from "react";
import { approveLeave, getLeaves, rejectLeave } from "../api/leavesAPI";
import { getStaff } from "../api/staffAPI";
import { getDepartment } from "../api/departmentAPI";
import LeavesManagerList from "../component/LeavesManagerList";
import LeavesManagerDetail from "../component/LeavesManagerDetail";

export default function LeavesManager() {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Tai danh sach don, sap xep moi nhat len truoc
  const loadLeaves = async () => {
    setLoading(true);
    try {
      const [leavesData, staffData, departments] = await Promise.all([
        getLeaves(),
        getStaff(),
        getDepartment(),
      ]);

      const staffById = new Map(staffData.map((s) => [s.maNV, s]));
      const departmentNameById = new Map(
        departments.map((d) => [d.maPhongBan, d.tenPhongBan || "-"])
      );

      const merged = leavesData.map((item) => ({
        ...item,
        tenNV: item.tenNV || item.nhanVien?.tenNV || staffById.get(item.maNV)?.tenNV || "-",
        gioiTinh: staffById.get(item.maNV)?.gioiTinh,
        sdt: staffById.get(item.maNV)?.sdt || "-",
        role: staffById.get(item.maNV)?.role || "-",
        tenPhongBan:
          departmentNameById.get(staffById.get(item.maNV)?.maPhongBan) ||
          staffById.get(item.maNV)?.maPhongBan ||
          "-",
      }));

      const sorted = [...merged].sort((a, b) => (b.maLV || 0) - (a.maLV || 0));
      setLeaves(sorted);
      setFilteredLeaves(sorted);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  // Tim kiem phia client de phan hoi nhanh, khong can goi lai API
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredLeaves(leaves);
      return;
    }

    const searchLower = keyword.toLowerCase().trim();
    const result = leaves.filter((item) =>
      (item.maNV || "").toLowerCase().includes(searchLower)
      || (item.tenNV || item.nhanVien?.tenNV || "").toLowerCase().includes(searchLower)
    );

    setFilteredLeaves(result);
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setFilteredLeaves(leaves);
  };

  const handleDetail = (item) => {
    setSelectedLeave(item);
    setShowDetail(true);
  };

  // Duyet don: cap nhat trang thai thanh "Da duyet"
  const handleApprove = async (id) => {
    if (!window.confirm("Duyệt đơn xin nghỉ này?")) return;
    try {
      await approveLeave(id);
      await loadLeaves();
      alert("Duyệt đơn thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // Tu choi don: cap nhat trang thai thanh "Tu choi"
  const handleReject = async (id) => {
    if (!window.confirm("Từ chối đơn xin nghỉ này?")) return;
    try {
      await rejectLeave(id);
      await loadLeaves();
      alert("Từ chối đơn thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  if (loading && leaves.length === 0) return <p>Loading...</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">Quản Lý Đơn Xin Nghỉ</h5>
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo mã nhân viên hoặc tên nhân viên..."
                value={searchKeyword}
                onChange={handleSearch}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={clearSearch}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">
                Tìm thấy {filteredLeaves.length} kết quả
              </small>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Mã NV</th>
                  <th className="text-center">Tên NV</th>
                  <th className="text-center">Trạng Thái</th>
                  <th className="text-center">Loại Đơn</th>
                  <th className="text-center">Quản Lý</th>
                </tr>
              </thead>
              <tbody>
                <LeavesManagerList
                  leaves={filteredLeaves}
                  onDetail={handleDetail}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LeavesManagerDetail
        show={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
      />
    </div>
  );
}
