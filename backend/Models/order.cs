using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class order
    {
        [Key]
        public int MaDonHang { get; set; }

        [Required]
        public int MaKhachHang { get; set; } // ForeignKey tới register

        [Required]
        public DateTime NgayDat { get; set; }

public decimal TongTien { get; set; }

        public string TrangThai { get; set; } = "Chờ xác nhận"; // Chờ xác nhận, Đã thanh toán, Đã giao, Hủy

        public string VnpTransactionNo { get; set; } // Mã VNPAY

        public string PhuongThucThanhToan { get; set; } = "VNPAY";

        // Navigation property
        [ForeignKey("MaKhachHang")]
// [ForeignKey("MaKhachHang")]
// public register KhachHang { get; set; }

        // 1 Order có nhiều OrderDetail
        public List<int> OrderDetailIds { get; set; } = new List<int>();
    }
}

