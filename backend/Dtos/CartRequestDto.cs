namespace backend.Dtos
{
    public class AddToCartDto
    {
        public int MaKhachHang { get; set; } // Khách nào mua
        public string MaSanPham { get; set; } // Mua con hàng gì
        public int SoLuong { get; set; } // Mấy cái
        public decimal DonGia { get; set; } // Giá bao nhiêu
    }
}