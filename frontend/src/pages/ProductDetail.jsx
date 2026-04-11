import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// Đã xóa 1 dòng import BASE_URL bị trùng
import { BASE_URL } from "../api";
import { getProduct } from "../api/productAPI";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // ✅ THÊM STATE ĐỂ QUẢN LÝ NÚT YÊU THÍCH
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct();
        
        let foundProduct = null;
        
        if (Array.isArray(data)) {
          foundProduct = data.find(p => String(p.maSanPham) === String(id));
        }
        
        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
          setQuantity(1);

          // Kiểm tra xem sản phẩm này đã có trong danh sách yêu thích chưa
          const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
          const isFav = favs.some(f => String(f.id || f.maSanPham) === String(foundProduct.maSanPham));
          setIsFavorite(isFav);

          if (Array.isArray(data)) {
            const related = data.filter(
              p => p.maLoai === foundProduct.maLoai && p.maSanPham !== foundProduct.maSanPham
            ).slice(0, 4);
            setRelatedProducts(related);
          }

        } else {
          setError("Sản phẩm không tồn tại. Mã SP: " + id);
          setProduct(null);
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Không thể tải sản phẩm");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      const cartItem = {
        id: product.maSanPham,
        name: product.tenSanPham,
        price: product.donGia,
        image: product.hangHoaImages,
        quantity: quantity,
      };
      
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = existingCart.find(item => item.id === product.maSanPham);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }
      
      localStorage.setItem("cart", JSON.stringify(existingCart));
      alert("Thêm giỏ hàng thành công!");
    }
  };

  // ✅ THÊM HÀM XỬ LÝ KHI BẤM NÚT YÊU THÍCH
  const toggleFavorite = () => {
    if (!product) return;
    
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const pId = product.maSanPham;

    if (isFavorite) {
      // Xóa khỏi danh sách
      favs = favs.filter(f => String(f.id || f.maSanPham) !== String(pId));
      setIsFavorite(false);
      alert("Đã xóa khỏi danh sách yêu thích!");
    } else {
      // Thêm vào danh sách (Lưu đủ thông tin để trang YeuThich hiển thị)
      favs.push({
        id: pId,
        maSanPham: pId,
        tenSanPham: product.tenSanPham,
        donGia: product.donGia,
        hangHoaImages: product.hangHoaImages
      });
      setIsFavorite(true);
      alert("Đã thêm vào danh sách yêu thích!");
    }
    
    localStorage.setItem('favorites', JSON.stringify(favs));
  };

  const handleQuantityChange = (value) => {
    const newQty = parseInt(value) || 1;
    if (newQty > 0 && newQty <= (product?.soLuong || 1)) {
      setQuantity(newQty);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4>Lỗi!</h4>
        <p>{error || "Sản phẩm không tồn tại"}</p>
        <button className="btn btn-primary" onClick={() => navigate("/sanpham")}>
          ← Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div className="bg-light py-5">
      <div className="container">
        {/* BACK BUTTON */}
        <button
          className="btn btn-outline-secondary btn-sm mb-4"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại
        </button>

        <div className="row">
          {/* PRODUCT IMAGE */}
          <div className="col-md-5 mb-4">
            <div className="bg-white rounded shadow p-4">
              <img
                src={
                  product.hangHoaImages
                    ? product.hangHoaImages.startsWith("http")
                      ? product.hangHoaImages
                      : `${BASE_URL}/public/imagesProduct/${product.hangHoaImages}`
                    : "/images/placeholder.png"
                }
                alt={product.tenSanPham}
                className="img-fluid rounded"
                style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "/images/placeholder.png";
                }}
              />
              
              <div className="mt-3">
                {product.soLuong > 0 ? (
                  <span className="badge bg-success fs-6">
                    <i className="bi bi-check-circle me-2"></i> SẴN HÀNG
                  </span>
                ) : (
                  <span className="badge bg-danger fs-6">
                    <i className="bi bi-x-circle me-2"></i> HẾT HÀNG
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h6 className="fw-bold mb-2">Thông tin nhanh:</h6>
                <ul className="list-unstyled small">
                  <li className="mb-2"><i className="bi bi-box text-primary me-2"></i><strong>Mã SP:</strong> {product.maSanPham}</li>
                  <li className="mb-2"><i className="bi bi-boxes text-success me-2"></i><strong>Tồn kho:</strong> {product.soLuong} cái</li>
                  <li className="mb-2"><i className="bi bi-shield-check text-info me-2"></i><strong>Bảo hành:</strong> {product.hanBaoHanh || 12} tháng</li>
                  <li><i className="bi bi-calendar text-warning me-2"></i><strong>Ngày nhập:</strong> {product.ngayNhap ? new Date(product.ngayNhap).toLocaleDateString("vi-VN") : "N/A"}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="col-md-7">
            <div className="bg-white rounded shadow p-4 mb-4">
              <h2 className="fw-bold text-primary mb-3">{product.tenSanPham}</h2>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="text-warning">
                    <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-fill"></i> <i className="bi bi-star-half"></i>
                  </div>
                  <span className="ms-2 text-muted">(4.5/5 - 128 đánh giá)</span>
                </div>
              </div>

              <hr />

              <div className="mb-4">
                <p className="text-muted mb-2">Giá bán:</p>
                <h3 className="text-danger fw-bold">
                  {product.donGia?.toLocaleString("vi-VN") || "0"} đ
                </h3>
              </div>

              {product.shortDescription && (
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="fw-bold mb-2">Mô tả ngắn:</h6>
                  <p className="mb-0">{product.shortDescription}</p>
                </div>
              )}

              {product.description && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Chi tiết sản phẩm:</h6>
                  <p className="text-muted">{product.description}</p>
                </div>
              )}

              <hr />

              <div className="mb-4">
                <label className="form-label fw-bold">Số lượng:</label>
                <div className="input-group" style={{ width: "150px" }}>
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.soLuong <= 0}>-</button>
                  <input type="number" className="form-control text-center" value={quantity} onChange={(e) => handleQuantityChange(e.target.value)} disabled={product.soLuong <= 0} min="1" max={product.soLuong} />
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setQuantity(Math.min(product.soLuong, quantity + 1))} disabled={product.soLuong <= 0}>+</button>
                </div>
                <small className="d-block mt-2 text-muted">Tối đa: {product.soLuong} cái</small>
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-danger btn-lg" onClick={handleAddToCart} disabled={product.soLuong <= 0}>
                  <i className="bi bi-cart-plus me-2"></i> THÊM VÀO GIỎ HÀNG
                </button>

                <button 
                  className={`btn btn-lg w-100 rounded-pill ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={toggleFavorite}
                >
                  <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                  {isFavorite ? 'Đã yêu thích' : 'THÊM VÀO YÊU THÍCH'}
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS THẬT TỪ DATABASE */}
        <div className="mt-5">
          <h4 className="fw-bold mb-4">🔗 Sản phẩm liên quan cùng danh mục</h4>
          <div className="row">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((rp) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={rp.maSanPham}>
                  <div className="card shadow-sm border-0 h-100 d-flex flex-column">
                    <img
                      src={
                        rp.hangHoaImages
                          ? rp.hangHoaImages.startsWith("http")
                            ? rp.hangHoaImages
                            : `${BASE_URL}/public/imagesProduct/${rp.hangHoaImages}`
                          : "/images/placeholder.png"
                      }
                      className="card-img-top p-3"
                      alt={rp.tenSanPham}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                    <div className="card-body p-3 d-flex flex-column">
                      <h6 
                        className="small fw-bold mb-2" 
                        title={rp.tenSanPham}
                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {rp.tenSanPham}
                      </h6>
                      <p className="text-danger fw-bold mb-3">{rp.donGia?.toLocaleString("vi-VN")} đ</p>
                      
                      <div className="mt-auto">
                        <Link to={`/sanpham/${rp.maSanPham}`} className="btn btn-primary btn-sm w-100">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">Chưa có sản phẩm liên quan nào cùng danh mục.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}