using System;
using System.Collections.Generic;
using backend.Models;


namespace backend.Dtos;
// DTO cho Create/Update Staff
public class RegisterAndAccountDTO
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? DiaChi { get; set; }
        public string? DienThoai { get; set; }
        public bool? GioiTinh { get; set; }

        public IFormFile? Images { get; set; }
        public string? Role { get; set; } //  user
    }