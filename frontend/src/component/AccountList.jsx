import { BASE_URL } from "../api";

export default function AccountList({ accounts, onEdit, onDelete }) {
  if (!accounts || accounts.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="text-center">
          Không có tài khoản nào
        </td>
      </tr>
    );
  }

  return (
    <>
      {accounts.map((acc) => (
        <tr key={acc.id_Register}>
          <td className="text-center fw-semibold">{acc.id_Register}</td>

          <td className="text-center">{acc.username}</td>

          <td className="text-center">{acc.email}</td>

          <td className="text-center">
            <span
              className={`badge ${acc.gioiTinh ? "bg-info" : "bg-warning"}`}
            >
              {acc.gioiTinh ? "Nam" : "Nữ"}
            </span>
          </td>

          <td className="text-center">
            {acc.images && (
              <img
                src={`${BASE_URL}/public/imagesAccount/${acc.images}`}
                alt="Account"
                width="70"
                height="70"
                style={{ objectFit: "cover" }}
              />
            )}
          </td>

          <td className="text-center">
            <span
              className={`badge ${
                acc.role === "admin" ? "bg-danger" : acc.role === "leader" ? "bg-success" : acc.role === "manager" ? "bg-warning" :acc.role === "staff" ? "bg-info" : "bg-secondary"
              }`}
            >
              {acc.role}
            </span>
          </td>

          <td className="text-center">
            <button
              className="btn btn-info btn-sm me-2"
              onClick={() => onDetail(acc)}
            >
              Chi tiết
            </button>

            <button
              className="btn btn-success btn-sm me-2"
              disabled={acc.role === "admin"|| acc.role === "manager" || acc.role === "leader" || acc.role === "staff"}
              title={acc.role === "admin" ? "Không thể sửa admin và các chức vụ trong công ty" : ""}
              onClick={() => {
                if (acc.role === "admin"|| acc.role === "manager" || acc.role === "leader" || acc.role === "staff") {
                  alert("Không thể sửa tài khoản admin và các chức vụ trong công ty");
                  return;
                }
                onEdit(acc);
              }}
            >
              Sửa
            </button>

            <button
              className="btn btn-danger btn-sm"
              disabled={acc.role === "admin"|| acc.role === "manager" || acc.role === "leader" || acc.role === "staff"}
              onClick={() => {
                if (acc.role === "admin"|| acc.role === "manager" || acc.role === "leader" || acc.role === "staff") {
                  alert("Không thể xóa tài khoản admin và các chức vụ trong công ty");
                  return;
                }
                onDelete(acc.id_Register, acc.role);
              }}
            >
              Xóa
            </button>
          </td>
        </tr>
      ))}
    </>
  );
}
