using R7L.Models;

namespace R7L.DTO.Test;

public class TestQuestionOptionReadDTO
{
    public int Id { get; set; }

    public string Content { get; set; }


    public TestQuestionOptionReadDTO(TestQuestionOption testQuestionOption)
    {
        Id = testQuestionOption.Id;
        Content = testQuestionOption.Content;
    }
}
