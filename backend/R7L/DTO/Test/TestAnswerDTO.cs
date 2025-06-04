using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestAnswerDTO
{
    [Required]
    public int TestId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public List<TestQuestionAnswerDTO> QuestionsAnswers { get; set; } =
        new List<TestQuestionAnswerDTO>();
}
