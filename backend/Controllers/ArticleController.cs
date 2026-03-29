using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Linq;
using backend.Dtos;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : ControllerBase
    {
        private readonly AppDbContext _context;
         private readonly IWebHostEnvironment _env;

        public ArticleController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Article - Lấy tất cả article
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.article.ToListAsync());
        }

        // GET: api/Article/{id} - Tìm kiếm article theo mã hoặc tên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.article.ToListAsync());
                }

                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo maBV hoặc tenBV
                var results = await _context.article
                    .Where(p => p.MaBV.ToLower().Contains(searchKeyword) ||
                                (p.TenBV != null && p.TenBV.ToLower().Contains(searchKeyword)))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/Article - Thêm article mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ArticleCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenBV))
                {
                    return BadRequest(new { message = "Tên bài viết không được để trống" });
                }

                // Generate maBV nếu không có
                string maBV = string.IsNullOrWhiteSpace(dto.MaBV)
                    ? "BV" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaBV.Trim();

                // Kiểm tra article đã tồn tại
                var existingArticle = await _context.article.FindAsync(maBV);
                if (existingArticle != null)
                {
                    return BadRequest(new { message = "Mã bài viết đã tồn tại" });
                }

                var article = new article
                {
                    MaBV = maBV,
                    TenBV = dto.TenBV.Trim(),
                    TomTatBV = dto.TomTatBV?.Trim(),
                    NoiDungBV = dto.NoiDungBV?.Trim(),
                    MaLoaiBV = dto.MaLoaiBV?.Trim(),
                    TrangThaiBV = dto.TrangThaiBV ?? true
                };

                // Xử lý upload hình ảnh
                if (dto.BVImages != null && dto.BVImages.Length > 0)
                {
                    article.BVImages = await SaveImage(dto.BVImages, "imagesArticle");
                }

                _context.article.Add(article);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = article.MaBV }, article);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm article: " + ex.Message });
            }
        }

        // PUT: api/Article/{id} - Sửa article
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] ArticleCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenBV))
                {
                    return BadRequest(new { message = "Tên bài viết không được để trống" });
                }

                var article = await _context.article.FindAsync(id);
                if (article == null)
                {
                    return NotFound(new { message = "Article không tồn tại" });
                }

                article.TenBV = dto.TenBV.Trim();
                article.TomTatBV = dto.TomTatBV?.Trim();
                article.NoiDungBV = dto.NoiDungBV?.Trim();
                article.MaLoaiBV = dto.MaLoaiBV?.Trim();
                article.TrangThaiBV = dto.TrangThaiBV ?? article.TrangThaiBV;

                // Xử lý update hình ảnh mới
                if (dto.BVImages != null && dto.BVImages.Length > 0)
                {
                    // Lưu ảnh mới trước
                    var newImageName = await SaveImage(dto.BVImages, "imagesArticle");
                    if (!string.IsNullOrEmpty(newImageName))
                    {
                        // Xóa ảnh cũ sau khi lưu newcoming
                        if (!string.IsNullOrEmpty(article.BVImages))
                        {
                            DeleteImage(article.BVImages, "imagesArticle");
                        }
                        article.BVImages = newImageName;
                    }
                }

                _context.article.Update(article);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật article thành công", data = article });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật article: " + ex.Message });
            }
        }

        // DELETE: api/Article/{id} - Xóa article
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var article = await _context.article.FindAsync(id);
                if (article == null)
                {
                    return NotFound(new { message = "Article không tồn tại" });
                }

                // Xóa hình ảnh nếu tồn tại
                if (!string.IsNullOrEmpty(article.BVImages))
                {
                    DeleteImage(article.BVImages, "imagesArticle");
                }

                _context.article.Remove(article);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa article thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa article: " + ex.Message });
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
