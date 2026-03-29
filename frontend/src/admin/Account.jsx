import { useEffect, useState } from "react";
import { getAccounts, createAccount } from "../api/accountAPI";
import AccountList from "../component/AccountList";
  
export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [detailAccount, setDetailAccount] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [newAccount, setNewAccount] = useState({});
  
  // Load tất cả register
    const loadRegister = async () => {
      setLoading(true);
      try {
        const [accountData] = await Promise.all([
          getAccounts(),
        ]);
        setAccounts(accountData);
        setFilteredAccounts(accountData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    loadRegister();
  }, []);

  // Handle add new register
  const handleAddClick = () => {
    setEditingAccount(null);
    setShowModal(true);
  };
  // Handle submit (add or update)
    const handleSubmit = async (formData) => {
      try {
        if (editingAccount) {
          // Update
          await updateAccount(editingAccount.Id_Register, formData);
          alert("Cập nhật tài khoản thành công!");
        } else {
          // Create
          await createAccount(formData);
          alert("Thêm tài khoản thành công!");
        }
        await loadRegister();
        setSearchKeyword(""); // Reset search
      } catch (err) {
        throw new Error(err.message);
      }
    };
 
  if (loading && accounts.length === 0) return <p>Loading...</p>;
  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
          <div className="card shadow-lg border-0 flex-grow-1">
            <div className="card-body">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3 header-line">
                <h5 className="card-title fw-bold text-primary">
                  Quản Lý Account / Register
                </h5>
                <button
                  className="btn btn-primary shadow-sm"
                  onClick={handleAddClick}
                >
                  + Thêm Account
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
                    placeholder="Tìm kiếm theo mã hoặc tên users..."
                    
                  />
                </div>
              </div>
    
              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover table-bordered text-nowrap align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">ID_Register</th>
                      <th className="text-center">User Name</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">Password</th>
                      <th className="text-center">Địa Chỉ</th>
                      <th className="text-center">Số Điện Thoại</th>
                      <th className="text-center">Role</th>
                      <th className="text-center">Quản Lí</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AccountList/>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>
  )
}
