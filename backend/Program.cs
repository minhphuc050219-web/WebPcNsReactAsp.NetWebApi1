using Microsoft.EntityFrameworkCore;
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
// Thêm CORS service để đưa dữ liệu lên reactjs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
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
app.UseAuthorization();

app.MapControllers();
//app.MapGet("/", () => "Backend API is running 🚀");

app.Run();
