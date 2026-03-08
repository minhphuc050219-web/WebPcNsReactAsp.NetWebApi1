import { Link, Outlet } from 'react-router-dom'
export default function MainLayout() {
  return (
    <div>
      <header>
        <h1>WEB PC SHOP</h1>
        <h3>Menu</h3>
        <nav>
          <Link to="/">Home</Link> |
          <Link to="/admin">Trang Admin </Link> |
          <Link to="/login">Login</Link> 
        </nav>
        <hr />
      </header>

      <Outlet />

      <hr />
      <footer>© 2026 PC Shop</footer>
    </div>
  )
}