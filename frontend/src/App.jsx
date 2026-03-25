/*router*/
import { Routes, Route } from 'react-router-dom'
/*layout*/
import Weblayout from './layout/Weblayout'
import AdminLayout from './layout/Adminlayout'
/*web*/
import Home from './pages/Home'
import SanPham from './pages/SanPham'
import Login  from './pages/Login'
import Register from './pages/Register'
import ThuongHieu from './pages/ThuongHieu'
import LoaiSP from './pages/LoaiSP'
import LoaiBV from './pages/LoaiBV'
import BaiViet from './pages/BaiViet'
import GioHang from './pages/GioHang'
/*admin*/
import Dashboard from './admin/Dashboard'
import Brand from './admin/Brand'
import Category from './admin/Category'
import Product from './admin/Product'
import Staff from './admin/Staff'
import Salary from './admin/Salary'
import Timekeeping from './admin/Timekeeping'
import Department from './admin/Department'
import Account from './admin/Account'
import ActicleCategory from './admin/ArticleCategory'
import Article from './admin/Article'
import Cart from './admin/CartTemp'
import CartDetail from './admin/CartDetail'


function App() {
  return (
    <Routes>
      {/* Web */}
      <Route element={<Weblayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/thuonghieu" element={<ThuongHieu/>} />
        <Route path="/loaisp" element={<LoaiSP/>} />
        <Route path="/sanpham" element={<SanPham />} />
        <Route path="/loaibv" element={<LoaiBV />} />
        <Route path="/baiviet" element={<BaiViet />} />
        <Route path="/giohang" element={<GioHang />} />
        
      </Route>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout/>}>
        <Route index element={<Dashboard />} />
        <Route path="/admin/brand" element={<Brand />} />
        <Route path="/admin/category" element={<Category />} />
        <Route path="/admin/product" element={<Product />} />
        <Route path="/admin/staff" element={<Staff />} />
        <Route path="/admin/salary" element={<Salary />} />
        <Route path="/admin/timekp" element={<Timekeeping />} />
        <Route path="/admin/phongban" element={<Department />} />
        <Route path="/admin/account" element={<Account />} />
        <Route path="/admin/artcategory" element={<ActicleCategory />} />
        <Route path="/admin/article" element={<Article />} />
        <Route path="/admin/cart" element={<Cart />} />
        <Route path="/admin/cartdetail" element={<CartDetail />} />

      </Route>

    </Routes>
  )
}
export default App;