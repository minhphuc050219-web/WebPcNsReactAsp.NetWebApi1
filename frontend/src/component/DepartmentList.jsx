export default function DepartmentList({departments, onEdit, onDelete}){
    // Ensure departments is always an array
    const departmentList = Array.isArray(departments) ? departments : [];
    
    if(!departmentList || departmentList.length === 0){
        return (
      <tr>
        <td colSpan="4" className="text-center">
          Không có department nào
        </td>
      </tr> 
    );
    }
    return (
    <>
      {departmentList.map((dp) => (
        <tr key={dp.maPhongBan}>
          <td className="text-center fw-semibold">{dp.maPhongBan}</td>
          <td className="text-center">{dp.tenPhongBan}</td>
          <td className="text-center">{dp.soLuongNV}</td>

          <td className="text-center">
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={() => onDelete(dp.maPhongBan)}
            >
              Xóa
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => onEdit(dp)}
            >
              Sửa
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}