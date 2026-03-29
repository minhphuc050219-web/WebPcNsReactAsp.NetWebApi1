using System;
using System.Collections.Generic;
using backend.Models;


namespace backend.Dtos;
// DTO cho Create/Update Article
public class ArticleCreateUpdateDto
{
    public string? MaBV { get; set; }
    public string TenBV { get; set; } = null!;
    public string? TomTatBV { get; set; }
    public string? NoiDungBV { get; set; }
    public string? MaLoaiBV { get; set; }
    public bool? TrangThaiBV { get; set; }
    public IFormFile? BVImages { get; set; }
}