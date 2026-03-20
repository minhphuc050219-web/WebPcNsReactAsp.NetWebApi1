export default function SalaryList({salarys}){
    if(!salarys || salarys.length === 0){
        return (
      <tr>
        <td colSpan="4" className="text-center">
          Không có salary nào
        </td>
      </tr> 
    );
    }
    return (
    <>
      {salarys.map((lg) => (
        <tr key={lg.maLuong}>
          <td className="text-center fw-semibold">{lg.maLuong}</td>
          <td className="text-center fw-semibold">{lg.maNV}</td>
          <td className="text-center">{lg.thang}</td>
          <td className="text-center">{lg.nam}</td>
          <td className="text-center">{lg.soNgayCong}</td>
          <td className="text-center">{lg.tongLuong}</td>

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