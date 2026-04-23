namespace backend.Dtos
{
    public class PaymentRequestDto
    {
        public decimal Amount { get; set; }
        public string OrderInfo { get; set; }
        public int MaKhachHang { get; set; }
    }
}