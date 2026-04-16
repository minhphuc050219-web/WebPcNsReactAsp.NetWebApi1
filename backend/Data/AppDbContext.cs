using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using backend.Models;

namespace backend.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<article> article { get; set; }

    public virtual DbSet<articlecategory> articlecategory { get; set; }

    public virtual DbSet<brand> brand { get; set; }

    public virtual DbSet<cart> cart { get; set; }

    public virtual DbSet<cartdetail> cartdetail { get; set; }

    public virtual DbSet<category> category { get; set; }

    public virtual DbSet<departments> departments { get; set; }

    public virtual DbSet<leaves> leaves { get; set; }

    public virtual DbSet<product> product { get; set; }

    public virtual DbSet<register> register { get; set; }

    public virtual DbSet<salary> salary { get; set; }

    public virtual DbSet<staff> staff { get; set; }

    public virtual DbSet<timekeeping> timekeeping { get; set; }
        public virtual DbSet<order> order { get; set; }
    public virtual DbSet<orderdetail> orderdetail { get; set; }

    //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    //=> optionsBuilder.UseMySql("server=localhost;port=3306;database=web_pc_shop;user=root", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.3.0-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<article>(entity =>
        {
            entity.HasKey(e => e.MaBV).HasName("PRIMARY");

            entity.HasIndex(e => e.MaLoaiBV, "fk_article_category");

            entity.Property(e => e.MaBV)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.BVImages).HasMaxLength(255);
            entity.Property(e => e.MaLoaiBV)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.NoiDungBV).HasColumnType("text");
            entity.Property(e => e.TenBV).HasMaxLength(200);
            entity.Property(e => e.TomTatBV).HasMaxLength(255);

            entity.HasOne(d => d.MaLoaiBVNavigation).WithMany(p => p.article)
                .HasForeignKey(d => d.MaLoaiBV)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_article_category");
        });

        modelBuilder.Entity<articlecategory>(entity =>
        {
            entity.HasKey(e => e.MaLoaiBV).HasName("PRIMARY");

            entity.Property(e => e.MaLoaiBV)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.TenLoaiBV).HasMaxLength(100);
        });

        modelBuilder.Entity<brand>(entity =>
        {
            entity.HasKey(e => e.MaBrand).HasName("PRIMARY");

            entity.Property(e => e.MaBrand)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.BrandImages).HasMaxLength(255);
            entity.Property(e => e.TenBrand).HasMaxLength(100);
        });

        modelBuilder.Entity<cart>(entity =>
        {
            entity.HasKey(e => e.MaCart).HasName("PRIMARY");

            entity.Property(e => e.CostCart).HasPrecision(15, 2);
        });

        modelBuilder.Entity<cartdetail>(entity =>
        {
            entity.HasKey(e => e.MaCartDetail).HasName("PRIMARY");

            entity.HasIndex(e => e.MaCart, "fk_cartdetail_cart");

            entity.HasIndex(e => e.MaSanPham, "fk_cartdetail_product");

            entity.HasIndex(e => e.MaNV, "fk_cartdetail_staff");

            entity.Property(e => e.CostCart).HasPrecision(15, 2);
            entity.Property(e => e.MaNV)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.MaSanPham)
                .HasMaxLength(10)
                .IsFixedLength();

            entity.HasOne(d => d.MaCartNavigation).WithMany(p => p.cartdetail)
                .HasForeignKey(d => d.MaCart)
                .HasConstraintName("fk_cartdetail_cart");

            entity.HasOne(d => d.MaNVNavigation).WithMany(p => p.cartdetail)
                .HasForeignKey(d => d.MaNV)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_cartdetail_staff");

            entity.HasOne(d => d.MaSanPhamNavigation).WithMany(p => p.cartdetail)
                .HasForeignKey(d => d.MaSanPham)
                .HasConstraintName("fk_cartdetail_product");
        });
  

        modelBuilder.Entity<category>(entity =>
        {
            entity.HasKey(e => e.MaLoai).HasName("PRIMARY");

            entity.Property(e => e.MaLoai)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.LoaiImages).HasMaxLength(255);

            entity.Property(e => e.TenLoai).HasMaxLength(100);

        });

        modelBuilder.Entity<departments>(entity =>
        {
            entity.HasKey(e => e.MaPhongBan).HasName("PRIMARY");

            entity.Property(e => e.MaPhongBan)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SoLuongNV).HasDefaultValueSql("'0'");
            entity.Property(e => e.TenPhongBan).HasMaxLength(100);
        });

        modelBuilder.Entity<leaves>(entity =>
        {
            entity.HasKey(e => e.MaLV).HasName("PRIMARY");

            entity.HasIndex(e => e.MaNV, "fk_leaves_staff");

            entity.Property(e => e.MaNV)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ImagesLV).HasMaxLength(255);
            entity.Property(e => e.LyDo).HasColumnType("text");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(50)
                .HasDefaultValue("Chờ duyệt");
            entity.Property(e => e.TypeLV).HasMaxLength(100);

            entity.HasOne(d => d.MaNVNavigation).WithMany(p => p.leaves)
                .HasForeignKey(d => d.MaNV)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_leaves_staff");
        });

        modelBuilder.Entity<product>(entity =>
        {
            entity.HasKey(e => e.MaSanPham).HasName("PRIMARY");

            entity.HasIndex(e => e.MaBrand, "fk_product_brand");

            entity.HasIndex(e => e.MaLoai, "fk_product_category");

            entity.Property(e => e.MaSanPham)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.DonGia).HasPrecision(15, 2);
            entity.Property(e => e.HangHoaImages).HasMaxLength(255);
            entity.Property(e => e.MaBrand)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.MaLoai)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.ShortDescription).HasMaxLength(255);
            entity.Property(e => e.SoLuong).HasDefaultValueSql("'0'");
            entity.Property(e => e.TenSanPham).HasMaxLength(200);

            entity.HasOne(d => d.MaBrandNavigation).WithMany(p => p.product)
                .HasForeignKey(d => d.MaBrand)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_product_brand");

            entity.HasOne(d => d.MaLoaiNavigation).WithMany(p => p.product)
                .HasForeignKey(d => d.MaLoai)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_product_category");
        });

        modelBuilder.Entity<register>(entity =>
        {
            entity.HasKey(e => e.Id_Register).HasName("PRIMARY");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.DienThoai).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Role).HasMaxLength(20);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        modelBuilder.Entity<salary>(entity =>
        {
            entity.HasKey(e => e.MaLuong).HasName("PRIMARY");

            entity.HasIndex(e => e.MaNV, "fk_salary_staff");

            entity.Property(e => e.MaNV)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.LuongCoBan).HasPrecision(15, 2);
            entity.Property(e => e.PhuCap).HasPrecision(15, 2);
            entity.Property(e => e.Thuong).HasPrecision(15, 2);
            entity.Property(e => e.TongLuong).HasPrecision(15, 2);

            entity.HasOne(d => d.MaNVNavigation).WithMany(p => p.salary)
                .HasForeignKey(d => d.MaNV)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_salary_staff");
        });

        modelBuilder.Entity<staff>(entity =>
        {
            entity.HasKey(e => e.MaNV).HasName("PRIMARY");

            entity.HasIndex(e => e.Email, "Email").IsUnique();

            entity.HasIndex(e => e.MaPhongBan, "fk_staff_department");

            entity.Property(e => e.MaNV)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.LuongCoBan).HasPrecision(15, 2);
            entity.Property(e => e.MaPhongBan)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.NVImages).HasMaxLength(255);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Role).HasMaxLength(20);
            entity.Property(e => e.SDT).HasMaxLength(20);
            entity.Property(e => e.TenNV).HasMaxLength(100);

            entity.HasOne(d => d.MaPhongBanNavigation).WithMany(p => p.staff)
                .HasForeignKey(d => d.MaPhongBan)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_staff_department");
        });
        modelBuilder.Entity<staff>()
        .HasOne(s => s.Register)
        .WithOne(r => r.Staff)
        .HasForeignKey<staff>(s => s.Id_Register)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<timekeeping>(entity =>
        {
            entity.HasKey(e => e.IdChamCong).HasName("PRIMARY");

            entity.HasIndex(e => e.MaNV, "fk_timekeeping_staff");

            entity.Property(e => e.MaNV)
                .HasMaxLength(10)
                .IsFixedLength();

            entity.HasOne(d => d.MaNVNavigation).WithMany(p => p.timekeeping)
                .HasForeignKey(d => d.MaNV)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_timekeeping_staff");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
