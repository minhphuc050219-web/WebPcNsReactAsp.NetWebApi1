import { useEffect, useState } from "react";
import {getStaff} from "../api/staffAPI";
import StaffList from "../component/StaffList";
export default function Staff() {
  const [staff, setStaff] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      useEffect(() => {
        getStaff()
          .then(data => {
            setStaff(data);
            setLoading(false);
          })
          .catch(err => {
            setError(err.message);
            setLoading(false);
          });
      }, []);
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;
  return (
    <div className="container-fluid min-vh-100 d-flex flex-column">
            <div className="card shadow-lg border-0 flex-grow-1">
              <div className="card-body">
                 <div className="d-flex justify-content-between align-items-center mb-3 header-line">
                  <h5 className="card-title fw-bold text-primary">Quản Lý Nhân Viên</h5>
                  <button className="btn btn-primary shadow-sm">
                    + Thêm nhân viên
                  </button>
                </div>
                 <div className="table-responsive">
                   <table className="table table-hover table-bordered text-nowrap align-middle">
                     <thead>
                       <tr>
                        <th className="text-center">Mã Staff</th>
                        <th className="text-center">Tên Staff</th>
                        <th className="text-center">Địa Chỉ</th>
                        <th className="text-center">SDT</th>
                        <th className="text-center">Giới Tính</th>
                        <th className="text-center">Lương CB</th>
                        <th className="text-center">Hình Ảnh</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">Password</th>
                        <th className="text-center">MÃ PB</th>
                        <th className="text-center">Role</th>
                        <th className="text-center">Quản Lí</th>
                       </tr>
                     </thead>
                      <tbody>
                        <StaffList staffs={staff}/>
                      </tbody>
                   </table>
                 </div>
              </div>
              <h2></h2>
            </div>
            </div>
  )
}