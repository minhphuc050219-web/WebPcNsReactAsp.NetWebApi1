
using backend.Models;
using System;
using System.Collections.Generic;

namespace backend.Dtos;
 // DTO cho Create/Update Brand
    public class BrandCreateUpdateDto
    {
        public string? MaBrand { get; set; }
        public string? TenBrand { get; set; }
        public IFormFile? BrandImages { get; set; }
    }