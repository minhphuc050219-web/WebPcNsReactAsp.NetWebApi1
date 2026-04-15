using Microsoft.AspNetCore.Mvc;
using backend.Helpers; 
using backend.Dtos;
using backend.Data;
using System.Text;
using System.Web;
using System.Linq;
using System.Net;





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

            string baseUrl = _configuration["Vnpay:BaseUrl"] ?? "";
            string hashSecret = _configuration["Vnpay:HashSecret"] ?? "";

            string paymentUrl = vnpay.CreateRequestUrl(baseUrl, hashSecret);

            return Ok(new { url = paymentUrl });
        }

        [HttpGet("vnpay-return")]
        public IActionResult VnpayReturn()
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
                    
                    // TODO: Create order logic here
                    // _context.order.Add(new order { ... });
                    
                    return Ok(new { success = true, message = "Thanh toán thành công, đơn hàng đã tạo!" });
                }
            }
            
            return BadRequest(new { success = false, message = "Giao dịch không hợp lệ!" });
        }
    }
}

