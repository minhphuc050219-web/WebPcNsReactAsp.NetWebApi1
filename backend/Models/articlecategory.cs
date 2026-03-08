using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class articlecategory
{
    public string MaLoaiBV { get; set; } = null!;

    public string? TenLoaiBV { get; set; }

    public int? ThuTuBV { get; set; }

    public virtual ICollection<article> article { get; set; } = new List<article>();
}
