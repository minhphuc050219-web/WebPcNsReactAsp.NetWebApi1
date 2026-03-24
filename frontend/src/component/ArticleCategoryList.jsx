export default function ArticleCategoryList({
  articlecategorys,
  onEdit,
  onDelete,
}) {
  // Ensure departments is always an array
  const articlecategoryList = Array.isArray(articlecategorys)
    ? articlecategorys
    : [];
  if (!articlecategoryList || articlecategoryList.length === 0) {
    return (
      <tr>
        <td colSpan="4" className="text-center">
          Không có article category nào
        </td>
      </tr>
    );
  }
  return (
    <>
      {articlecategoryList.map((bv) => (
        <tr key={bv.maLoaiBV}>
          <td className="text-center fw-semibold">{bv.maLoaiBV}</td>
          <td className="text-center">{bv.tenLoaiBV}</td>
          <td className="text-center">{bv.thuTuBV}</td>

          <td className="text-center">
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={() => onDelete(bv.maLoaiBV)}
            >
              Xóa
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => onEdit(bv)}
            >
              Sửa
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
