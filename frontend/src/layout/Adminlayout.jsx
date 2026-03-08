import { Link, Outlet } from 'react-router-dom'
import "../admin/CSS/admin.css"
export default function AdminLayout() {
  return (
    <div className='admin-container'>
      {/* SIDEBAR */}
      <aside className='sidebar'>
        <h2 className='logo'>ADMIN PC SHOP</h2>
        <p className='menu-title'>HOME</p>
          <Link className="menu" to="/admin">Dashboard</Link>
          <Link className="menu" to="/">Home</Link>
        <p className='menu-title'> MANAGEMENT PRODUCTS</p>
          <Link className="menu" to="/admin/brand">Brand</Link>
          <Link className="menu" to="/admin/category">Category</Link>
          <Link className="menu" to="/admin/product">Product</Link>
        <p className='menu-title'> MANAGEMENT STAFFS</p>
          <Link className="menu" to="/admin/phongban">Department</Link>
          <Link className="menu" to="/admin/staff">Staff</Link>
          <Link className="menu" to="/admin/salary">Salary</Link>
          <Link className="menu" to="/admin/timekp">Cham Cong</Link>
        <p className='menu-title'> MANAGEMENT ACCOUNT</p>
          <Link className="menu" to="/admin/account">Account</Link>
        <p className='menu-title'> MANAGEMENT ARTICLES</p>
          <Link className="menu" to="/admin/artcategory">Article Category</Link>
          <Link className="menu" to="/admin/article">Article</Link>
          <Link className="menu" to="/admin/cart">Cart</Link>
          <Link className="menu" to="/admin/cartdetail">Cart Detail</Link>

      </aside>
      {/* RIGHT AREA */}
      <div className='right-area'>
        {/* HEADER */}
        <header className='admin-header'>
          <h3>Admin Panel</h3>
          <div className='header-actions'>
            <span>🔔</span>
            <img className='avatar' src='https://i.pravatar.cc/40' alt='avatar'/>
          </div>
        </header>
        {/* CONTENT */}
        <main className='admin-content'>
          <Outlet />
        </main>
        {/* FOOTER */}
        <footer className='admin-footer'>© 2026 Admin Dashboard | Powered by You 🚀</footer>
      </div>
    </div>
  )
}