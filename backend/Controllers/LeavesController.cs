using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Dtos;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeavesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public LeavesController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Leaves - Lấy tất cả đơn nghỉ phép kèm thông tin nhân viên
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.leaves.ToListAsync());
        }

        // GET: api/Leaves/{id} - Tìm kiếm đơn nghỉ phép theo MaLV hoặc MaNV
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                {
                    return Ok(await _context.leaves.ToListAsync());
                }

                var keyword = id.Trim().ToLower();
                IQueryable<leaves> query = _context.leaves;

                // Nếu id là số: tìm theo MaLV hoặc MaNV
                if (int.TryParse(keyword, out int maLv))
                {
                    query = query.Where(p =>
                        p.MaLV == maLv ||
                    (p.MaNV != null && p.MaNV.ToLower().Contains(keyword)));
                }
                else
                {
                    // Nếu id là chuỗi: tìm theo MaNV
                    query = query.Where(p =>
                    p.MaNV != null && p.MaNV.ToLower().Contains(keyword));
                }

                var results = await query.ToListAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        // POST: api/Leaves - Tạo đơn nghỉ phép mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] LeavesCreateUpdateDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.MaNV))
                {
                    return BadRequest(new { message = "Mã nhân viên không được để trống" });
                }

                var staffExists = await _context.staff.AnyAsync(s => s.MaNV == dto.MaNV.Trim());
                if (!staffExists)
                {
                    return BadRequest(new { message = "Mã nhân viên không tồn tại" });
                }

                var entity = new leaves
                {
                    MaNV = dto.MaNV.Trim(),
                    TypeLV = dto.TypeLV?.Trim(),
                    NgayBD = dto.NgayBD,
                    NgayKT = dto.NgayKT,
                    LyDo = dto.LyDo?.Trim(),
                    ImagesLV = dto.ImagesLV != null && dto.ImagesLV.Length > 0
                        ? await SaveImage(dto.ImagesLV, "imagesLeaves")
                        : null,
                    TrangThai = string.IsNullOrWhiteSpace(dto.TrangThai) ? "Chờ duyệt" : dto.TrangThai.Trim()
                };

                _context.leaves.Add(entity);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = entity.MaLV }, entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo đơn nghỉ phép: " + ex.Message });
            }
        }

        // PUT: api/Leaves/{id} - Cập nhật đơn nghỉ phép
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] LeavesCreateUpdateDto dto)
        {
            try
            {
                var entity = await _context.leaves.FindAsync(id);
                if (entity == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn nghỉ phép" });
                }

                // Kiểm tra và cập nhật MaNV
                if (!string.IsNullOrWhiteSpace(dto.MaNV))
                {
                    var staffExists = await _context.staff.AnyAsync(s => s.MaNV == dto.MaNV.Trim());
                    if (!staffExists)
                    {
                        return BadRequest(new { message = "Mã nhân viên không tồn tại" });
                    }
                    entity.MaNV = dto.MaNV.Trim();
                }

                entity.TypeLV = dto.TypeLV?.Trim() ?? entity.TypeLV;
                entity.NgayBD = dto.NgayBD ?? entity.NgayBD;
                entity.NgayKT = dto.NgayKT ?? entity.NgayKT;
                entity.LyDo = dto.LyDo?.Trim() ?? entity.LyDo;
                entity.TrangThai = string.IsNullOrWhiteSpace(dto.TrangThai) ? entity.TrangThai : dto.TrangThai.Trim();

                if (dto.ImagesLV != null && dto.ImagesLV.Length > 0)
                {
                    var newImageName = await SaveImage(dto.ImagesLV, "imagesLeaves");
                    if (!string.IsNullOrEmpty(newImageName))
                    {
                        if (!string.IsNullOrEmpty(entity.ImagesLV))
                        {
                            DeleteImage(entity.ImagesLV, "imagesLeaves");
                        }
                        entity.ImagesLV = newImageName;
                    }
                }

                _context.leaves.Update(entity);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Cập nhật đơn nghỉ phép thành công", data = entity });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật đơn nghỉ phép: " + ex.Message });
            }
        }

        // DELETE: api/Leaves/{id} - Xóa đơn nghỉ phép
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var entity = await _context.leaves.FindAsync(id);
                if (entity == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn nghỉ phép" });
                }

                // Xóa hình ảnh nếu tồn tại
                if (!string.IsNullOrEmpty(entity.ImagesLV))
                {
                    DeleteImage(entity.ImagesLV, "imagesLeaves");
                }

                _context.leaves.Remove(entity);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa đơn nghỉ phép thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa đơn nghỉ phép: " + ex.Message });
            }
        }

        // Hàm hỗ trợ: Lưu hình ảnh
        private async Task<string?> SaveImage(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
                return null;

            try
            {
                const long maxFileSize = 5 * 1024 * 1024;
                if (file.Length > maxFileSize)
                {
                    throw new Exception("Kích thước file vượt quá 5MB");
                }

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    throw new Exception("Định dạng file không được hỗ trợ. Vui lòng chọn JPG, PNG, GIF hoặc WebP");
                }

                string uploadsFolder = Path.Combine(_env.WebRootPath, "public", folderName);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

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