using System;

namespace backend.Models;

public partial class leaves
{
    public int MaLV { get; set; }

    public string MaNV { get; set; } = null!;

    public string? TypeLV { get; set; }

    public DateOnly? NgayBD { get; set; }

    public DateOnly? NgayKT { get; set; }

    public string? LyDo { get; set; }

    public string? ImagesLV { get; set; }

    public string? TrangThai { get; set; }

    public virtual staff? MaNVNavigation { get; set; }
}