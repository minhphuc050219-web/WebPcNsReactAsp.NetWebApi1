function StatusBadge({ value }) {
  const status = (value || "").toLowerCase();
  let className = "bg-secondary";

  if (status.includes("duyệt")) className = "bg-success";
  if (status.includes("từ chối")) className = "bg-danger";
  if (status.includes("chờ")) className = "bg-warning text-dark";

  return <span className={`badge ${className}`}>{value || "Chờ duyệt"}</span>;
}

export default function LeavesManagerList({ leaves, onDetail, onApprove, onReject }) {
  if (!leaves || leaves.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          Không có đơn xin nghỉ
        </td>
      </tr>
    );
  }

  return (
    <>
      {leaves.map((item) => (
        <tr key={item.maLV}>
          <td className="text-center">{item.maNV}</td>
          <td className="text-center">{item.tenNV || item.nhanVien?.tenNV || "-"}</td>
          <td className="text-center">
            <StatusBadge value={item.trangThai} />
          </td>
          <td className="text-center text-truncate" style={{ maxWidth: 220 }}>
            {item.typeLV || "-"}
          </td>
          <td className="text-center">
            <button className="btn btn-info btn-sm me-2" onClick={() => onDetail(item)}>
              Chi tiết
            </button>
            <button className="btn btn-success btn-sm me-2" onClick={() => onApprove(item.maLV)}>
              Duyệt
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onReject(item.maLV)}>
              Từ chối
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
