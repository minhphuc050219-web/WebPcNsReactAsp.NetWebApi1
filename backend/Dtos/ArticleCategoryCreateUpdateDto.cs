using System;
using System.Collections.Generic;
using backend.Models;


namespace backend.Dtos;
// DTO cho Create/Update ArticleCategory
public class ArticleCategoryCreateUpdateDto
{
    public string? MaLoaiBV { get; set; }
    public string? TenLoaiBV { get; set; }
    public int? ThuTuBV { get; set; }
}