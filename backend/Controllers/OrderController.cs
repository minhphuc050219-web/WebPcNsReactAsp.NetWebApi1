using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Dtos;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("user/{maKhachHang}")]
        public async Task<ActionResult> GetUserOrders(string maKhachHang)
        {
            var orders = await _context.order
                .Where(o => o.MaKhachHang == maKhachHang)
                .OrderByDescending(o => o.NgayDat)
                .ToListAsync();
            return Ok(orders);
        }

        [HttpPost]
        public async Task<ActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var newOrder = new order
            {
                MaKhachHang = dto.MaKhachHang,
                NgayDat = DateTime.Now,
                TongTien = (decimal)dto.TongTien, // ✅ Fix lỗi: Cast từ double sang decimal
                TrangThai = "Chờ xác nhận",
                VnpTransactionNo = dto.VnpTransactionNo ?? "",
                PhuongThucThanhToan = dto.PhuongThucThanhToan ?? "VNPAY"
            };

            _context.order.Add(newOrder);
            await _context.SaveChangesAsync();

            if (dto.OrderDetails != null)
            {
                foreach (var item in dto.OrderDetails)
                {
                    var detail = new orderdetail
                    {
                        MaDonHang = newOrder.MaDonHang,
                        MaSanPham = item.MaSanPham,
                        SoLuong = item.SoLuong, // ✅ Đã sửa đúng tên cột của ông
                        DonGia = (decimal)item.DonGia // ✅ Đã sửa đúng tên cột của ông
                    };
                    _context.orderdetail.Add(detail);
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Tạo đơn hàng thành công!", orderId = newOrder.MaDonHang });
        }
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
        public double DonGia { get; set; }
    }
}