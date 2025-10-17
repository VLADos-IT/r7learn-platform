namespace R7L.Models;

public partial class UserCourseUnit
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CourseUnitId { get; set; }

    public int Degree { get; set; }

    public virtual CourseUnit CourseUnit { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
