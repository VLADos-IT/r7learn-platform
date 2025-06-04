using R7L.Models;

namespace R7L.DTO.Test;

public class TestQuestionReadDTO
{
    public int Id { get; set; }

    public string TypeName { get; set; }

    public string Question { get; set; }

    public List<TestQuestionOptionReadDTO> Options { get; set; }


    public TestQuestionReadDTO(TestQuestion testQuestion)
    {
        Id = testQuestion.Id;
        TypeName = testQuestion.Type.Name;
        Question = testQuestion.Question;

        Options = testQuestion.TestQuestionOptions
            .Select(tqo => new TestQuestionOptionReadDTO(tqo))
            .ToList();
    }
}
