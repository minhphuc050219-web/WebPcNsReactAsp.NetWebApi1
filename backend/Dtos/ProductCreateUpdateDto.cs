using System;
using System.Collections.Generic;
using backend.Models;


namespace backend.Dtos;
// DTO cho Create/Update Product
public class ProductCreateUpdateDto
{
    public string? MaSanPham { get; set; }
    public string? TenSanPham { get; set; }
    public int? SoLuong { get; set; }
    public decimal? DonGia { get; set; }
    public DateOnly? NgayNhap { get; set; }
    public int? HanBaoHanh { get; set; }
    public string? ShortDescription { get; set; }
    public string? Description { get; set; }
    public bool? TinhTrangSanPham { get; set; }
    public bool? TrangThaiSanPham { get; set; }
    public string? MaLoai { get; set; }
    public string? MaBrand { get; set; }
    public IFormFile? HangHoaImages { get; set; }
}