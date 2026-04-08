using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.Models;
using backend.Dtos;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config; // đọc cấu hình từ appsettings.json (JWT Key, Issuer, Audience)

        public AccountController(AppDbContext context, IWebHostEnvironment env, IConfiguration config)
        {
            _context = context;
            _env = env;
            _config = config;
        }
        // GET: api/Staff - Lấy tất cả staff
        // ================= GET =================
        [HttpGet("List-account")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.register.ToListAsync());
        }

        // ================= LOGIN =================
        // POST api/Account/login
        // Nhận { email, password } dạng JSON (không phải form)
        // Kiểm tra email tồn tại, verify password hash, rồi tạo JWT token
        // Trả về: { token, id, username, email, role, images }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
                return BadRequest("Email và Password không được để trống");

            var user = await _context.register.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if (user == null)
                return Unauthorized("Email không tồn tại");

            // So sánh password người dùng nhập với hash đã lưu trong DB
            var hasher = new PasswordHasher<string>();
            var result = hasher.VerifyHashedPassword(string.Empty, user.Password!, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Mật khẩu không đúng");

            // Tạo JWT token chứa thông tin user (id, email, username, role)
            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,                    // JWT token gửi về frontend để lưu và gửi kèm request sau
                id        = user.Id_Register,
                username  = user.Username,
                email     = user.Email,
                role      = user.Role,   // frontend dùng role này để quyết định vào trang nào
                images    = user.Images
            });
        }

        // Tạo JWT token chứa các thông tin nhận dạng người dùng (claims)
        // Token hết hạn sau 7 ngày, được ký bằng HMAC-SHA256
        private string GenerateJwtToken(register user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Claims là các thông tin được nhúng vào bên trong token
            // Backend có thể đọc claims này mà không cần query DB
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id_Register.ToString()), // id
                new Claim(ClaimTypes.Email, user.Email ?? ""),                     // email
                new Claim(ClaimTypes.Name, user.Username ?? ""),                   // tên
                new Claim(ClaimTypes.Role, user.Role ?? "user"),                   // role - dùng cho [Authorize(Roles="admin")]
            };

            var token = new JwtSecurityToken(
                issuer:   _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims:   claims,
                expires:  DateTime.UtcNow.AddDays(7), // token hết hạn sau 7 ngày
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // ================= REGISTER USER =================
        //thêm (đăng ký tài khoản) ở trang register cho user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterAndAccountDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest("Email và Password không được để trống");
            }
            // 1. Check email tồn tại
            var exists = await _context.register.AnyAsync(x => x.Email == dto.Email);
            if (exists)
            {
                return BadRequest("Email đã tồn tại");
            }
            // 2. Hash password
            var hasher = new PasswordHasher<string>();

            string? imageName = null;
            if (dto.Images != null)
                imageName = await SaveImage(dto.Images, "imagesAccount");
            // 3. Lưu vào bảng register
            var user = new register
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = hasher.HashPassword(string.Empty, dto.Password),
                DiaChi = dto.DiaChi,
                DienThoai = dto.DienThoai,
                GioiTinh = dto.GioiTinh,
                Role = "user",// 🔥 FIX CỨNG
                Images = imageName
            };

            _context.register.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Đăng ký thành công");
        }

        // thêm (đăng ký tài khoản) ở trang admin cho admin tạo tài khoản cho staff hoặc admin khác
        [HttpPost("create-by-admin")]
        public async Task<IActionResult> CreateAccount([FromForm] RegisterAndAccountDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            {
                return BadRequest("Email và Password không được để trống");
            }

            // 🔥 FIX: CHECK EMAIL TRÙNG
            var exists = await _context.register.AnyAsync(x => x.Email == dto.Email);
            if (exists)
            {
                return BadRequest("Email đã tồn tại");
            }

            var hasher = new PasswordHasher<string>();

            string? accImg = null;
            string? staffImg = null;

            // 🔥 LƯU ẢNH ACCOUNT
            if (dto.Images != null)
                accImg = await SaveImage(dto.Images, "imagesAccount");

            var role = (dto.Role ?? "user").ToLower();

            // Lưu ảnh staff bằng cách copy từ ảnh account để tránh đọc stream upload 2 lần.
            if ((role == "admin" || role == "staff" || role == "manager" || role == "leader") && !string.IsNullOrEmpty(accImg))
            {
                staffImg = CopyImageToFolder(accImg, "imagesAccount", "imagesStaff");
            }

            var user = new register
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = hasher.HashPassword(string.Empty, dto.Password),
                DiaChi = dto.DiaChi,
                DienThoai = dto.DienThoai,
                GioiTinh = dto.GioiTinh,
                Role = role,
                Images = accImg,
            };

            _context.register.Add(user);
            await _context.SaveChangesAsync();

            // 🔥 TẠO STAFF NẾU KHÔNG PHẢI USER
            if (role != "user")
            {
                var staff = new staff
                {
                    MaNV = GenerateMaNV(),
                    TenNV = user.Username,
                    Email = user.Email,
                    Password = user.Password,
                    DiaChi = user.DiaChi,
                    SDT = user.DienThoai,
                    GioiTinh = user.GioiTinh,
                    Role = role,
                    Id_Register = user.Id_Register,
                    NVImages = staffImg
                };

                _context.staff.Add(staff);
                await _context.SaveChangesAsync();
            }

            return Ok("Tạo account thành công");
        }
            // Hàm random mã nhân viên nếu tại tài khoản có role là admin nhưng chưa có staff
        private string GenerateMaNV()
        {
            var last = _context.staff.OrderByDescending(x => x.MaNV).FirstOrDefault();

            int number = 1;

            if (last != null)
            {
                number = int.Parse(last.MaNV.Substring(2)) + 1;
            }

            return "NV" + number.ToString("D6");
        }
        // cập nhật account ở trang admin
        // ================= UPDATE =================
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAccount(int id, [FromForm] RegisterAndAccountDTO dto)
        {
            var user = await _context.register.FindAsync(id);
            if (user == null)
                return NotFound("Account không tồn tại");

            var allowedRoles = new[] { "user", "admin", "manager", "staff", "leader" };
            var oldRole = (user.Role ?? "user").ToLower();
            var newRole = (dto.Role ?? user.Role ?? "user").ToLower();

            if (!allowedRoles.Contains(newRole))
                return BadRequest("Role không hợp lệ");

            // Chỉ cho phép đổi role từ user -> các chức vụ, không cho đổi ngược/chéo giữa các chức vụ.
            if (oldRole != "user" && oldRole != newRole)
                return BadRequest("Chỉ cho phép đổi role từ user sang admin/manager/staff/leader");

            if (!string.IsNullOrEmpty(dto.Email) &&
                !dto.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase))
            {
                var existedEmail = await _context.register
                    .AnyAsync(x => x.Email == dto.Email && x.Id_Register != id);
                if (existedEmail)
                    return BadRequest("Email đã tồn tại");
            }

            var hasher = new PasswordHasher<string>();

            user.Username = dto.Username ?? user.Username;
            user.Email = dto.Email ?? user.Email;
            user.DiaChi = dto.DiaChi ?? user.DiaChi;
            user.DienThoai = dto.DienThoai ?? user.DienThoai;
            user.GioiTinh = dto.GioiTinh ?? user.GioiTinh;
            user.Role = newRole;

            if (!string.IsNullOrEmpty(dto.Password))
                user.Password = hasher.HashPassword(string.Empty, dto.Password);

            // Cập nhật ảnh account
            if (dto.Images != null)
            {
                if (!string.IsNullOrEmpty(user.Images))
                    DeleteImage(user.Images, "imagesAccount");

                user.Images = await SaveImage(dto.Images, "imagesAccount");
            }

            var isStaffRole = newRole == "admin" || newRole == "manager" || newRole == "staff" || newRole == "leader";
            var staffEntity = await _context.staff.FirstOrDefaultAsync(x => x.Id_Register == user.Id_Register);

            if (isStaffRole)
            {
                string? staffImage = staffEntity?.NVImages;

                if (dto.Images != null)
                {
                    if (!string.IsNullOrEmpty(staffImage))
                        DeleteImage(staffImage, "imagesStaff");

                    staffImage = !string.IsNullOrEmpty(user.Images)
                        ? CopyImageToFolder(user.Images, "imagesAccount", "imagesStaff")
                        : null;
                }
                else if (staffEntity == null && !string.IsNullOrEmpty(user.Images))
                {
                    // Khi nâng role mà không upload ảnh mới, copy ảnh account sang thư mục staff.
                    staffImage = CopyImageToFolder(user.Images, "imagesAccount", "imagesStaff");
                }

                if (staffEntity == null)
                {
                    staffEntity = new staff
                    {
                        MaNV = GenerateMaNV(),
                        TenNV = user.Username,
                        Email = user.Email,
                        Password = user.Password,
                        DiaChi = user.DiaChi,
                        SDT = user.DienThoai,
                        GioiTinh = user.GioiTinh,
                        Role = newRole,
                        Id_Register = user.Id_Register,
                        NVImages = staffImage
                    };

                    _context.staff.Add(staffEntity);
                }
                else
                {
                    staffEntity.TenNV = user.Username;
                    staffEntity.Email = user.Email;
                    staffEntity.Password = user.Password;
                    staffEntity.DiaChi = user.DiaChi;
                    staffEntity.SDT = user.DienThoai;
                    staffEntity.GioiTinh = user.GioiTinh;
                    staffEntity.Role = newRole;
                    staffEntity.NVImages = staffImage;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật account thành công", data = user });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var user = await _context.register.FindAsync(id);

            if (user == null)
                return NotFound("Không tìm thấy account");

            if ((user.Role ?? "").ToLower() == "admin" || (user.Role ?? "").ToLower() == "staff" || (user.Role ?? "").ToLower() == "manager" || (user.Role ?? "").ToLower() == "leader")
            {
                return BadRequest("Không thể xóa tài khoản admin và các chức vụ trong công ty");
            }

            var staff = await _context.staff
                .FirstOrDefaultAsync(x => x.Id_Register == id);

            // 🔥 CHECK NULL TRƯỚC KHI DÙNG
            if (staff != null)
            {
                if (!string.IsNullOrEmpty(staff.NVImages))
                {
                    DeleteImage(staff.NVImages, "imagesStaff");
                }

                _context.staff.Remove(staff);
            }

            // 🔥 XÓA ẢNH ACCOUNT
            if (!string.IsNullOrEmpty(user.Images))
            {
                DeleteImage(user.Images, "imagesAccount");
            }

            _context.register.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("Xóa account thành công");
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

        // 🔥 GET ACCOUNT BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.register.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "Không tìm thấy account" });

            return Ok(user);
        }

        // 🔥 SEARCH ACCOUNT THEO TÊN
        [HttpGet("search/{keyword}")]
        public async Task<IActionResult> Search(string keyword)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(keyword))
                {
                    return Ok(await _context.register.ToListAsync());
                }

                var searchKeyword = keyword.ToLower().Trim();

                var results = await _context.register
                    .Where(x => (x.Username ?? string.Empty).ToLower().Contains(searchKeyword)
                    || (x.Email ?? string.Empty).ToLower().Contains(searchKeyword))
                    .ToListAsync();

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi khi tìm kiếm: " + ex.Message
                });
            }
        }

        // Copy file ảnh giữa 2 thư mục public, trả về tên file mới trong thư mục đích.
        private string? CopyImageToFolder(string fileName, string sourceFolder, string destinationFolder)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(fileName))
                    return null;

                var sourcePath = Path.Combine(_env.WebRootPath, "public", sourceFolder, fileName);
                if (!System.IO.File.Exists(sourcePath))
                    return null;

                var extension = Path.GetExtension(fileName).ToLower();
                var destinationDir = Path.Combine(_env.WebRootPath, "public", destinationFolder);
                if (!Directory.Exists(destinationDir))
                    Directory.CreateDirectory(destinationDir);

                var destinationFileName = Guid.NewGuid().ToString() + "_" + DateTime.Now.Ticks + extension;
                var destinationPath = Path.Combine(destinationDir, destinationFileName);

                System.IO.File.Copy(sourcePath, destinationPath, true);
                return destinationFileName;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi copy hình ảnh: " + ex.Message);
                return null;
            }
        }
    }
}
