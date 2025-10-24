namespace R7L.Models;

public partial class User
{
    public int Id { get; set; }

    public string Login { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int PositionId { get; set; }

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly RegistrationDate { get; set; }

    public virtual UserPosition Position { get; set; } = null!;

    public virtual ICollection<TestQuestionUserAnswer> TestQuestionUserAnswers { get; set; } = new List<TestQuestionUserAnswer>();

    public virtual ICollection<UserCourseUnitComment> UserCourseUnitComments { get; set; } = new List<UserCourseUnitComment>();

    public virtual ICollection<UserCourseUnit> UserCourseUnits { get; set; } = new List<UserCourseUnit>();
}
