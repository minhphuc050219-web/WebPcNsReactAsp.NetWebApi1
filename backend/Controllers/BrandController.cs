using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Dtos;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public BrandController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Brand - Lấy tất cả brand
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.brand.ToListAsync());
        }

        // GET: api/Brand/{id} - Tìm kiếm brand theo mã hoặc tên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.brand.ToListAsync());
                }

                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo maBrand hoặc tenBrand
                var results = await _context.brand
                    .Where(b => b.MaBrand.ToLower().Contains(searchKeyword) ||
                                b.TenBrand.ToLower().Contains(searchKeyword))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/Brand - Thêm brand mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] BrandCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenBrand))
                {
                    return BadRequest(new { message = "Tên brand không được để trống" });
                }

                // Generate maBrand nếu không có
                string maBrand = string.IsNullOrWhiteSpace(dto.MaBrand) 
                    ? "BR" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaBrand.Trim();

                // Kiểm tra brand đã tồn tại
                var existingBrand = await _context.brand.FindAsync(maBrand);
                if (existingBrand != null)
                {
                    return BadRequest(new { message = "Mã brand đã tồn tại" });
                }

                var brand = new brand
                {
                    MaBrand = maBrand,
                    TenBrand = dto.TenBrand.Trim()
                };

                // Xử lý upload hình ảnh
                if (dto.BrandImages != null && dto.BrandImages.Length > 0)
                {
                    brand.BrandImages = await SaveImage(dto.BrandImages, "imagesBrand");
                }

                _context.brand.Add(brand);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = brand.MaBrand }, brand);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm brand: " + ex.Message });
            }
        }

        // PUT: api/Brand/{id} - Sửa brand
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] BrandCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenBrand))
                {
                    return BadRequest(new { message = "Tên brand không được để trống" });
                }

                var brand = await _context.brand.FindAsync(id);
                if (brand == null)
                {
                    return NotFound(new { message = "Brand không tồn tại" });
                }

                brand.TenBrand = dto.TenBrand.Trim();

                // Xử lý update hình ảnh mới
                if (dto.BrandImages != null && dto.BrandImages.Length > 0)
                {
                    // Xóa hình ảnh cũ nếu tồn tại
                    if (!string.IsNullOrEmpty(brand.BrandImages))
                    {
                        DeleteImage(brand.BrandImages, "imagesBrand");
                    }
                    brand.BrandImages = await SaveImage(dto.BrandImages, "imagesBrand");
                }

                _context.brand.Update(brand);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật brand thành công", data = brand });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật brand: " + ex.Message });
            }
        }

        // DELETE: api/Brand/{id} - Xóa brand
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var brand = await _context.brand.FindAsync(id);
                if (brand == null)
                {
                    return NotFound(new { message = "Brand không tồn tại" });
                }

                // Xóa hình ảnh nếu tồn tại
                if (!string.IsNullOrEmpty(brand.BrandImages))
                {
                    DeleteImage(brand.BrandImages, "imagesBrand");
                }

                _context.brand.Remove(brand);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa brand thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa brand: " + ex.Message });
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

   
}
