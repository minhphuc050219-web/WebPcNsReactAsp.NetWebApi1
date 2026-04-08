using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Dtos;
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
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenNV))
                {
                    return BadRequest(new { message = "Tên nhân viên không được để trống" });
                }
                if (string.IsNullOrWhiteSpace(dto.Email))
                    return BadRequest(new { message = "Email không được để trống" });

                var emailExists = await _context.register.AnyAsync(x => x.Email == dto.Email);
                if (emailExists)
                    return BadRequest(new { message = "Email đã tồn tại" });

                // Khi thêm staff mới, nếu có MaPhongBan thì phải kiểm tra phòng ban đó tồn tại.
                var maPhongBan = dto.MaPhongBan?.Trim();
                if (!string.IsNullOrWhiteSpace(maPhongBan))
                {
                    var departmentExists = await _context.departments.AnyAsync(x => x.MaPhongBan == maPhongBan);
                    if (!departmentExists)
                        return BadRequest(new { message = "Mã phòng ban không tồn tại" });
                }

                // Generate maNV nếu không có
                string maNV = string.IsNullOrWhiteSpace(dto.MaNV)
                    ? "NV" + DateTime.Now.Ticks.ToString().Substring(0, 8)
                    : dto.MaNV.Trim();

                // Kiểm tra staff đã tồn tại
                if (await _context.staff.AnyAsync(x => x.MaNV == maNV))
                    return BadRequest(new { message = "Mã nhân viên đã tồn tại" });
                var hasher = new PasswordHasher<string>();
                var password = string.IsNullOrWhiteSpace(dto.Password) ? "123456" : dto.Password;

                // ⚠️ FIX role về lowercase
        var role = string.IsNullOrWhiteSpace(dto.Role)
            ? "user"
            : dto.Role.Trim().ToLower();
            
                // 🔥 Lưu 2 ảnh
                string? staffImg = null;
                string? accImg = null;
                if (dto.NVImages != null)
                {
                    staffImg = await SaveImage(dto.NVImages, "imagesStaff");
                    accImg = await SaveImage(dto.NVImages, "imagesAccount");
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
                    Password = string.IsNullOrEmpty(dto.Password) ? null : hasher.HashPassword(null, dto.Password),
                    MaPhongBan = maPhongBan,
                    NVImages = staffImg,
                    Role = dto.Role?.Trim(),
                };

                // 🔥 TẠO ACCOUNT TƯƠNG ỨNG
                var account = new register
                {
                    Username = staff.TenNV,
                    Email = staff.Email,
                    Password = hasher.HashPassword(null, dto.Password ?? "123456"),
                    DienThoai = staff.SDT,
                    DiaChi = staff.DiaChi,
                    GioiTinh = staff.GioiTinh,
                    Images = accImg,
                    Role = staff.Role
                };
                
                _context.staff.Add(staff);
                _context.register.Add(account);
                await _context.SaveChangesAsync();

                

                // 🔥 link lại
                staff.Id_Register = account.Id_Register;
                await _context.SaveChangesAsync();

                // Sau khi thêm staff xong, cập nhật lại SoLuongNV của phòng ban tương ứng.
                await UpdateDepartmentStaffCountAsync(staff.MaPhongBan);
                await transaction.CommitAsync();

                return Ok("Thêm staff thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi thêm staff: ",  error = ex.InnerException?.Message ?? ex.Message });
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
                // Lưu lại phòng ban cũ để nếu staff đổi MaPhongBan thì trừ số lượng ở phòng cũ.
                var oldMaPhongBan = staff.MaPhongBan;

                var newMaPhongBan = dto.MaPhongBan?.Trim();
                if (!string.IsNullOrWhiteSpace(newMaPhongBan))
                {
                    var departmentExists = await _context.departments.AnyAsync(x => x.MaPhongBan == newMaPhongBan);
                    if (!departmentExists)
                        return BadRequest(new { message = "Mã phòng ban không tồn tại" });
                }

                var account = await _context.register
            .FirstOrDefaultAsync(x => x.Id_Register == staff.Id_Register);

                staff.TenNV = dto.TenNV?.Trim() ?? staff.TenNV;
                staff.DiaChi = dto.DiaChi?.Trim() ?? staff.DiaChi;
                staff.SDT = dto.SDT?.Trim() ?? staff.SDT;
                staff.GioiTinh = dto.GioiTinh ?? staff.GioiTinh;
                staff.NgaySinh = dto.NgaySinh ?? staff.NgaySinh;
                staff.CCD = dto.CCD?.Trim() ?? staff.CCD;
                staff.LuongCoBan = dto.LuongCoBan ?? staff.LuongCoBan;
                staff.Email = dto.Email?.Trim() ?? staff.Email;
                if (!string.IsNullOrEmpty(dto.Password))
                {
                    var hasher = new PasswordHasher<string>();
                    staff.Password = hasher.HashPassword(null, dto.Password);
                }
                staff.MaPhongBan = newMaPhongBan ?? staff.MaPhongBan;
                staff.Role = dto.Role?.Trim() ?? staff.Role;

                // Xử lý update hình ảnh mới
                // 🔥 update ảnh
                if (dto.NVImages != null)
                {
                    // xóa ảnh cũ
                    if (!string.IsNullOrEmpty(staff.NVImages))
                        DeleteImage(staff.NVImages, "imagesStaff");

                    if (account != null && !string.IsNullOrEmpty(account.Images))
                        DeleteImage(account.Images, "imagesAccount");

                    // lưu ảnh mới
                    var newStaffImg = await SaveImage(dto.NVImages, "imagesStaff");
                    var newAccImg = await SaveImage(dto.NVImages, "imagesAccount");

                    staff.NVImages = newStaffImg;

                    if (account != null)
                        account.Images = newAccImg;
                }
                // 🔥 UPDATE STAFF → REGISTER
                // update account
                if (account != null)
                {
                    account.Username = staff.TenNV;
                    account.Email = staff.Email;
                    account.DienThoai = staff.SDT;
                    account.DiaChi = staff.DiaChi;
                    account.GioiTinh = staff.GioiTinh;
                }

                await _context.SaveChangesAsync();

                // Luôn cập nhật lại phòng cũ trước.
                await UpdateDepartmentStaffCountAsync(oldMaPhongBan);
                if (!string.Equals(oldMaPhongBan, staff.MaPhongBan, StringComparison.OrdinalIgnoreCase))
                {
                    // Nếu đổi sang phòng ban mới thì cập nhật luôn phòng mới.
                    await UpdateDepartmentStaffCountAsync(staff.MaPhongBan);
                }

                return Ok(new
                {
                    message = "Cập nhật staff thành công",
                    data = new
                    {
                        staff.MaNV,
                        staff.TenNV,
                        staff.Email,
                        staff.SDT,
                        staff.DiaChi,
                        staff.NVImages
                    }
                });
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
                // 🔥 LẤY ACCOUNT LIÊN KẾT
                var account = await _context.register
                    .FirstOrDefaultAsync(x => x.Id_Register == staff.Id_Register);

                // Xóa hình ảnh nếu tồn tại
                if (!string.IsNullOrEmpty(staff.NVImages))
                    DeleteImage(staff.NVImages, "imagesStaff");
                // 🔥 XÓA ACCOUNT (KHÔNG CHECK ROLE)
                if (account != null && !string.IsNullOrEmpty(account.Images))
                    DeleteImage(account.Images, "imagesAccount");

                // 🔥 xóa DB
                if (account != null)
                    _context.register.Remove(account);

                // Lưu MaPhongBan trước khi xóa staff để còn cập nhật lại số lượng nhân viên.
                var maPhongBan = staff.MaPhongBan;
                _context.staff.Remove(staff);
                await _context.SaveChangesAsync();

                // Sau khi xóa nhân viên, cập nhật lại SoLuongNV của phòng ban cũ.
                await UpdateDepartmentStaffCountAsync(maPhongBan);

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

        // Hàm dùng lại ở Create/Update/Delete staff.
        // Mỗi lần staff thay đổi, số lượng nhân viên trong departments sẽ được đếm lại từ bảng staff.
        private async Task UpdateDepartmentStaffCountAsync(string? maPhongBan)
        {
            if (string.IsNullOrWhiteSpace(maPhongBan))
                return;

            var department = await _context.departments.FindAsync(maPhongBan);
            if (department == null)
                return;

            department.SoLuongNV = await _context.staff.CountAsync(x => x.MaPhongBan == maPhongBan);
            await _context.SaveChangesAsync();
        }
    }
}
