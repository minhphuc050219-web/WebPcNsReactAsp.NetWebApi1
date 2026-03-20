import { useEffect, useState } from "react";
import {getSalary} from "../api/salaryAPI";
import SalaryList from "../component/SalaryList";
export default function Salary() {
  const [salary, setSalary] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        useEffect(() => {
          getSalary()
            .then(data => {
              setSalary(data);
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
                      <h5 className="card-title fw-bold text-primary">Quản Lý Lương</h5>
                      <button className="btn btn-primary shadow-sm">
                        + Thêm lương
                      </button>
                    </div>
                     <div className="table-responsive">
                       <table className="table table-hover table-bordered text-nowrap align-middle">
                         <thead>
                           <tr>
                            <th className="text-center">Mã Lương</th>
                            <th className="text-center">Mã Nhân Viên</th>
                            <th className="text-center">Month</th>
                            <th className="text-center">Year</th>
                            <th className="text-center">Số Ngày Công</th>
                            <th className="text-center">Tổng Lương</th>
                            <th className="text-center">Quản Lí</th>
                           </tr>
                         </thead>
                          <tbody>
                            <SalaryList salarys={salary}/>
                          </tbody>
                       </table>
                     </div>
                  </div>
                  <h2></h2>
                </div>
                </div>
  )
}