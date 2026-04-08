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
        // Trước khi trả dữ liệu, hệ thống tự đồng bộ SoLuongNV theo bảng staff.
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            await SyncAllDepartmentCountsAsync();
            return Ok(await _context.departments.ToListAsync());
        }

        // GET: api/Departments/{id} - Tìm kiếm department theo mã hoặc tên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Mỗi lần xem/tìm kiếm phòng ban, đồng bộ lại số lượng nhân viên thực tế.
                await SyncAllDepartmentCountsAsync();

                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.departments.ToListAsync());
                }

                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo MaPhongBan hoặc TenPhongBan
                var results = await _context.departments
                    .Where(d => d.MaPhongBan.ToLower().Contains(searchKeyword) ||
                                (d.TenPhongBan ?? string.Empty).ToLower().Contains(searchKeyword))
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
        // Lưu ý: SoLuongNV không nhập tay nữa, backend sẽ tự đếm theo staff.MaPhongBan.
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] DepartmentCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.MaPhongBan))
                {
                    return BadRequest(new { message = "Mã phòng ban không được để trống" });
                }

                if (string.IsNullOrWhiteSpace(dto.TenPhongBan))
                {
                    return BadRequest(new { message = "Tên phòng ban không được để trống" });
                }

                // Không nhập tay SoLuongNV nữa, hệ thống sẽ tự đếm theo staff.MaPhongBan.
                string maPhongBan = dto.MaPhongBan.Trim();

                // Kiểm tra department đã tồn tại
                var existingDepartment = await _context.departments.FindAsync(maPhongBan);
                if (existingDepartment != null)
                {
                    return BadRequest(new { message = "Mã phòng ban đã tồn tại" });
                }

                // Nếu đã có staff mang MaPhongBan này từ trước, lấy đúng số lượng để lưu vào department.
                var soLuongNhanVien = await CountStaffByDepartmentAsync(maPhongBan);

                var department = new departments
                {
                    MaPhongBan = maPhongBan,
                    TenPhongBan = dto.TenPhongBan.Trim(),
                    SoLuongNV = soLuongNhanVien
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
        // Chỉ sửa thông tin phòng ban, còn SoLuongNV luôn được đếm tự động.
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
                department.SoLuongNV = await CountStaffByDepartmentAsync(department.MaPhongBan);

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

        // Đếm số nhân viên hiện tại thuộc đúng mã phòng ban.
        private async Task<int> CountStaffByDepartmentAsync(string maPhongBan)
        {
            return await _context.staff.CountAsync(x => x.MaPhongBan == maPhongBan);
        }

        // Đồng bộ toàn bộ SoLuongNV trong bảng departments theo dữ liệu thật từ bảng staff.
        // Dùng khi xem danh sách/tìm kiếm để đảm bảo dữ liệu luôn đúng.
        private async Task SyncAllDepartmentCountsAsync()
        {
            var departments = await _context.departments.ToListAsync();
            var hasChanges = false;

            foreach (var department in departments)
            {
                var soLuongNhanVien = await CountStaffByDepartmentAsync(department.MaPhongBan);
                if (department.SoLuongNV != soLuongNhanVien)
                {
                    department.SoLuongNV = soLuongNhanVien;
                    hasChanges = true;
                }
            }

            if (hasChanges)
            {
                await _context.SaveChangesAsync();
            }
        }
    }
}
