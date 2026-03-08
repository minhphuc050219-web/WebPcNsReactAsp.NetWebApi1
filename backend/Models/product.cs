using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class product
{
    public string MaSanPham { get; set; } = null!;

    public string? TenSanPham { get; set; }

    public int? SoLuong { get; set; }

    public decimal? DonGia { get; set; }

    public string? HangHoaImages { get; set; }

    public DateOnly? NgayNhap { get; set; }

    public int? HanBaoHanh { get; set; }

    public string? ShortDescription { get; set; }

    public string? Description { get; set; }

    public bool? TinhTrangSanPham { get; set; }

    public bool? TrangThaiSanPham { get; set; }

    public string? MaLoai { get; set; }

    public string? MaBrand { get; set; }

    public virtual brand? MaBrandNavigation { get; set; }

    public virtual category? MaLoaiNavigation { get; set; }

    public virtual ICollection<cartdetail> cartdetail { get; set; } = new List<cartdetail>();
}
