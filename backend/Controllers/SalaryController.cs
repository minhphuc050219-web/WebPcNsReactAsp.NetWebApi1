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
            return Ok(await _context.salary.ToListAsync());
        }

        // GET: api/Salary/{id} - Tìm kiếm salary theo tên Nhân viên
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                // Nếu để trống thì return tất cả
                if (id == 0)
                {
                    return Ok(await _context.product.ToListAsync());
                }

                var searchKeyword = id.ToString().ToLower().Trim();

                // Tìm kiếm theo tenNV
                var results = await _context.staff
                    .Where(p => p.MaNV.ToLower().Contains(searchKeyword) ||
                                (p.TenNV != null && p.TenNV.ToLower().Contains(searchKeyword)))
                    .ToListAsync();

                // Return results (empty array nếu không tìm thấy)
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tìm kiếm: " + ex.Message });
            }
        }

        
    }
}
