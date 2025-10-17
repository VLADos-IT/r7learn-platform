namespace R7L.Models;

public partial class Test
{
    public int Id { get; set; }

    public int CourseUnitId { get; set; }

    public string? Description { get; set; }

    public virtual CourseUnit CourseUnit { get; set; } = null!;

    public virtual ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();
}
