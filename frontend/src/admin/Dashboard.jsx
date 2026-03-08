import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{marginBottom:"20px"}}>📊 Dashboard</h1>
      {/* STAT CARDS */}
      
      <h2> Đây là trang Admin Dashboard</h2>
      <nav>
        <Link to="/admin/brand">Brand</Link> |
        <Link to="/admin/category">Category</Link> |
        <Link to="/admin/product">Product</Link>
      </nav>
    </div>
  )
}