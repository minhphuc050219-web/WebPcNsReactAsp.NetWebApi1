export default function ProductList({ products }) {
     if (!products || products.length === 0) {
    return <p>Không có product nào</p>;
  }
  return (
    <>
      {products.map((sp) => (
        <tr key={sp.maSanPham}>
          <td className="text-center fw-semibold">{sp.maSanPham}</td>
          <td className="text-center">{sp.tenSanPham}</td>
          <td className="text-center">{sp.soLuong}</td>
          <td className="text-center">{sp.donGia}</td>
          <img
              src={`http://localhost:5226/public/imagesProduct/${sp.hangHoaImages}`}
              alt=""
              width="80"
            />
          <td className="text-center">{sp.ngayNhap}</td>
          <td className="text-center">{sp.hanBaoHanh}</td>
          <td className="text-center">{sp.shortDescription}</td>
          <td className="text-center">{sp.description}</td>
          <td className="text-center">{sp.maLoai}</td>
          <td className="text-center">{sp.maBrand}</td>

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
