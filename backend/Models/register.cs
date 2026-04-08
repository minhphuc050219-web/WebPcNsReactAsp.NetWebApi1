using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class register
{
    public int Id_Register { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? DiaChi { get; set; }

    public string? DienThoai { get; set; }

    public string? Role { get; set; }
    // 🔥 THÊM MỚI
    public bool? GioiTinh { get; set; }

    public string? Images { get; set; }
    // 🔥 NAVIGATION (1 account - 1 staff)
    public virtual staff? Staff { get; set; }
}
