namespace R7L.Models;

public partial class TestQuestionType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();
}
