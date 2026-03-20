export default function StaffList({ staffs }) {
     if (!staffs || staffs.length === 0) {
    return <p>Không có staff nào</p>;
  }
  return (
    <>
      {staffs.map((nv) => (
        <tr key={nv.maNV}>
          <td className="text-center fw-semibold">{nv.maNV}</td>
          <td className="text-center">{nv.tenNV}</td>
          <td className="text-center">{nv.diaChi}</td>
          <td className="text-center">{nv.sdt}</td>
          <td className="text-center">{nv.gioiTinh}</td>
          <td className="text-center">{nv.luongCoBan}</td>
          <td className="text-center">{nv.nvImages}</td>
          <td className="text-center">{nv.email}</td>
          <td className="text-center">{nv.password}</td>
          <td className="text-center">{nv.maPhongBan}</td>
          <td className="text-center">{nv.role}</td>

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
