using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CategoryController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Category - Lấy tất cả category
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.category.ToListAsync());
        }

        // GET: api/Category/{id} - Tìm kiếm category theo mã hoặc tên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.category.ToListAsync());
                }

                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo maLoai hoặc tenLoai
                var results = await _context.category
                    .Where(c => c.MaLoai.ToLower().Contains(searchKeyword) ||
                                c.TenLoai.ToLower().Contains(searchKeyword))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/Category - Thêm category mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CategoryCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenLoai))
                {
                    return BadRequest(new { message = "Tên loại không được để trống" });
                }

                // Generate maLoai nếu không có
                string maLoai = string.IsNullOrWhiteSpace(dto.MaLoai)
                    ? "CAT" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaLoai.Trim();

                // Kiểm tra category đã tồn tại
                var existingCategory = await _context.category.FindAsync(maLoai);
                if (existingCategory != null)
                {
                    return BadRequest(new { message = "Mã loại đã tồn tại" });
                }

                var category = new category
                {
                    MaLoai = maLoai,
                    TenLoai = dto.TenLoai.Trim(),
                    MaBrand = dto.MaBrand?.Trim()
                };

                // Xử lý upload hình ảnh
                if (dto.LoaiImages != null && dto.LoaiImages.Length > 0)
                {
                    category.LoaiImages = await SaveImage(dto.LoaiImages, "imagesCategory");
                }

                _context.category.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = category.MaLoai }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm category: " + ex.Message });
            }
        }

        // PUT: api/Category/{id} - Sửa category
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] CategoryCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenLoai))
                {
                    return BadRequest(new { message = "Tên loại không được để trống" });
                }

                var category = await _context.category.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Category không tồn tại" });
                }

                category.TenLoai = dto.TenLoai.Trim();
                category.MaBrand = dto.MaBrand?.Trim();

                // Xử lý update hình ảnh mới
                if (dto.LoaiImages != null && dto.LoaiImages.Length > 0)
                {
                    // Lưu ảnh mới trước
                    var newImageName = await SaveImage(dto.LoaiImages, "imagesCategory");
                    if (!string.IsNullOrEmpty(newImageName))
                    {
                        // Xóa ảnh cũ sau khi lưu mới thành công
                        if (!string.IsNullOrEmpty(category.LoaiImages))
                        {
                            DeleteImage(category.LoaiImages, "imagesCategory");
                        }
                        category.LoaiImages = newImageName;
                    }
                }

                _context.category.Update(category);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật category thành công", data = category });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật category: " + ex.Message });
            }
        }

        // DELETE: api/Category/{id} - Xóa category
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var category = await _context.category.FindAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = "Category không tồn tại" });
                }

                // Xóa hình ảnh nếu tồn tại
                if (!string.IsNullOrEmpty(category.LoaiImages))
                {
                    DeleteImage(category.LoaiImages, "imagesCategory");
                }

                _context.category.Remove(category);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa category thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa category: " + ex.Message });
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

    // DTO cho Create/Update Category
    public class CategoryCreateUpdateDto
    {
        public string? MaLoai { get; set; }
        public string? TenLoai { get; set; }
        public string? MaBrand { get; set; }
        public IFormFile? LoaiImages { get; set; }
    }
}
