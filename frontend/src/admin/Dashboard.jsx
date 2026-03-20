import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="row">
      <h1 style={{marginBottom:"20px"}}>📊 Dashboard</h1>
      {/* STAT CARDS */}
      
      <h2> Đây là trang Admin Dashboard</h2>
      <nav>
        <Link to="/admin/brand">Brand</Link> |
        <Link to="/admin/category">Category</Link> |
        <Link to="/admin/product">Product</Link>
      </nav>

      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h5>Tổng sản phẩm</h5>
            <h2 className="text-primary">120</h2>
          </div>
        </div>
      </div>

       <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h5>Đơn hàng</h5>
            <h2 className="text-success">45</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-center">
          <div className="card-body">
            <h5>Người dùng</h5>
            <h2 className="text-danger">78</h2>
          </div>
        </div>
      </div>
      
    </div>
  )
}