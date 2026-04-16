using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class orderdetail
    {
        [Key]
        public int MaChiTietDonHang { get; set; }

        public int MaDonHang { get; set; }

        public string MaSanPham { get; set; }

        public int SoLuong { get; set; }

public decimal DonGia { get; set; }

        // Navigation properties
        [ForeignKey("MaDonHang")]
        public order Order { get; set; }

    }
}