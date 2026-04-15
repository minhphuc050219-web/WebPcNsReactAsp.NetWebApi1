using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Linq;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalaryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        public SalaryController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Salary - Lấy tất cả salary
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.salary.Include(s => s.MaNVNavigation).ToListAsync());
        }

        // GET: api/Salary/{name} - Tìm kiếm salary theo tên nhân viên (TenNV)
        [HttpGet("{name?}")]
        public async Task<IActionResult> GetByName(string? name)
        {
            try
            {
                // Nếu name rỗng thì trả về tất cả
                if (string.IsNullOrWhiteSpace(name))
                {
                    return Ok(await _context.salary.Include(s => s.MaNVNavigation).ToListAsync());
                }

                var searchKeyword = name.ToLower().Trim();

                // Tìm staff có TenNV chứa từ khóa
                var matchingStaffIds = await _context.staff
                    .Where(st => st.TenNV != null && st.TenNV.ToLower().Contains(searchKeyword))
                    .Select(st => st.MaNV)
                    .ToListAsync();

                if (matchingStaffIds == null || matchingStaffIds.Count == 0)
                {
                    return Ok(new List<salary>());
                }

                // Lấy salary của những nhân viên khớp
                var results = await _context.salary
                    .Where(sl => sl.MaNV != null && matchingStaffIds.Contains(sl.MaNV))
                    .Include(sl => sl.MaNVNavigation)
                    .ToListAsync();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/Salary - Thêm salary mới
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] salary dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { message = "Dữ liệu không hợp lệ" });
                }

                _context.salary.Add(dto);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thêm salary thành công", data = dto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm salary: " + ex.Message });
            }
        }

        // PUT: api/Salary/{id} - Sửa salary
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] salary dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(new { message = "Dữ liệu không hợp lệ" });
                }

                var existing = await _context.salary.FindAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = "Salary không tồn tại" });
                }

                // Áp dụng các giá trị từ dto lên entity hiện có
                _context.Entry(existing).CurrentValues.SetValues(dto);
                _context.salary.Update(existing);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật salary thành công", data = existing });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật salary: " + ex.Message });
            }
        }

        // DELETE: api/Salary/{id} - Xóa salary
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var existing = await _context.salary.FindAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = "Salary không tồn tại" });
                }

                _context.salary.Remove(existing);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa salary thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa salary: " + ex.Message });
            }
        }

        
    }
}
