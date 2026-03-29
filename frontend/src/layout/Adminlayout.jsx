import { Link, Outlet } from "react-router-dom";
import "../admin/CSS/admin.css";
export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <div className="admin-container">
        {/* SIDEBAR */}
        <aside className="admin-sidebar bg-dark text-white p-3">
          <h4 className="mb-4">ADMIN PANEL</h4>
          <ul className="nav flex-column">
            <p className="menu-title">
              HOME
              <li className="nav-item">
                <Link className="menu" to="/admin">
                  Dashboard
                </Link>
                <Link className="menu" to="/">
                  Home
                </Link>
              </li>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT PRODUCTS
              <Link className="menu" to="/admin/brand">
                Brand
              </Link>
              <Link className="menu" to="/admin/category">
                Category
              </Link>
              <Link className="menu" to="/admin/product">
                Product
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT STAFFS
              <Link className="menu" to="/admin/phongban">
                Department
              </Link>
              <Link className="menu" to="/admin/staff">
                Staff
              </Link>
              <Link className="menu" to="/admin/salary">
                Salary
              </Link>
              <Link className="menu" to="/admin/timekp">
                Cham Cong
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT ACCOUNT
              <Link className="menu" to="/admin/account">
                Account
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT ARTICLES
              <Link className="menu" to="/admin/artcategory">
                Article Category
              </Link>
              <Link className="menu" to="/admin/article">
                Article
              </Link>
            </p>

            <p className="menu-title">
              {" "}
              MANAGEMENT CART
              <Link className="menu" to="">
                Cart
              </Link>
              <Link className="menu" to="">
                Cart Detail
              </Link>
            </p>
          </ul>
        </aside>

        {/* MAIN */}
        <div className="admin-right">
          {/* HEADER */}
          <header className="admin-header bg-light shadow-sm p-3 d-flex justify-content-between">
            <h5 className="m-0">📊 Admin Dashboard</h5>
            <div>
              <button className="btn btn-outline-primary me-2">
                Notifications
              </button>
              <button className="btn btn-outline-danger">Logout</button>
            </div>
          </header>

          {/* CONTENT */}
          <div className="admin-content">
            <Outlet />
          </div>

          {/* FOOTER */}
          <footer className="bg-light text-center p-3">
            © 2026 Admin Dashboard | Powered by You 🚀
          </footer>
        </div>
      </div>
    </div>
  );
}
