import { useEffect, useState } from "react";
import {getProduct} from "../api/productAPI";
import ProductList from "../component/ProductList";
export default function Product() {
  const [product, setProduct] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      useEffect(() => {
        getProduct()
          .then(data => {
            setProduct(data);
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
                  <h5 className="card-title fw-bold text-primary">Quản Lý Sản Phẩm</h5>
                  <button className="btn btn-primary shadow-sm">
                    + Thêm Sản Phẩm
                  </button>
                </div>
                 <div className="table-responsive">
                   <table className="table table-hover table-bordered text-nowrap align-middle">
                     <thead>
                       <tr>
                        <th className="text-center">Mã Sản Phẩm</th>
                        <th className="text-center">Tên Sản Phẩm</th>
                        <th className="text-center">Số Lượng</th>
                        <th className="text-center">Đơn Giá</th>
                        <th className="text-center">Hình Ảnh</th>
                        <th className="text-center">Ngày Nhập</th>
                        <th className="text-center">Hạn Bảo Hành</th>
                        <th className="text-center">Mô Tả Ngắn</th>
                        <th className="text-center">Mô tả</th>
                        <th className="text-center">Mã Loại</th>
                        <th className="text-center">Mã Brand</th>
                        <th className="text-center">Quản Lí</th>
                       </tr>
                     </thead>
                      <tbody>
                          <ProductList products={product}/>
                      </tbody>
                   </table>
                 </div>
              </div>
              <h2></h2>
            </div>
            </div>
  )
}