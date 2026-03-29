using System;
using System.Collections.Generic;
using backend.Models;


namespace backend.Dtos;
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