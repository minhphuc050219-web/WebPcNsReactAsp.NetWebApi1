using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class departments
{
    public string MaPhongBan { get; set; } = null!;

    public string? TenPhongBan { get; set; }

    public int? SoLuongNV { get; set; }

    public virtual ICollection<staff> staff { get; set; } = new List<staff>();
}
