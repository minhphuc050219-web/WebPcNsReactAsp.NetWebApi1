using Microsoft.AspNetCore.Mvc;
using backend.Helpers; 
using backend.Dtos;
using backend.Data;
using backend.Models;
using System.Text;
using System.Web;
using System.Linq;
using System.Net;
using System.Threading.Tasks;





namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;



public PaymentController(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }


        [HttpPost("create-payment-url")]
public IActionResult CreatePaymentUrl([FromBody] PaymentRequestDto model)
        {
            var vnpay = new VnPayLibrary(); 
            
            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            
            vnpay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"] ?? "");
            
            vnpay.AddRequestData("vnp_Amount", (model.Amount * 100).ToString()); 
            
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1");
            vnpay.AddRequestData("vnp_Locale", "vn");
            
            vnpay.AddRequestData("vnp_OrderInfo", model.OrderInfo ?? "Thanh toan don hang");
            
            vnpay.AddRequestData("vnp_OrderType", "other");
            
            vnpay.AddRequestData("vnp_ReturnUrl", _configuration["Vnpay:ReturnUrl"] ?? "");
            
            vnpay.AddRequestData("vnp_TxnRef", DateTime.Now.Ticks.ToString()); 

            // Thêm ID khách hàng để backend tạo order sau thanh toán
            vnpay.AddRequestData("vnp_CustomerId", model.MaKhachHang.ToString()); 

            string baseUrl = _configuration["Vnpay:BaseUrl"] ?? "";
            string hashSecret = _configuration["Vnpay:HashSecret"] ?? "";

            string paymentUrl = vnpay.CreateRequestUrl(baseUrl, hashSecret);

            return Ok(new { url = paymentUrl });
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnpayReturn()
        {
            var vnpay = new VnPayLibrary();


            string hashSecret = _configuration["Vnpay:HashSecret"] ?? "";
            
            // Rebuild query string without SecureHash to validate
            SortedList<string, string> requestData = new SortedList<string, string>(new VnPayCompare());
            foreach (var kv in Request.Query)
            {
                if (kv.Key.StartsWith("vnp_") && kv.Key != "vnp_SecureHash")
                {
                    requestData.Add(kv.Key, kv.Value.ToString());
                }
            }
            StringBuilder data = new StringBuilder();
            foreach (var kv in requestData)
            {
                data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
            }
            string queryString = data.ToString().TrimEnd('&');
            string calcHash = vnpay.HmacSHA512(hashSecret, queryString);


            
            string receivedHash = Request.Query["vnp_SecureHash"];
            
            if (calcHash == receivedHash)
            {
                string responseCode = Request.Query["vnp_ResponseCode"];
                if (responseCode == "00")
                {
                    string txnRef = Request.Query["vnp_TxnRef"];
                    string amount = Request.Query["vnp_Amount"];
                    string customerId = Request.Query["vnp_CustomerId"];
                    
                    // Tạo order từ giỏ hàng
                    var cart = _context.cart.FirstOrDefault(c => c.MaKhachHang == int.Parse(customerId));
                    if (cart == null) return BadRequest("Giỏ hàng không tồn tại!");
                    
                    var newOrder = new order {
                        MaKhachHang = int.Parse(customerId),
                        NgayDat = DateTime.Now,
                        TongTien = decimal.Parse(amount) / 100,
                        TrangThai = "Đã thanh toán",
                        VnpTransactionNo = Request.Query["vnp_TransactionNo"],
                        PhuongThucThanhToan = "VNPAY"
                    };
                    _context.order.Add(newOrder);
                    await _context.SaveChangesAsync();
                    
                    // Sao chép cartdetail sang orderdetail
                    var cartDetails = _context.cartdetail.Where(d => d.MaCart == cart.MaCart);
                    foreach (var item in cartDetails) {
                        _context.orderdetail.Add(new orderdetail {
                            MaDonHang = newOrder.MaDonHang,
                            MaSanPham = item.MaSanPham,
                            SoLuong = (int)item.SoLuongSanPham,
                            DonGia = (decimal)_context.product.FirstOrDefault(p => p.MaSanPham == item.MaSanPham).DonGia
                        });
                        
                        // Giảm tồn kho sản phẩm
                        var product = _context.product.FirstOrDefault(p => p.MaSanPham == item.MaSanPham);
                        if (product != null) {
                            product.SoLuong -= item.SoLuongSanPham;
                        }
                    }
                    await _context.SaveChangesAsync();
                    
                    // Xóa giỏ hàng
                    _context.cartdetail.RemoveRange(cartDetails);
                    cart.CostCart = 0;
                    await _context.SaveChangesAsync();
                    
                    return Ok(new { success = true, message = "Thanh toán thành công, đơn hàng đã tạo!" });
                }
            }
            
            return BadRequest(new { success = false, message = "Giao dịch không hợp lệ!" });
        }
    }
}

