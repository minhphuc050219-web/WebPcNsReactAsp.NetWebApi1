using System;
using System.Collections.Generic;
using backend.Models;


namespace backend.Dtos;
// DTO cho Create/Update Category
public class CategoryCreateUpdateDto
{
    public string? MaLoai { get; set; }
    public string? TenLoai { get; set; }
    public string? MaBrand { get; set; }
    public IFormFile? LoaiImages { get; set; }
}