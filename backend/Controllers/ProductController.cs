using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Product - Lấy tất cả product
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.product.ToListAsync());
        }

        // GET: api/Product/{id} - Tìm kiếm product theo mã hoặc tên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.product.ToListAsync());
                }

                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo maSanPham hoặc tenSanPham
                var results = await _context.product
                    .Where(p => p.MaSanPham.ToLower().Contains(searchKeyword) ||
                                (p.TenSanPham != null && p.TenSanPham.ToLower().Contains(searchKeyword)))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/Product - Thêm product mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenSanPham))
                {
                    return BadRequest(new { message = "Tên sản phẩm không được để trống" });
                }

                // Generate maSanPham nếu không có
                string maSanPham = string.IsNullOrWhiteSpace(dto.MaSanPham)
                    ? "SP" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaSanPham.Trim();

                // Kiểm tra product đã tồn tại
                var existingProduct = await _context.product.FindAsync(maSanPham);
                if (existingProduct != null)
                {
                    return BadRequest(new { message = "Mã sản phẩm đã tồn tại" });
                }

                var product = new product
                {
                    MaSanPham = maSanPham,
                    TenSanPham = dto.TenSanPham.Trim(),
                    SoLuong = dto.SoLuong ?? 0,
                    DonGia = dto.DonGia ?? 0,
                    NgayNhap = dto.NgayNhap,
                    HanBaoHanh = dto.HanBaoHanh ?? 0,
                    ShortDescription = dto.ShortDescription?.Trim(),
                    Description = dto.Description?.Trim(),
                    TinhTrangSanPham = dto.TinhTrangSanPham ?? true,
                    TrangThaiSanPham = dto.TrangThaiSanPham ?? true,
                    MaLoai = dto.MaLoai?.Trim(),
                    MaBrand = dto.MaBrand?.Trim()
                };

                // Xử lý upload hình ảnh
                if (dto.HangHoaImages != null && dto.HangHoaImages.Length > 0)
                {
                    product.HangHoaImages = await SaveImage(dto.HangHoaImages, "imagesProduct");
                }

                _context.product.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = product.MaSanPham }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm product: " + ex.Message });
            }
        }

        // PUT: api/Product/{id} - Sửa product
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] ProductCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenSanPham))
                {
                    return BadRequest(new { message = "Tên sản phẩm không được để trống" });
                }

                var product = await _context.product.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Product không tồn tại" });
                }

                product.TenSanPham = dto.TenSanPham.Trim();
                product.SoLuong = dto.SoLuong ?? product.SoLuong;
                product.DonGia = dto.DonGia ?? product.DonGia;
                product.NgayNhap = dto.NgayNhap ?? product.NgayNhap;
                product.HanBaoHanh = dto.HanBaoHanh ?? product.HanBaoHanh;
                product.ShortDescription = dto.ShortDescription?.Trim() ?? product.ShortDescription;
                product.Description = dto.Description?.Trim() ?? product.Description;
                product.TinhTrangSanPham = dto.TinhTrangSanPham ?? product.TinhTrangSanPham;
                product.TrangThaiSanPham = dto.TrangThaiSanPham ?? product.TrangThaiSanPham;
                product.MaLoai = dto.MaLoai?.Trim() ?? product.MaLoai;
                product.MaBrand = dto.MaBrand?.Trim() ?? product.MaBrand;

                // Xử lý update hình ảnh mới
                if (dto.HangHoaImages != null && dto.HangHoaImages.Length > 0)
                {
                    // Lưu ảnh mới trước
                    var newImageName = await SaveImage(dto.HangHoaImages, "imagesProduct");
                    if (!string.IsNullOrEmpty(newImageName))
                    {
                        // Xóa ảnh cũ sau khi lưu mới thành công
                        if (!string.IsNullOrEmpty(product.HangHoaImages))
                        {
                            DeleteImage(product.HangHoaImages, "imagesProduct");
                        }
                        product.HangHoaImages = newImageName;
                    }
                }

                _context.product.Update(product);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật product thành công", data = product });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật product: " + ex.Message });
            }
        }

        // DELETE: api/Product/{id} - Xóa product
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var product = await _context.product.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Product không tồn tại" });
                }

                // Xóa hình ảnh nếu tồn tại
                if (!string.IsNullOrEmpty(product.HangHoaImages))
                {
                    DeleteImage(product.HangHoaImages, "imagesProduct");
                }

                _context.product.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa product thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa product: " + ex.Message });
            }
        }

        // Hàm hỗ trợ: Lưu hình ảnh
        private async Task<string?> SaveImage(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
                return null;

            try
            {
                // Kiểm tra kích thước file (max 5MB)
                const long maxFileSize = 5 * 1024 * 1024;
                if (file.Length > maxFileSize)
                {
                    throw new Exception("Kích thước file vượt quá 5MB");
                }

                // Kiểm tra loại file
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    throw new Exception("Định dạng file không được hỗ trợ. Vui lòng chọn JPG, PNG, GIF hoặc WebP");
                }

                // Tạo thư mục nếu chưa tồn tại
                string uploadsFolder = Path.Combine(_env.WebRootPath, "public", folderName);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Tạo tên file duy nhất
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + DateTime.Now.Ticks + fileExtension;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                return uniqueFileName;
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi lưu hình ảnh: " + ex.Message);
            }
        }

        // Hàm hỗ trợ: Xóa hình ảnh
        private void DeleteImage(string fileName, string folderName)
        {
            try
            {
                string filePath = Path.Combine(_env.WebRootPath, "public", folderName, fileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi xóa hình ảnh: " + ex.Message);
            }
        }
    }

    // DTO cho Create/Update Product
    public class ProductCreateUpdateDto
    {
        public string? MaSanPham { get; set; }
        public string? TenSanPham { get; set; }
        public int? SoLuong { get; set; }
        public decimal? DonGia { get; set; }
        public DateOnly? NgayNhap { get; set; }
           public int? HanBaoHanh { get; set; }
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public bool? TinhTrangSanPham { get; set; }
        public bool? TrangThaiSanPham { get; set; }
        public string? MaLoai { get; set; }
        public string? MaBrand { get; set; }
        public IFormFile? HangHoaImages { get; set; }
    }
}
