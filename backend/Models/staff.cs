using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public partial class staff
{
    public string MaNV { get; set; } = null!;

    public string? TenNV { get; set; }

    public string? DiaChi { get; set; }

    public string? SDT { get; set; }

    public bool? GioiTinh { get; set; }
    public DateOnly? NgaySinh { get; set; }
    // ✅ CCD 12 SỐ
    [StringLength(12, MinimumLength = 12)]
    [RegularExpression(@"^[0-9]{12}$", ErrorMessage = "CCD phải đúng 12 số")]
    public string? CCD { get; set; }

    public decimal? LuongCoBan { get; set; }

    public string? NVImages { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? MaPhongBan { get; set; }

    public string? Role { get; set; }

    public virtual departments? MaPhongBanNavigation { get; set; }

    public virtual ICollection<cartdetail> cartdetail { get; set; } = new List<cartdetail>();

    public virtual ICollection<salary> salary { get; set; } = new List<salary>();

    public virtual ICollection<timekeeping> timekeeping { get; set; } = new List<timekeeping>();
}
