export default function ArticleCategoryList({ articlecategorys }) {
     if (!articlecategorys || articlecategorys.length === 0) {
    return <p>Không có article category nào</p>;
  }
  return (
    <>
      {articlecategorys.map((bv) => (
        <tr key={bv.maLoaiBV}>
          <td className="text-center fw-semibold">{bv.maLoaiBV}</td>
          <td className="text-center">{bv.tenLoaiBV}</td>
          <td className="text-center">{bv.thuTuBV}</td>


          <td className="text-center">
            <button className="btn btn-danger">Xóa</button>{" "}
            <button className="btn btn-success">Sửa</button>
          </td>
        </tr>
      ))}
    </>
    
  );
}
