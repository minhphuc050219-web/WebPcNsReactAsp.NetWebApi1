export default function BrandList({ brands, onEdit, onDelete }) {
  if (!brands || brands.length === 0) {
    return (
      <tr>
        <td colSpan="4" className="text-center">
          Không có brand nào
        </td>
      </tr>
    );
  }
  return (
    <>
      {brands.map((item) => (
        <tr key={item.maBrand}>
          <td className="text-center fw-semibold">{item.maBrand}</td>
          <td className="text-center">{item.tenBrand}</td>
          <td className="text-center">
            <img
              src={`http://localhost:5226/public/imagesBrand/${item.brandImages}`}
              alt=""
              width="80"
            />
          </td>
          
          <td className="text-center">
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={() => onDelete(item.maBrand)}
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
