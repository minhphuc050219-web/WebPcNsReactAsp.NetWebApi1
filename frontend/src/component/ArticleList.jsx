import { BASE_URL } from "../api";
export default function ArticleList({ articles, articlecategories = [], onEdit, onDelete, onDetail }) {
    // Helper function to get category name from code
    const getArticleCategoryName = (maLoaiBV) => {
    if (!maLoaiBV) return "N/A";
    const articlecategory = articlecategories.find((cat) => cat.maLoaiBV === maLoaiBV);
    return articlecategory ? articlecategory.tenLoaiBV : maLoaiBV;
  };

     if (!articles || articles.length === 0) {
    return <p>Không có article nào</p>;
  }
  return (
    <>
      {articles.map((bv) => (
        <tr key={bv.maBV}>
          <td className="text-center fw-semibold">{bv.maBV}</td>
          <td className="text-center">{bv.tenBV}</td>
          <td className="text-center">{bv.tomTatBV}</td>
          <td className="text-center">
            <span className="badge bg-success">{getArticleCategoryName(bv.maLoaiBV)}</span>
          </td>
          <td className="text-center">
            {bv.bvImages && (
              <img
                src={`${BASE_URL}/public/imagesArticle/${bv.bvImages}`}
                alt="Article"
                width="80"
                height="80"
                style={{ objectFit: "cover" }}
              />
            )}
          </td>


          <td className="text-center">
            <button
              className="btn btn-info btn-sm me-2"
              onClick={() => onDetail(bv)}
              title="Xem chi tiết"
            >
              Chi Tiết
            </button>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => onEdit(bv)}
              title="Sửa"
            >
              Sửa
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(bv.maBV)}
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
