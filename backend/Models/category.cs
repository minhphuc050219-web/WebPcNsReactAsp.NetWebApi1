using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class category
{
    public string MaLoai { get; set; } = null!;

    public string TenLoai { get; set; } = null!;

    public string? LoaiImages { get; set; }

    public string? MaBrand { get; set; }

    public virtual brand? MaBrandNavigation { get; set; }

    public virtual ICollection<product> product { get; set; } = new List<product>();
}
