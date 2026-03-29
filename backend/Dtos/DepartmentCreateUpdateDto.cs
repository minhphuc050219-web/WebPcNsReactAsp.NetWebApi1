using System;
using System.Collections.Generic;
using backend.Models;


namespace backend.Dtos;
// DTO cho Create/Update Department
public class DepartmentCreateUpdateDto
{
    public string? MaPhongBan { get; set; }
    public string? TenPhongBan { get; set; }
    public int? SoLuongNV { get; set; }
}