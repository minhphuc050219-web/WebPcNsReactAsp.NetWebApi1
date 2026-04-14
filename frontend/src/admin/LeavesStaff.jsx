import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createLeave, deleteLeave, getLeaves, updateLeave } from "../api/leavesAPI";
import { getStaff } from "../api/staffAPI";
import LeavesStaffUpDel from "../component/LeavesStaffUpDel";
import LeavesStaffDetail from "../component/LeavesStaffDetail";
import LeavesStaffList from "../component/LeavesStaffList";

export default function LeavesStaff() {
  const { auth } = useAuth();

  const [myStaff, setMyStaff] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);

  const [showDetail, setShowDetail] = useState(false);
  const [detailLeave, setDetailLeave] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");

  // Map tai khoan dang nhap sang nhan vien trong bang staff de lay MaNV
  const resolveCurrentStaff = async () => {
    const staffs = await getStaff();
    const found = staffs.find((s) =>
      s.id_Register === auth?.id
      || s.idRegister === auth?.id
      || (s.email && auth?.email && s.email.toLowerCase() === auth.email.toLowerCase()),
    );

    if (!found) {
      throw new Error("Không tìm thấy thông tin nhân viên của tài khoản hiện tại");
    }

    return found;
  };

  // Nap du lieu trang: tim nhan vien hien tai va loc don nghi cua nhan vien do
  const loadData = async () => {
    setLoading(true);
    try {
      const staffInfo = await resolveCurrentStaff();
      setMyStaff(staffInfo);

      const allLeaves = await getLeaves();
      const myLeaves = allLeaves
        .filter((item) => item.maNV === staffInfo.maNV)
        .sort((a, b) => (b.maLV || 0) - (a.maLV || 0));

      setLeaves(myLeaves);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Loc danh sach don cua nhan vien dang nhap theo tu khoa tim kiem
  const filteredLeaves = useMemo(() => {
    if (!searchKeyword.trim()) return leaves;
    const key = searchKeyword.toLowerCase().trim();
    return leaves.filter((item) =>
      String(item.maLV || "").toLowerCase().includes(key)
      || (item.typeLV || "").toLowerCase().includes(key)
      || (item.trangThai || "").toLowerCase().includes(key)
      || (item.lyDo || "").toLowerCase().includes(key),
    );
  }, [leaves, searchKeyword]);

  const handleAdd = () => {
    setEditingLeave(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingLeave(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn xin nghỉ này không?")) return;
    try {
      await deleteLeave(id);
      await loadData();
      alert("Xóa đơn thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // Submit dung chung cho tao moi va cap nhat
  // - Uu tien trangThai do form tinh theo quy tac rang buoc
  // - Neu khong co thi moi fallback ve trang thai hien tai
  const handleSubmit = async (formData) => {
    if (!myStaff?.maNV) {
      throw new Error("Không xác định được mã nhân viên hiện tại");
    }

    const payload = {
      ...formData,
      maNV: myStaff.maNV,
      trangThai: formData.trangThai || editingLeave?.trangThai || "Chờ duyệt",
    };

    if (editingLeave) {
      await updateLeave(editingLeave.maLV, payload);
    } else {
      await createLeave(payload);
    }

    await loadData();
  };

  if (loading && leaves.length === 0) return <p>Loading...</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 header-line">
            <h5 className="card-title fw-bold text-primary">
              Đơn Xin Nghỉ Của Tôi {myStaff?.maNV ? `- ${myStaff.maNV}` : ""}
            </h5>
            <button className="btn btn-primary shadow-sm" onClick={handleAdd}>
              + Tạo Đơn Xin Nghỉ
            </button>
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo mã đơn, loại nghỉ, trạng thái, lý do..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setSearchKeyword("")}
                >
                  Xóa
                </button>
              )}
            </div>
            {searchKeyword && (
              <small className="text-muted d-block mt-1">Tìm thấy {filteredLeaves.length} kết quả</small>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-hover table-bordered text-nowrap align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Mã Đơn</th>
                  <th className="text-center">Loại Nghỉ</th>
                  <th className="text-center">Ngày BĐ</th>
                  <th className="text-center">Ngày KT</th>
                  <th className="text-center">Trạng Thái</th>
                  <th className="text-center">Lý Do</th>
                  <th className="text-center">Quản Lý</th>
                </tr>
              </thead>
              <tbody>
                <LeavesStaffList
                  leaves={filteredLeaves}
                  onDetail={(item) => {
                    setDetailLeave(item);
                    setShowDetail(true);
                  }}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LeavesStaffUpDel
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLeave(null);
        }}
        onSubmit={handleSubmit}
        editingLeave={editingLeave}
      />

      <LeavesStaffDetail
        show={showDetail}
        onClose={() => {
          setShowDetail(false);
          setDetailLeave(null);
        }}
        leave={detailLeave}
      />
    </div>
  );
}
