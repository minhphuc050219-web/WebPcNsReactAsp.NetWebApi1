using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class brand
{
    public string MaBrand { get; set; } = null!;

    public string TenBrand { get; set; } = null!;

    public string? BrandImages { get; set; }

    public virtual ICollection<category> category { get; set; } = new List<category>();

    public virtual ICollection<product> product { get; set; } = new List<product>();
}
