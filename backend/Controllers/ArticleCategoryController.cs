using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ArticleCategoryController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/ArticleCategory - Lấy tất cả ArticleCategory
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.articlecategory.ToListAsync());
        }

        // GET: api/ArticleCategory/{id} - Tìm kiếm ArticleCategory theo mã hoặc tên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.articlecategory.ToListAsync());
                }

                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo maLoaiBV hoặc tenLoaiBV
                var results = await _context.articlecategory
                    .Where(c => c.MaLoaiBV.ToLower().Contains(searchKeyword) ||
                                c.TenLoaiBV.ToLower().Contains(searchKeyword))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/ArticleCategory - Thêm article category mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ArticleCategoryCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenLoaiBV))
                {
                    return BadRequest(new { message = "Tên loại bài viết không được để trống" });
                }

                // Generate maLoaiBV nếu không có
                string maLoaiBV = string.IsNullOrWhiteSpace(dto.MaLoaiBV)
                    ? "LBV" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaLoaiBV.Trim();

                // Kiểm tra Aticlecategory đã tồn tại
                var existingCategory = await _context.articlecategory.FindAsync(maLoaiBV);
                if (existingCategory != null)
                {
                    return BadRequest(new { message = "Mã loại BV đã tồn tại" });
                }

                var articleCategory = new articlecategory
                {
                    MaLoaiBV = maLoaiBV,
                    TenLoaiBV = dto.TenLoaiBV.Trim(),
                    ThuTuBV = dto.ThuTuBV??0
                };

                _context.articlecategory.Add(articleCategory);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = articleCategory.MaLoaiBV }, articleCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm category: " + ex.Message });
            }
        }

        // PUT: api/ArticleCategory/{id} - Sửa article category
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] ArticleCategoryCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenLoaiBV))
                {
                    return BadRequest(new { message = "Tên loại bài viết không được để trống" });
                }

                var articleCategory = await _context.articlecategory.FindAsync(id);
                if (articleCategory == null)
                {
                    return NotFound(new { message = "Article category không tồn tại" });
                }

                articleCategory.TenLoaiBV = dto.TenLoaiBV.Trim();
                if (dto.ThuTuBV.HasValue)
                {
                    articleCategory.ThuTuBV = dto.ThuTuBV.Value;
                }

                _context.articlecategory.Update(articleCategory);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật article category thành công", data = articleCategory });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật article category: " + ex.Message });
            }
        }
        // DELETE: api/ArticleCategory/{id} - Xóa article category
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var articleCategory = await _context.articlecategory.FindAsync(id);
                if (articleCategory == null)
                {
                    return NotFound(new { message = "Article category không tồn tại" });
                }

                

                _context.articlecategory.Remove(articleCategory);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa article category thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa article category: " + ex.Message });
            }
        }
        // DTO cho Create/Update ArticleCategory
    public class ArticleCategoryCreateUpdateDto
    {
        public string? MaLoaiBV { get; set; }
        public string? TenLoaiBV { get; set; }
        public int? ThuTuBV { get; set; }
    }
    }
}
