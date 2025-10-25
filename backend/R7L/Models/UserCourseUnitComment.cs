namespace R7L.Models;

public partial class UserCourseUnitComment
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CourseUnitId { get; set; }

    public int? ReplyTo { get; set; }

    public string Content { get; set; } = null!;

    public DateTime PublicationDateTime { get; set; }

    public bool IsDeleted { get; set; }

    public virtual CourseUnit CourseUnit { get; set; } = null!;

    public virtual ICollection<UserCourseUnitComment> InverseReplyToNavigation { get; set; } = new List<UserCourseUnitComment>();

    public virtual UserCourseUnitComment? ReplyToNavigation { get; set; }

    public virtual User User { get; set; } = null!;
}
