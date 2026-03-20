export default function ArticleList({ articles }) {
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
          <td className="text-center">{bv.noiDungBV}</td>
          <td className="text-center">{bv.maLoaiBV}</td>
          <td className="text-center">{bv.trangThaiBV}</td>
          <td className="text-center">{bv.bvImages}</td>


          <td className="text-center">
            <button className="btn btn-primary">Details</button>{" "}
            <button className="btn btn-danger">Xóa</button>{" "}
            <button className="btn btn-success">Sửa</button>
          </td>
        </tr>
      ))}
    </>
  );
}
