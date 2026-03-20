import { useEffect, useState } from "react";
import {getCategory} from "../api/categoryAPI";
import CategoryList from "../component/CategoryList";
import "../admin/CSS/category.css";
export default function Category() {
  const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      getCategory()
        .then(data => {
          setCategory(data);
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
              <h5 className="card-title fw-bold text-primary">Quản Lý Loại Sản Phẩm</h5>
              <button className="btn btn-primary shadow-sm">
                + Thêm loại sản phẩm
              </button>
            </div>
             <div className="table-responsive">
               <table className="table table-hover table-bordered text-nowrap align-middle">
                 <thead>
                   <tr>
                    <th className="text-center">Mã Loại</th>
                    <th className="text-center">Tên Loại</th>
                    <th className="text-center">Hình Ảnh</th>
                    <th className="text-center">Mã Brand</th>
                    <th className="text-center">Quản Lí</th>
                   </tr>
                 </thead>
                  <tbody>
                    <CategoryList categorys={category}/>
                  </tbody>
               </table>
             </div>
          </div>
          <h2></h2>
        </div>
        </div>
  )
}