using Microsoft.EntityFrameworkCore;
using R7L.Models;

namespace R7L;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<CourseUnit> CourseUnits { get; set; }

    public virtual DbSet<CourseUnitType> CourseUnitTypes { get; set; }

    public virtual DbSet<Test> Tests { get; set; }

    public virtual DbSet<TestQuestion> TestQuestions { get; set; }

    public virtual DbSet<TestQuestionOption> TestQuestionOptions { get; set; }

    public virtual DbSet<TestQuestionType> TestQuestionTypes { get; set; }

    public virtual DbSet<TestQuestionUserAnswer> TestQuestionUserAnswers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserCourseUnit> UserCourseUnits { get; set; }

    public virtual DbSet<UserCourseUnitComment> UserCourseUnitComments { get; set; }

    public virtual DbSet<UserPosition> UserPositions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("course_pkey");

            entity.ToTable("course");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.SystemName)
                .HasMaxLength(30)
                .HasColumnName("system_name");
        });

        modelBuilder.Entity<CourseUnit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("course_unit_pkey");

            entity.ToTable("course_unit");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CourseId).HasColumnName("course_id");
            entity.Property(e => e.CourseUnitTypeId).HasColumnName("course_unit_type_id");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.MaxDegree).HasColumnName("max_degree");
            entity.Property(e => e.Name)
                .HasMaxLength(180)
                .HasColumnName("name");
            entity.Property(e => e.OrderInCourse).HasColumnName("order_in_course");

            entity.HasOne(d => d.Course).WithMany(p => p.CourseUnits)
                .HasForeignKey(d => d.CourseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("course_unit_course_id_fkey");

            entity.HasOne(d => d.CourseUnitType).WithMany(p => p.CourseUnits)
                .HasForeignKey(d => d.CourseUnitTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("course_unit_course_unit_type_id_fkey");
        });

        modelBuilder.Entity<CourseUnitType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("course_unit_type_pkey");

            entity.ToTable("course_unit_type");

            entity.HasIndex(e => e.Name, "course_unit_type_name_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("test_pkey");

            entity.ToTable("test");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CourseUnitId).HasColumnName("course_unit_id");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .HasColumnName("description");

            entity.HasOne(d => d.CourseUnit).WithMany(p => p.Tests)
                .HasForeignKey(d => d.CourseUnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_course_unit_id_fkey");
        });

        modelBuilder.Entity<TestQuestion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("test_question_pkey");

            entity.ToTable("test_question");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Question)
                .HasMaxLength(200)
                .HasColumnName("question");
            entity.Property(e => e.TestId).HasColumnName("test_id");
            entity.Property(e => e.TypeId).HasColumnName("type_id");

            entity.HasOne(d => d.Test).WithMany(p => p.TestQuestions)
                .HasForeignKey(d => d.TestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_question_test_id_fkey");

            entity.HasOne(d => d.Type).WithMany(p => p.TestQuestions)
                .HasForeignKey(d => d.TypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_question_type_id_fkey");
        });

        modelBuilder.Entity<TestQuestionOption>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("test_question_option_pkey");

            entity.ToTable("test_question_option");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content)
                .HasMaxLength(255)
                .HasColumnName("content");
            entity.Property(e => e.IsCorrect)
                .HasColumnType("bit(1)")
                .HasColumnName("is_correct");
            entity.Property(e => e.QuestionId).HasColumnName("question_id");

            entity.HasOne(d => d.Question).WithMany(p => p.TestQuestionOptions)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_question_option_question_id_fkey");
        });

        modelBuilder.Entity<TestQuestionType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("test_question_type_pkey");

            entity.ToTable("test_question_type");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(20)
                .HasColumnName("name");
        });

        modelBuilder.Entity<TestQuestionUserAnswer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("test_question_user_answer_pkey");

            entity.ToTable("test_question_user_answer");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AnswerId).HasColumnName("answer_id");
            entity.Property(e => e.TestQuestionId).HasColumnName("test_question_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Answer).WithMany(p => p.TestQuestionUserAnswers)
                .HasForeignKey(d => d.AnswerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_question_user_answer_answer_id_fkey");

            entity.HasOne(d => d.TestQuestion).WithMany(p => p.TestQuestionUserAnswers)
                .HasForeignKey(d => d.TestQuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_question_user_answer_test_question_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.TestQuestionUserAnswers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("test_question_user_answer_user_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_pkey");

            entity.ToTable("user");

            entity.HasIndex(e => e.Email, "user_email_key").IsUnique();

            entity.HasIndex(e => e.Login, "user_login_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email)
                .HasMaxLength(120)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(20)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(20)
                .HasColumnName("last_name");
            entity.Property(e => e.Login)
                .HasMaxLength(25)
                .HasColumnName("login");
            entity.Property(e => e.Password)
                .HasMaxLength(44)
                .HasColumnName("password");
            entity.Property(e => e.PositionId).HasColumnName("position_id");
            entity.Property(e => e.RegistrationDate).HasColumnName("registration_date");

            entity.HasOne(d => d.Position).WithMany(p => p.Users)
                .HasForeignKey(d => d.PositionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_position_id_fkey");
        });

        modelBuilder.Entity<UserCourseUnit>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_course_unit_pkey");

            entity.ToTable("user_course_unit");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CourseUnitId).HasColumnName("course_unit_id");
            entity.Property(e => e.Degree).HasColumnName("degree");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.CourseUnit).WithMany(p => p.UserCourseUnits)
                .HasForeignKey(d => d.CourseUnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_course_unit_course_unit_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.UserCourseUnits)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_course_unit_user_id_fkey");
        });

        modelBuilder.Entity<UserCourseUnitComment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_course_unit_comment_pkey");

            entity.ToTable("user_course_unit_comment");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Content)
                .HasMaxLength(255)
                .HasColumnName("content");
            entity.Property(e => e.CourseUnitId).HasColumnName("course_unit_id");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false)
                .HasColumnName("is_deleted");
            entity.Property(e => e.ReplyTo).HasColumnName("reply_to");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.CourseUnit).WithMany(p => p.UserCourseUnitComments)
                .HasForeignKey(d => d.CourseUnitId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_course_unit_comment_course_unit_id_fkey");

            entity.HasOne(d => d.ReplyToNavigation).WithMany(p => p.InverseReplyToNavigation)
                .HasForeignKey(d => d.ReplyTo)
                .HasConstraintName("user_course_unit_comment_reply_to_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.UserCourseUnitComments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_course_unit_comment_user_id_fkey");
        });

        modelBuilder.Entity<UserPosition>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_position_pkey");

            entity.ToTable("user_position");

            entity.HasIndex(e => e.Name, "user_position_name_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(16)
                .HasColumnName("name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
