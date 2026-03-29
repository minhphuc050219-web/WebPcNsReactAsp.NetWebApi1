using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegisterController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _context.register.ToListAsync());
        }
        [HttpPost("register")]
        public IActionResult Register(RegisterDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
    {
        return BadRequest("Email và Password không được để trống");
    }
            // 1. Check email tồn tại
            var existingUser = _context.register
                .FirstOrDefault(x => x.Email == dto.Email);

            if (existingUser != null)
            {
                return BadRequest("Email đã tồn tại");
            }
            // 2. Hash password
            var hasher = new PasswordHasher<string>();
            var passwordHash = hasher.HashPassword(null, dto.Password);
            
            // 3. Lưu vào bảng register
            var user = new register
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = passwordHash,
                DiaChi = dto.DiaChi,
                DienThoai = dto.DienThoai,
                Role = dto.Role ?? "user"
            };
            _context.register.Add(user);
            //_context.SaveChanges();

            // 4. Nếu là admin → thêm vào staff
            if ((user.Role ?? "").ToLower() == "admin")
            {
                var Staff = new staff
                {
                    MaNV = GenerateMaNV(),
                    TenNV = user.Username,
                    Email = user.Email,
                    Password = user.Password,
                    Role = "admin"
                };

                _context.staff.Add(Staff);
                //_context.SaveChanges();
            }
            _context.SaveChanges();
            return Ok("Đăng ký thành công");
        }

        // Hàm random mã nhân viên
        private string GenerateMaNV()
        {
           string ma;
    do
    {
        ma = "NV" + new Random().Next(100000, 999999);
    } while (_context.staff.Any(x => x.MaNV == ma));

    return ma;
        }
    }
    public class RegisterDTO
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? DiaChi { get; set; }
    public string? DienThoai { get; set; }
    public string? Role { get; set; } // admin hoặc user
}
}
