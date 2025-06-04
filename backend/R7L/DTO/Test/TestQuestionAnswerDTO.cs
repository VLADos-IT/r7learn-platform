using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestQuestionAnswerDTO
{
    [Required]
    public int QuestionId { get; set; }

    public List<int> Answers { get; set; } = new List<int>();
}
