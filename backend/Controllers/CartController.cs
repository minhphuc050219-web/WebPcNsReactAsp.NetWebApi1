using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Dtos;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("get-cart/{customerId}")]
        public IActionResult GetCart(int customerId)
        {
            // ✅ Fix lỗi so sánh: Dùng .GetValueOrDefault() để đưa về bool chuẩn
            var cart = _context.cart.FirstOrDefault(c => c.MaKhachHang == customerId && c.TrangThaiCart == true);
            
            if (cart == null) return Ok(new List<object>());

            var cartItems = (from d in _context.cartdetail
                             join p in _context.product on d.MaSanPham.Trim() equals p.MaSanPham.Trim()
                             where d.MaCart == cart.MaCart
                             select new
                             {
                                 maSanPham = p.MaSanPham.Trim(),
                                 tenSanPham = p.TenSanPham,
                                 donGia = p.DonGia,
                                 soLuong = d.SoLuongSanPham,
                                 hinhAnh = p.HangHoaImages
                             }).ToList();

            return Ok(cartItems);
        }

        [HttpPost("add-to-cart")]
        public IActionResult AddToCart([FromBody] AddToCartDto request)
        {
            var nhanVien = _context.staff.FirstOrDefault();
            if (nhanVien == null) return BadRequest("Lỗi: Bảng staff trống!");

            var cart = _context.cart.FirstOrDefault(c => c.MaKhachHang == request.MaKhachHang && c.TrangThaiCart == true);
            
            if (cart == null)
            {
                cart = new cart { MaKhachHang = request.MaKhachHang, CostCart = 0, TrangThaiCart = true };
                _context.cart.Add(cart);
                _context.SaveChanges(); 
            }

            var detail = _context.cartdetail.ToList().FirstOrDefault(d => d.MaCart == cart.MaCart && d.MaSanPham.Trim() == request.MaSanPham.Trim());
            
            if (detail != null)
            {
                detail.SoLuongSanPham += request.SoLuong;
                detail.CostCart = (decimal)(detail.SoLuongSanPham * (int)request.DonGia);
            }
            else
            {
                detail = new cartdetail
                {
                    MaCart = cart.MaCart,
                    MaSanPham = request.MaSanPham,
                    SoLuongSanPham = request.SoLuong,
                    CostCart = (decimal)(request.SoLuong * request.DonGia),
                    MaNV = nhanVien.MaNV 
                };
                _context.cartdetail.Add(detail);
            }

            _context.SaveChanges(); 
            cart.CostCart = _context.cartdetail.Where(d => d.MaCart == cart.MaCart).Sum(d => d.CostCart);
            _context.SaveChanges(); 

            return Ok(new { message = "Thành công!" });
        }

        [HttpPost("remove-by-product")]
        public IActionResult RemoveByProduct([FromBody] CartDeleteDto dto)
        {
            var cart = _context.cart.FirstOrDefault(c => c.MaKhachHang == dto.MaKhachHang && c.TrangThaiCart == true);
            if (cart == null) return NotFound("Không tìm thấy giỏ hàng");

            var detail = _context.cartdetail.FirstOrDefault(d => d.MaCart == cart.MaCart && d.MaSanPham.Trim() == dto.MaSanPham.Trim());
            if (detail == null) return NotFound("Không tìm thấy sản phẩm");

            _context.cartdetail.Remove(detail);
            _context.SaveChanges();

            // Update cart total
            cart.CostCart = _context.cartdetail.Where(d => d.MaCart == cart.MaCart).Sum(d => d.CostCart);
            _context.SaveChanges();

            return Ok(new { message = "Xóa thành công!" });
        }

        [HttpPost("update-quantity")]
        public IActionResult UpdateQuantity([FromBody] UpdateQuantityDto dto)
        {
            var cart = _context.cart.FirstOrDefault(c => c.MaKhachHang == dto.MaKhachHang && c.TrangThaiCart == true);
            if (cart == null) return NotFound("Không tìm thấy giỏ hàng");

            var detail = _context.cartdetail.FirstOrDefault(d => d.MaCart == cart.MaCart && d.MaSanPham.Trim() == dto.maSanPham.Trim());
            if (detail == null) return NotFound("Không tìm thấy sản phẩm");

            detail.SoLuongSanPham = dto.soLuong;
            detail.CostCart = (decimal)(detail.SoLuongSanPham * (int)_context.product.FirstOrDefault(p => p.MaSanPham.Trim() == dto.maSanPham.Trim()).DonGia);
            _context.SaveChanges();

            // Update cart total
            cart.CostCart = _context.cartdetail.Where(d => d.MaCart == cart.MaCart).Sum(d => d.CostCart);
            _context.SaveChanges();

            return Ok(new { message = "Cập nhật thành công!" });
        }
    }
}

