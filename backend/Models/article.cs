using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class article
{
    public string MaBV { get; set; } = null!;

    public string? TenBV { get; set; }

    public string? TomTatBV { get; set; }

    public string? NoiDungBV { get; set; }

    public string? MaLoaiBV { get; set; }

    public bool? TrangThaiBV { get; set; }

    public string? BVImages { get; set; }

    public virtual articlecategory? MaLoaiBVNavigation { get; set; }
}
