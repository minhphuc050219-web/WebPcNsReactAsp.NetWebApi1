import { useEffect, useState } from "react";
import {
  getAccounts,
  registerUser,
  createAccountByAdmin,
  updateAccount,
  deleteAccount,
} from "../api/accountAPI";

import AccountList from "../component/AccountList";
import AccountUpDel from "../component/AccountUpDel";

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");

  // 🔥 LOAD DATA
  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(data);
      setFilteredAccounts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // 🔍 SEARCH
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (!keyword.trim()) {
      setFilteredAccounts(accounts);
      return;
    }

    const searchLower = keyword.toLowerCase().trim();

    const results = accounts.filter(
      (acc) =>
        acc.username?.toLowerCase().includes(searchLower) ||
        acc.email?.toLowerCase().includes(searchLower),
    );

    setFilteredAccounts(results);
  };

  // ➕ ADD
  const handleAddClick = () => {
    setEditingAccount(null);
    setShowModal(true);
  };

  // ✏️ EDIT
  const handleEdit = (acc) => {
    if (acc.role === "admin") {
      alert("Không thể sửa tài khoản admin");
      return;
    }
    setEditingAccount(acc);
    setShowModal(true);
  };

  // ❌ DELETE
  const handleDelete = async (id, role) => {
    if (role === "admin") {
      alert("Không thể xóa tài khoản admin");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này không?"))
      return;

    try {
      await deleteAccount(id);
      alert("Xóa tài khoản thành công!");
      await loadAccounts();
      setSearchKeyword("");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // 💾 SUBMIT (ADD + UPDATE)
  const handleSubmit = async (formData) => {
    {
      try {
        if (editingAccount) {
          await updateAccount(editingAccount.id_Register, formData);
          alert("Cập nhật account thành công!");
        } else {
          await createAccountByAdmin(formData);
          alert("Thêm account thành công!");
        }

        await loadAccounts();
        setSearchKeyword("");
      } catch (err) {
        throw new Error(err.message);
      }
    }
  };

  if (loading && accounts.length === 0) return <p>Loading...</p>;

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
      <div className="card shadow-lg border-0 flex-grow-1">
        <div className="card-body">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-primary">Quản Lý Tài Khoản</h5>
            <button className="btn btn-primary" onClick={handleAddClick}>
              + Thêm tài khoản
            </button>
          </div>

          {/* SEARCH */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm theo username hoặc email..."
                value={searchKeyword}
                onChange={handleSearch}
              />

              {searchKeyword && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchKeyword("");
                    setFilteredAccounts(accounts);
                  }}
                >
                  Xóa
                </button>
              )}
            </div>

            {searchKeyword && (
              <small className="text-muted">
                Tìm thấy {filteredAccounts.length} kết quả
              </small>
            )}
          </div>

          {/* ERROR */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Username</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Giới tính</th>
                  <th className="text-center">Hình ảnh</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Quản lý</th>
                </tr>
              </thead>

              <tbody>
                <AccountList
                  accounts={filteredAccounts}
                  onEdit={handleEdit}
                  onDelete={(id, role) => handleDelete(id, role)}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AccountUpDel
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSubmit}
        editingAccount={editingAccount}
      />
    </div>
  );
}
