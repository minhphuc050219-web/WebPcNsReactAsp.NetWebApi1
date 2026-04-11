import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../api';

const FavoriteProductCard = ({ product, isFavorite, onRemove }) => {
  const formatMoney = (value) => {
    return Number(value).toLocaleString('vi-VN') + ' đ';
  };

  // Bắt chuẩn mã sản phẩm
  const productId = product.maSanPham || product.id || product.maSP;

  // Hàm xử lý ảnh cực chuẩn chống gãy hình
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/images/placeholder.png";
    if (imgPath.startsWith("http") || imgPath.startsWith("/")) return imgPath;
    return `${BASE_URL}/public/imagesProduct/${imgPath}`;
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn sự kiện click lan truyền
    if (window.confirm(`Bạn có chắc muốn xóa "${product.tenSanPham}" khỏi danh sách yêu thích?`)) {
      if (onRemove) onRemove(productId);
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm fav-card-hover">
      <div className="position-relative overflow-hidden bg-light rounded-top">
        
        {/* NÚT XÓA SIÊU TO KHỔNG LỒ NỔI LÊN TRÊN ẢNH */}
        <button 
          className="position-absolute top-0 end-0 m-2 btn btn-danger rounded-circle shadow-sm remove-fav-btn d-flex align-items-center justify-content-center"
          onClick={handleRemove}
          title="Xóa khỏi yêu thích"
          style={{ width: '40px', height: '40px', zIndex: 10 }}
        >
          <i className="bi bi-trash3-fill"></i>
        </button>

        <img 
          src={getImageUrl(product.hangHoaImages)}
          className="card-img-top p-3"
          alt={product.tenSanPham}
          style={{ height: '220px', objectFit: 'contain' }}
          onError={(e) => {
            e.target.src = "/images/placeholder.png";
          }}
        />

        {/* Nhãn trạng thái */}
        <div className="position-absolute bottom-0 start-0 m-2">
          {product.soLuong > 0 ? (
            <span className="badge bg-success shadow-sm">
               <i className="bi bi-check-circle me-1"></i> Còn hàng
            </span>
          ) : (
            <span className="badge bg-danger shadow-sm">
               <i className="bi bi-x-circle me-1"></i> Hết hàng
            </span>
          )}
        </div>
      </div>

      <div className="card-body p-3 d-flex flex-column">
        {/* Tên SP giới hạn 2 dòng */}
        <h6 
          className="card-title fw-bold mb-2" 
          title={product.tenSanPham}
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '42px' }}
        >
          {product.tenSanPham}
        </h6>
        
        <div className="d-flex justify-content-between align-items-end mb-3 mt-auto">
          <span className="fs-5 fw-bold text-danger">{formatMoney(product.donGia)}</span>
          <small className="text-muted">Kho: {product.soLuong || 0}</small>
        </div>

        <Link 
          to={`/sanpham/${productId}`} 
          className="btn btn-outline-primary w-100 fw-bold"
        >
          <i className="bi bi-cart-plus me-2"></i>Xem chi tiết
        </Link>
      </div>

      {/* CSS THUẦN (Không dùng style jsx để tránh lỗi) */}
      <style>{`
        .fav-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .fav-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .remove-fav-btn {
          opacity: 0.8;
          transition: all 0.2s;
        }
        .fav-card-hover:hover .remove-fav-btn {
          opacity: 1;
        }
        .remove-fav-btn:hover {
          transform: scale(1.15);
          background-color: #dc3545 !important; /* Đỏ rực lên khi trỏ chuột */
        }
      `}</style>
    </div>
  );
};

export default FavoriteProductCard;