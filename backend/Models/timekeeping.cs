using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class timekeeping
{
    public int IdChamCong { get; set; }

    public string? MaNV { get; set; }

    public DateOnly? TimeChamCong { get; set; }

    public virtual staff? MaNVNavigation { get; set; }
}
