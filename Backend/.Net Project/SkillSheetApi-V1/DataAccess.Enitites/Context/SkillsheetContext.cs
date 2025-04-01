using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using DataAccess.Entities;
namespace DataAccess.Entities.Context;
public partial class SkillsheetContext : DbContext
{
    public SkillsheetContext()
    {
    }

    public SkillsheetContext(DbContextOptions<SkillsheetContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserDetail> Userdetails { get; set; }

    public virtual DbSet<UserSkill> Userskills { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=skillsheet;Username=postgres;Password=ub@44qwe");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("skills_pkey");

            entity.ToTable("skills");

            entity.Property(e => e.SkillId)
                .HasDefaultValueSql("nextval('skills_skillid_seq'::regclass)")
                .HasColumnName("skillId");
            entity.Property(e => e.Category)
                .HasMaxLength(100)
                .HasColumnName("category");
            entity.Property(e => e.SkillName)
                .HasMaxLength(100)
                .HasColumnName("skillName");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pkey");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_key").IsUnique();

            entity.Property(e => e.UserId)
                .HasDefaultValueSql("nextval('users_userid_seq'::regclass)")
                .HasColumnName("userId");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdDate");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.IsActive)
                .HasDefaultValue(true)
                .HasColumnName("isActive");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Role)
                .HasMaxLength(50)
                .HasColumnName("role");
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("userdetails_pkey");

            entity.ToTable("userdetails");

            entity.HasIndex(e => e.UserId, "userdetails_userid_key").IsUnique();

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("userId");
            entity.Property(e => e.BirthDate).HasColumnName("birthDate");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .HasColumnName("gender");
            entity.Property(e => e.JoiningDate).HasColumnName("joiningDate");
            entity.Property(e => e.PhotoPath)
                .HasMaxLength(255)
                .HasColumnName("photoPath");
            entity.Property(e => e.Qualifications).HasColumnName("qualifications");
            entity.Property(e => e.WorkedInJapan)
                .HasDefaultValue(false)
                .HasColumnName("workedInJapan");

            entity.HasOne(d => d.User).WithOne(p => p.UserDetail)
                .HasForeignKey<UserDetail>(d => d.UserId)
                .HasConstraintName("userdetails_userid_fkey");
        });

        modelBuilder.Entity<UserSkill>(entity =>
        {
            entity.HasKey(e => e.UserSkillId).HasName("userskills_pkey");

            entity.ToTable("userskills");

            entity.Property(e => e.UserSkillId)
                .HasDefaultValueSql("nextval('userskills_userskillid_seq'::regclass)")
                .HasColumnName("userSkillId");
            entity.Property(e => e.DateAdded)
                .HasDefaultValueSql("CURRENT_DATE")
                .HasColumnName("dateAdded");
            entity.Property(e => e.Experience).HasColumnName("experience");
            entity.Property(e => e.SkillId).HasColumnName("skillId");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.Skill).WithMany(p => p.Userskills)
                .HasForeignKey(d => d.SkillId)
                .HasConstraintName("userskills_skillid_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Userskills)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("userskills_userid_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
