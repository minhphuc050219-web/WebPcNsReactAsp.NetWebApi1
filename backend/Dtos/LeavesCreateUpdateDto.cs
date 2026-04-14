namespace backend.Dtos;

// DTO cho Create/Update Leaves
public class LeavesCreateUpdateDto
{
    public string? MaNV { get; set; }
    public string? TypeLV { get; set; }
    public DateOnly? NgayBD { get; set; }
    public DateOnly? NgayKT { get; set; }
    public string? LyDo { get; set; }
    public IFormFile? ImagesLV { get; set; }
    public string? TrangThai { get; set; }
}