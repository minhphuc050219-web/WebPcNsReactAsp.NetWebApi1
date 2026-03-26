using System;
using System.Collections.Generic;


namespace backend.Models;

public partial class salary
{
    public int MaLuong { get; set; }

    public string? MaNV { get; set; }

    public int? Thang { get; set; }

    public int? Nam { get; set; }
    public decimal? LuongCoBan { get; set; }
    public decimal? PhuCap { get; set; }
    public decimal? Thuong { get; set; }

    public int? SoNgayCong { get; set; }

    public decimal? TongLuong { get; set; }

    public virtual staff? MaNVNavigation { get; set; }
}
