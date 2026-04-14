import { BASE_URL } from "../api";

function StatusBadge({ value }) {
  const status = (value || "").toLowerCase();
  let className = "bg-secondary";

  if (status.includes("duyệt")) className = "bg-success";
  if (status.includes("từ chối")) className = "bg-danger";
  if (status.includes("chờ")) className = "bg-warning text-dark";

  return <span className={`badge ${className}`}>{value || "Chờ duyệt"}</span>;
}

export default function LeavesStaffDetail({ show, onClose, leave }) {
  if (!show || !leave) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Chi tiết đơn xin nghỉ #{leave.maLV}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6"><strong>Mã nhân viên:</strong> {leave.maNV}</div>
              <div className="col-md-6"><strong>Loại nghỉ:</strong> {leave.typeLV || "-"}</div>
              <div className="col-md-6"><strong>Ngày bắt đầu:</strong> {leave.ngayBD || "-"}</div>
              <div className="col-md-6"><strong>Ngày kết thúc:</strong> {leave.ngayKT || "-"}</div>
              <div className="col-md-12"><strong>Trạng thái:</strong> <StatusBadge value={leave.trangThai} /></div>
              <div className="col-md-12">
                <strong>Lý do:</strong>
                <div className="border rounded p-2 mt-1 bg-light" style={{ minHeight: 80 }}>
                  {leave.lyDo || "Không có"}
                </div>
              </div>
              <div className="col-md-12">
                <strong>Minh chứng:</strong>
                <div className="mt-2">
                  {leave.imagesLV ? (
                    <img
                      src={`${BASE_URL}/public/imagesLeaves/${leave.imagesLV}`}
                      alt="Leave proof"
                      style={{ maxWidth: "100%", maxHeight: 320, objectFit: "contain" }}
                    />
                  ) : (
                    <span>Không có hình ảnh</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
}
