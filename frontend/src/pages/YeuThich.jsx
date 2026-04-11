import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteProductCard from '../component/FavoriteProductCard';
import { BASE_URL } from '../api'; // ✅ Đã lùi 1 bước
import { getProduct } from '../api/productAPI'; // ✅ Import đúng hàm getProduct và lùi 1 bước

const YeuThich = () => {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesStr = localStorage.getItem('favorites') || '[]';
      const favItems = JSON.parse(favoritesStr);
      
      // ✅ Bắt chuẩn ID (Phòng hờ backend dùng maSanPham, maSP hay id)
      const favIds = favItems.map(f => f.id || f.maSanPham || f.maSP);
      setFavorites(favItems);

      if (favIds.length > 0) {
        const allProds = await getProduct();
        
        // Lọc sản phẩm khớp ID
        const prods = allProds.filter(p => {
          const pId = p.id || p.maSanPham || p.maSP;
          return favIds.includes(pId);
        });
        setProducts(prods);
      } else {
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Lỗi load favorites:', error);
      setLoading(false);
    }
  };

  const removeFavorite = (productId) => {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    favs = favs.filter(f => {
      const fId = f.id || f.maSanPham || f.maSP;
      return fId !== productId;
    });
    localStorage.setItem('favorites', JSON.stringify(favs));
    
    // Cập nhật lại giao diện ngay lập tức mà không cần load lại API
    setFavorites(favs);
    setProducts(prev => prev.filter(p => {
      const pId = p.id || p.maSanPham || p.maSP;
      return pId !== productId;
    }));
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container my-5" style={{ minHeight: "70vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-primary mb-1">
              <i className="bi bi-heart-fill me-3 text-danger heartbeat-icon"></i>
              Danh Sách Yêu Thích
            </h1>
            <p className="text-muted mb-0">({favorites.length} sản phẩm)</p>
          </div>
          <Link to="/sanpham" className="btn btn-outline-primary">
            <i className="bi bi-shop me-2"></i>Tiếp tục mua sắm
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-5 my-5 bg-light rounded-4 shadow-sm">
            <i className="bi bi-heart display-1 text-muted mb-4"></i>
            <h3 className="fw-bold text-muted mb-3">Chưa có sản phẩm yêu thích</h3>
            <p className="text-muted mb-4">Hãy thêm những sản phẩm bạn thích từ trang sản phẩm!</p>
            <Link to="/sanpham" className="btn btn-primary btn-lg px-5 rounded-pill">
              <i className="bi bi-shop me-2"></i>Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {products.map(product => {
              const pId = product.id || product.maSanPham || product.maSP;
              return (
                <div key={pId} className="col-xl-3 col-lg-4 col-md-6">
                  <FavoriteProductCard 
                    product={product} 
                    isFavorite={true}
                    onRemove={() => removeFavorite(pId)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ Đổi thẻ <style jsx> thành <style> chuẩn */}
      <style>{`
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .heartbeat-icon { animation: heartBeat 2s infinite; }
      `}</style>
    </>
  );
};

export default YeuThich;