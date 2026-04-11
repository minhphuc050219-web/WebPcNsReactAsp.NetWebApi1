import { BASE_URL } from "../api";
export default function CategoryList({ categories, onEdit, onDelete }) {
  // Ensure categories is always an array
  const categoryList = Array.isArray(categories) ? categories : [];

  if (!categoryList || categoryList.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          Không có category nào
        </td>
      </tr>
    );
  }
  return (
    <>
      {categoryList.map((item) => (
        <tr key={item.maLoai}>
          <td className="text-center fw-semibold">{item.maLoai}</td>
          <td className="text-center">{item.tenLoai}</td>
          <td className="text-center">
            {item.loaiImages && (
              <img
                src={`${BASE_URL}/public/imagesCategory/${item.loaiImages}`}
                alt={item.tenLoai}
                width="80"
              />
            )}
          </td>
          <td className="text-center">
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={() => onDelete(item.maLoai)}
            >
              Xóa
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => onEdit(item)}
            >
              Sửa
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}