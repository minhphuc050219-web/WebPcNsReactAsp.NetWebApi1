function StatusBadge({ value }) {
  const status = (value || "").toLowerCase();
  let className = "bg-secondary";

  if (status.includes("duyệt")) className = "bg-success";
  if (status.includes("từ chối")) className = "bg-danger";
  if (status.includes("chờ")) className = "bg-warning text-dark";

  return <span className={`badge ${className}`}>{value || "Chờ duyệt"}</span>;
}

export default function LeavesStaffList({ leaves, onDetail, onEdit, onDelete }) {
  if (!leaves || leaves.length === 0) {
    return (
      <tr>
        <td className="text-center" colSpan="7">Không có đơn xin nghỉ</td>
      </tr>
    );
  }

  return (
    <>
      {leaves.map((item) => (
        <tr key={item.maLV}>
          <td className="text-center fw-semibold">{item.maLV}</td>
          <td className="text-center">{item.typeLV || "-"}</td>
          <td className="text-center">{item.ngayBD || "-"}</td>
          <td className="text-center">{item.ngayKT || "-"}</td>
          <td className="text-center"><StatusBadge value={item.trangThai} /></td>
          <td className="text-center text-truncate" style={{ maxWidth: 260 }}>{item.lyDo || "-"}</td>
          <td className="text-center">
            <button
              className="btn btn-info btn-sm me-2"
              onClick={() => onDetail(item)}
            >
              Chi tiết
            </button>
            <button className="btn btn-success btn-sm me-2" onClick={() => onEdit(item)}>
              Sửa
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.maLV)}>
              Xóa
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
