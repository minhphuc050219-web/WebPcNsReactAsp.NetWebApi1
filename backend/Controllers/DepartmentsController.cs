using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Dtos;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Departments - Lấy tất cả departments
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.departments.ToListAsync());
        }

        // GET: api/Departments/{id} - Tìm kiếm department theo mã hoặc tên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.departments.ToListAsync());
                }

                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo MaPhongBan hoặc TenPhongBan
                var results = await _context.departments
                    .Where(d => d.MaPhongBan.ToLower().Contains(searchKeyword) ||
                                d.TenPhongBan.ToLower().Contains(searchKeyword))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }
        // POST: api/Departments - Thêm department mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] DepartmentCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenPhongBan))
                {
                    return BadRequest(new { message = "Tên phòng ban không được để trống" });
                }

                // Generate maPhongBan nếu không có
                string maPhongBan = string.IsNullOrWhiteSpace(dto.MaPhongBan) 
                    ? "PB" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaPhongBan.Trim();

                // Kiểm tra department đã tồn tại
                var existingDepartment = await _context.departments.FindAsync(maPhongBan);
                if (existingDepartment != null)
                {
                    return BadRequest(new { message = "Mã phòng ban đã tồn tại" });
                }

                var department = new departments
                {
                    MaPhongBan = maPhongBan,
                    TenPhongBan = dto.TenPhongBan.Trim(),
                    SoLuongNV = dto.SoLuongNV ?? 0
                };

                

                _context.departments.Add(department);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = department.MaPhongBan }, department);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm department: " + ex.Message });
            }
        }

        // PUT: api/Departments/{id} - Sửa department
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] DepartmentCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenPhongBan))
                {
                    return BadRequest(new { message = "Tên phòng ban không được để trống" });
                }

                var department = await _context.departments.FindAsync(id);
                if (department == null)
                {
                    return NotFound(new { message = "Department không tồn tại" });
                }

                department.TenPhongBan = dto.TenPhongBan.Trim();
                if (dto.SoLuongNV.HasValue)
                {
                    department.SoLuongNV = dto.SoLuongNV.Value;
                }

                _context.departments.Update(department);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật department thành công", data = department });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật department: " + ex.Message });
            }
        }

        // DELETE: api/Departments/{id} - Xóa department
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var department = await _context.departments.FindAsync(id);
                if (department == null)
                {
                    return NotFound(new { message = "Department không tồn tại" });
                }

                

                _context.departments.Remove(department);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa department thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa department: " + ex.Message });
            }
        }
    }
}
