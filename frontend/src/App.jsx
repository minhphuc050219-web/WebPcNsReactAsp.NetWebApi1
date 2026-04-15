/*router*/
import { Routes, Route } from 'react-router-dom'
/*layout*/
import Weblayout from './layout/Weblayout'
import AdminLayout from './layout/Adminlayout'
/*auth*/
// AuthProvider: bao bọc toàn app, cung cấp trạng thái đăng nhập cho mọi component
import { AuthProvider } from './context/AuthContext'
// ProtectedRoute: chặn route không cho phép vào nếu không đủ quyền
import ProtectedRoute from './component/ProtectedRoute'
/*web*/
import Home from './pages/Home'
import SanPham from './pages/SanPham'
import ProductDetail from './pages/ProductDetail'
import CategoryProducts from './pages/CategoryProducts'
import Login  from './pages/Login'
import Register from './pages/Register'
import ThuongHieu from './pages/ThuongHieu'
import LoaiSP from './pages/LoaiSP'
import LoaiBV from './pages/LoaiBV'
import CategoryArticles from './pages/CategoryArticles'
import BaiViet from './pages/BaiViet'
import ArticleDetail from './pages/ArticleDetail'
import GioHang from './pages/GioHang'
import YeuThich from './pages/YeuThich'
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
import LeavesManager from './admin/LeavesManager'
import LeavesStaff from './admin/LeavesStaff'
import KetQuaThanhToan from './pages/KetQuaThanhToan'
import OrderHistory from './pages/OrderHistory'
import OrderDetail from './pages/OrderDetail' // Tạo sau


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Web - ai cũng vào được */}
        <Route element={<Weblayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/thuonghieu" element={<ThuongHieu/>} />
          <Route path="/loaisp" element={<LoaiSP/>} />
          <Route path="/loaisp/:categoryId" element={<CategoryProducts/>} />
          <Route path="/sanpham" element={<SanPham />} />
          <Route path="/sanpham/:id" element={<ProductDetail />} />
          <Route path="/loaibv" element={<LoaiBV />} />
          <Route path="/loaibv/:categoryId" element={<CategoryArticles/>} />
          <Route path="/baiviet/:id" element={<ArticleDetail />} />
          <Route path="/baiviet" element={<BaiViet />} />
          <Route path="/baiviet/:id" element={<ArticleDetail />} />
          <Route path="/giohang" element={<GioHang />} />
          <Route path="/yeuthich" element={<YeuThich />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/vnpay-return" element={<KetQuaThanhToan />} />
        </Route>

        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* Admin - chỉ admin/manager/staff/leader vào được */}
        {/* Nếu user thường cố vào /admin → tự động redirect về / */}
        {/* Nếu chưa đăng nhập cố vào /admin → redirect về /login */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/admin/brand" element={<Brand />} />
          <Route path="/admin/category" element={<Category />} />
          <Route path="/admin/product" element={<Product />} />
          <Route path="/admin/staff" element={<Staff />} />
          <Route path="/admin/salary" element={<Salary />} />
          <Route path="/admin/leaves" element={<LeavesManager />} />
          <Route path="/admin/leaves-staff" element={<LeavesStaff />} />
          <Route path="/admin/timekp" element={<Timekeeping />} />
          <Route path="/admin/phongban" element={<Department />} />
          <Route path="/admin/account" element={<Account />} />
          <Route path="/admin/artcategory" element={<ActicleCategory />} />
          <Route path="/admin/article" element={<Article />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
export default App;