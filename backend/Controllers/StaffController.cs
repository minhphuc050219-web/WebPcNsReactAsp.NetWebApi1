using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public StaffController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Staff - Lấy tất cả staff
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.staff.ToListAsync());
        }

        // GET: api/Staff/{id} - Tìm kiếm staff theo mã
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.staff.ToListAsync());
                }
                var searchKeyword = id.ToLower().Trim();

                // Tìm kiếm theo maNV hoặc tenNV
                var results = await _context.staff
                    .Where(s => s.MaNV.ToLower().Contains(searchKeyword) ||
                                (s.TenNV != null && s.TenNV.ToLower().Contains(searchKeyword)))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/Staff - Thêm staff mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] StaffCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenNV))
                {
                    return BadRequest(new { message = "Tên nhân viên không được để trống" });
                }

                // Generate maNV nếu không có
                string maNV = string.IsNullOrWhiteSpace(dto.MaNV)
                    ? "NV" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaNV.Trim();

                // Kiểm tra staff đã tồn tại
                var existingStaff = await _context.staff.FindAsync(maNV);
                if (existingStaff != null)
                {
                    return BadRequest(new { message = "Mã nhân viên đã tồn tại" });
                }

                var staff = new staff
                {
                    MaNV = maNV,
                    TenNV = dto.TenNV.Trim(),
                    DiaChi = dto.DiaChi?.Trim(),
                    SDT = dto.SDT?.Trim(),
                    GioiTinh = dto.GioiTinh ?? true,
                    NgaySinh = dto.NgaySinh,
                    CCD = dto.CCD?.Trim(),
                    LuongCoBan = dto.LuongCoBan ?? 0,
                    Email = dto.Email?.Trim(),
                    Password = dto.Password?.Trim(),
                    MaPhongBan = dto.MaPhongBan?.Trim(),
                    Role = dto.Role?.Trim(),
                };

                // Xử lý upload hình ảnh
                if (dto.NVImages != null && dto.NVImages.Length > 0)
                {
                    staff.NVImages = await SaveImage(dto.NVImages, "imagesStaff");
                }

                _context.staff.Add(staff);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = staff.MaNV }, staff);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm staff: " + ex.Message });
            }
        }

        // PUT: api/Staff/{id} - Sửa staff
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] StaffCreateUpdateDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenNV))
                {
                    return BadRequest(new { message = "Tên nhân viên không được để trống" });
                }

                var staff = await _context.staff.FindAsync(id);
                if (staff == null)
                {
                    return NotFound(new { message = "Staff không tồn tại" });
                }

                staff.TenNV = dto.TenNV?.Trim() ?? staff.TenNV;
                staff.DiaChi = dto.DiaChi?.Trim() ?? staff.DiaChi;
                staff.SDT = dto.SDT?.Trim() ?? staff.SDT;
                staff.GioiTinh = dto.GioiTinh ?? staff.GioiTinh;
                staff.NgaySinh = dto.NgaySinh ?? staff.NgaySinh;
                staff.CCD = dto.CCD?.Trim() ?? staff.CCD;
                staff.LuongCoBan = dto.LuongCoBan ?? staff.LuongCoBan;
                staff.Email = dto.Email?.Trim() ?? staff.Email;
                staff.Password = dto.Password?.Trim() ?? staff.Password;
                staff.MaPhongBan = dto.MaPhongBan?.Trim() ?? staff.MaPhongBan;
                staff.Role = dto.Role?.Trim() ?? staff.Role;

                // Xử lý update hình ảnh mới
                if (dto.NVImages != null && dto.NVImages.Length > 0)
                {
                    // Lưu ảnh mới trước
                    var newImageName = await SaveImage(dto.NVImages, "imagesStaff");
                    if (!string.IsNullOrEmpty(newImageName))
                    {
                        // Xóa ảnh cũ sau khi lưu mới thành công
                        if (!string.IsNullOrEmpty(staff.NVImages))
                        {
                            DeleteImage(staff.NVImages, "imagesStaff");
                        }
                        staff.NVImages = newImageName;
                    }
                }

                _context.staff.Update(staff);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật staff thành công", data = staff });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật staff: " + ex.Message });
            }
        }

        // DELETE: api/Staff/{id} - Xóa staff
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var staff = await _context.staff.FindAsync(id);
                if (staff == null)
                {
                    return NotFound(new { message = "Staff không tồn tại" });
                }

                // Xóa hình ảnh nếu tồn tại
                if (!string.IsNullOrEmpty(staff.NVImages))
                {
                    DeleteImage(staff.NVImages, "imagesStaff");
                }

                _context.staff.Remove(staff);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa staff thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa staff: " + ex.Message });
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
    // DTO cho Create/Update Staff
    public class StaffCreateUpdateDto
    {
        public string? MaNV { get; set; }
        public string? TenNV { get; set; }
        public string? DiaChi { get; set; }
        public string? SDT { get; set; }
        public bool? GioiTinh { get; set; }
        public DateOnly? NgaySinh { get; set; }
        public string? CCD { get; set; }
        public decimal? LuongCoBan { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? MaPhongBan { get; set; }
        public string? Role { get; set; }
        public IFormFile? NVImages { get; set; }
    }
}
