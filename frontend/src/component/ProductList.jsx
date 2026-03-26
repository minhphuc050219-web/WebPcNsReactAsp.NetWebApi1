import { BASE_URL } from "../api";
export default function ProductList({
  products,
  categories = [],
  brands = [],
  onEdit,
  onDelete,
  onDetail,
}) {
  // Helper function to get category name from code
  const getCategoryName = (maLoai) => {
    if (!maLoai) return "N/A";
    const category = categories.find((cat) => cat.maLoai === maLoai);
    return category ? category.tenLoai : maLoai;
  };

  // Helper function to get brand name from code
  const getBrandName = (maBrand) => {
    if (!maBrand) return "N/A";
    const brand = brands.find((b) => b.maBrand === maBrand);
    return brand ? brand.tenBrand : maBrand;
  };

  if (!products || products.length === 0) {
    return (
      <tr>
        <td colSpan="9" className="text-center">
          Không có sản phẩm nào
        </td>
      </tr>
    );
  }
  return (
    <>
      {products.map((sp) => (
        <tr key={sp.maSanPham}>
          <td className="text-center fw-semibold">{sp.maSanPham}</td>
          <td className="text-center">{sp.tenSanPham}</td>
          <td className="text-center text-danger fw-bold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(sp.donGia)}
          </td>
          <td className="text-center">
            {sp.hangHoaImages && (
              <img
                src={`${BASE_URL}/public/imagesProduct/${sp.hangHoaImages}`}
                alt="Product"
                width="80"
                height="80"
                style={{ objectFit: "cover" }}
              />
            )}
          </td>
          <td className="text-center">{sp.shortDescription}</td>
          <td className="text-center">
            <span className="badge bg-primary">
              {getCategoryName(sp.maLoai)}
            </span>
          </td>
          <td className="text-center">
            <span className="badge bg-success">{getBrandName(sp.maBrand)}</span>
          </td>
          <td className="text-center">
            <button
              className="btn btn-info btn-sm me-2"
              onClick={() => onDetail(sp)}
              title="Xem chi tiết"
            >
              Chi Tiết
            </button>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => onEdit(sp)}
              title="Sửa"
            >
              Sửa
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(sp.maSanPham)}
              title="Xóa"
            >
              Xóa
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
