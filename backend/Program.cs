using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Data;

var builder = WebApplication.CreateBuilder(args);

// ===== SERVICES =====
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔥 KẾT NỐI MYSQL
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")
        )
    );
});
builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
// ===== JWT AUTHENTICATION =====
// Đọc Key bí mật từ appsettings.json để ký token
var jwtKey = builder.Configuration["Jwt:Key"]!;

// Đăng ký dịch vụ xác thực JWT cho toàn bộ ứng dụng
// DefaultAuthenticateScheme: mỗi request đến sẽ tự động đọc Bearer token trong Header
// DefaultChallengeScheme: nếu không có token hoặc token sai → trả về 401 Unauthorized
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,           // kiểm tra Issuer có khớp appsettings không
        ValidateAudience = true,         // kiểm tra Audience có khớp không
        ValidateLifetime = true,         // kiểm tra token còn hạn không
        ValidateIssuerSigningKey = true, // kiểm tra chữ ký bằng Key bí mật
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Thêm CORS service để đưa dữ liệu lên reactjs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
});
var app = builder.Build();

// 🔥 Swagger mở mặc định
app.UseSwagger();
//app.UseSwaggerUI();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; // 👉 Quan trọng: mở là vào Swagger luôn
});

app.UseHttpsRedirection();

// 🔥 Enable Static Files - cho phép truy cập thư mục public
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowReact");
app.UseAuthentication(); // BẮT BUỘC đặt TRƯỚC UseAuthorization - đọc và xác thực JWT token từ Header
app.UseAuthorization(); // sau khi có thông tin user từ token, kiểm tra [Authorize] trên controller

app.MapControllers();
//app.MapGet("/", () => "Backend API is running 🚀");

app.Run();
