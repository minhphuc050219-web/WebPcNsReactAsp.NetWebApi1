namespace backend.Dtos
{
    public class UserOrdersDto
    {
        public int MaDonHang { get; set; }
        public DateTime NgayDat { get; set; }
        public decimal TongTien { get; set; }
        public string TrangThai { get; set; }
        public string VnpTransactionNo { get; set; }
        public int SoSanPham { get; set; }
        public string SanPhamDau { get; set; }
    }

    public class CreateOrderDto
    {
        public string MaKhachHang { get; set; } = string.Empty;
        public double TongTien { get; set; }
        public string? VnpTransactionNo { get; set; }
        public string? PhuongThucThanhToan { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; } = new();
    }

    public class OrderDetailDto
    {
        public string MaSanPham { get; set; } = string.Empty;
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; }
    }
}
