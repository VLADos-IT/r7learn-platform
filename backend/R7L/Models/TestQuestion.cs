namespace R7L.Models;

public partial class TestQuestion
{
    public int Id { get; set; }

    public int TestId { get; set; }

    public int TypeId { get; set; }

    public string Question { get; set; } = null!;

    public virtual Test Test { get; set; } = null!;

    public virtual ICollection<TestQuestionOption> TestQuestionOptions { get; set; } = new List<TestQuestionOption>();

    public virtual ICollection<TestQuestionUserAnswer> TestQuestionUserAnswers { get; set; } = new List<TestQuestionUserAnswer>();

    public virtual TestQuestionType Type { get; set; } = null!;
}
