using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class cartdetail
{
    public int MaCartDetail { get; set; }

    public int MaCart { get; set; }

    public string MaSanPham { get; set; } = null!;

    public string? MaNV { get; set; }

    public int? SoLuongSanPham { get; set; }

    public decimal? CostCart { get; set; }

    public virtual cart MaCartNavigation { get; set; } = null!;

    public virtual staff? MaNVNavigation { get; set; }

    public virtual product MaSanPhamNavigation { get; set; } = null!;
}
