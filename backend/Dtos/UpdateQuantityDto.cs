namespace backend.Dtos
{
    public class UpdateQuantityDto
    {
        public string maSanPham { get; set; } = string.Empty;
        public int MaKhachHang { get; set; }
        public int soLuong { get; set; }
    }
}