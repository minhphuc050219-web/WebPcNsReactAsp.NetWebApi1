using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class cart
{
    public int MaCart { get; set; }

    public int? MaKhachHang { get; set; }

    public decimal? CostCart { get; set; }

    public bool? TrangThaiCart { get; set; }

    public virtual ICollection<cartdetail> cartdetail { get; set; } = new List<cartdetail>();
}
