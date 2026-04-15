import { useEffect, useState } from "react";
import { getSalary, searchSalary, createSalary, updateSalary, deleteSalary } from "../api/salaryAPI";
import SalaryList from "../component/SalaryList";
import SalaryUpDel from "../component/SalaryUpDel";
import SalaryDetail from "../component/SalaryDetail";

export default function Salary() {
  const [salary, setSalary] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailSalary, setDetailSalary] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await getSalary();
      setSalary(data);
      setFiltered(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async (e) => {
    const kw = e.target.value;
    setSearchKeyword(kw);
    if (!kw.trim()) {
      setFiltered(salary);
      return;
    }

    try {
      // Use backend search which supports TenNV and MaNV
      const results = await searchSalary(kw);
      setFiltered(results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi lương này?")) return;
    try {
      await deleteSalary(id);
      alert("Xóa thành công");
      await loadAll();
      setSearchKeyword("");
    } catch (err) {
      alert(err.message || "Lỗi khi xóa");
    }
  };

  const handleDetail = (item) => {
    setDetailSalary(item);
    setShowDetail(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editing) {
        await updateSalary(editing.maLuong, formData);
        alert("Cập nhật thành công");
      } else {
        await createSalary(formData);
        alert("Tạo thành công");
      }
      await loadAll();
      setShowModal(false);
      setEditing(null);
      setSearchKeyword("");
    } catch (err) {
      throw new Error(err.message || "Lỗi khi lưu");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">Quản Lý Lương</h5>
            <button className="btn btn-primary shadow-sm" onClick={handleAdd}>
              + Thêm lương
            </button>
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input type="text" className="form-control" placeholder="Tìm theo Mã NV hoặc Tên NV..." value={searchKeyword} onChange={handleSearch} />
              {searchKeyword && (
                <button className="btn btn-outline-secondary" type="button" onClick={() => { setSearchKeyword(""); setFiltered(salary); }}>
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && <small className="text-muted d-block mt-1">Tìm thấy {filtered.length} kết quả</small>}
          </div>

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead>
                <tr>
                  <th className="text-center">Mã Nhân Viên</th>
                  <th className="text-center">Month</th>
                  <th className="text-center">Year</th>
                  <th className="text-center">Số Ngày Công</th>
                  <th className="text-center">Tổng Lương</th>
                  <th className="text-center">Quản Lí</th>
                </tr>
              </thead>
              <tbody>
                <SalaryList salarys={filtered} onEdit={handleEdit} onDelete={handleDelete} onDetail={handleDetail} />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SalaryUpDel show={showModal} onClose={() => { setShowModal(false); setEditing(null); }} onSubmit={handleSubmit} editing={editing} />

      <SalaryDetail show={showDetail} onClose={() => { setShowDetail(false); setDetailSalary(null); }} salary={detailSalary} />
    </div>
  );
}