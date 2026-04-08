import { BASE_URL } from "../api";
export default function StaffList({
  staffs,
  departments = [],
  onEdit,
  onDelete,
  onDetail,
}) {
  // Helper function to get department name from code
  const getDepartmentName = (maPhongBan) => {
    if (!maPhongBan) return "N/A";
    const department = departments.find(
      (dept) => dept.maPhongBan === maPhongBan,
    );
    return department ? department.tenPhongBan : maPhongBan;
  };

  if (!staffs || staffs.length === 0) {
    return (
      <tr>
        <td colSpan="8" className="text-center">
          Không có nhân viên nào
        </td>
      </tr>
    );
  }
  return (
    <>
      {staffs.map((nv) => (
        <tr key={nv.maNV}>
          <td className="text-center fw-semibold">{nv.maNV}</td>
          <td className="text-center">{nv.tenNV}</td>
          <td className="text-center">
            <span className={`badge ${nv.gioiTinh ? "bg-info" : "bg-warning"}`}>
              {nv.gioiTinh ? "Nam" : "Nữ"}
            </span>
          </td>
          <td className="text-center text-danger fw-bold">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(nv.luongCoBan)}
          </td>
          <td className="text-center">
            {nv.nvImages && (
              <img
                src={`${BASE_URL}/public/imagesStaff/${nv.nvImages}`}
                alt="Staff"
                width="80"
                height="80"
                style={{ objectFit: "cover" }}
              />
            )}
          </td>
          <td className="text-center">
            <span className="badge bg-primary">
              {getDepartmentName(nv.maPhongBan)}
            </span>
          </td>
          <td className="text-center">
            {/* <span className={`badge ${nv.role ? "bg-success" : "bg-info"}`}>
              {nv.role ? "admin" : "user"}
            </span>} */}
            <span className={`badge ${nv.role === "admin" ? "bg-danger" : nv.role === "leader" ? "bg-success" :nv.role === "manager" ? "bg-warning" : "bg-info"}`}>
              {nv.role === "admin" ? "admin" : nv.role === "manager" ? "manager" : nv.role === "leader" ? "leader" : "staff"}
            </span>
          </td>
          <td className="text-center">
            <button
              className="btn btn-info btn-sm me-2"
              onClick={() => onDetail(nv)}
              title="Xem chi tiết"
            >
              Chi Tiết
            </button>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => onEdit(nv)}
              title="Sửa"
            >
              Sửa
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(nv.maNV)}
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
