import { Link } from 'react-router-dom'
export default function Home() {
  return (
     <div>
      <h2>Đây là trang chủ</h2>
      <nav>
        <Link to="/thuonghieu">Xem thương hiệu</Link> |
        <Link to="/loaisp">Xem loại sản phẩm</Link> |
        <Link to="/sanpham">Xem sản phẩm</Link> |
        <Link to="/loaibv">Xem loai bai viet</Link> |
        <Link to="/baiviet">Xem bai viet</Link> | 
        <Link to="/giohang">Xem gio hang</Link> 
      </nav>
      
    </div>
  )
}