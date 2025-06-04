using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestQuestionOptionCreateDTO
{
    [Required]
    public int QuestionId { get; set; }

    [Required]
    public string Content { get; set; }

    [Required]
    public bool IsCorrect { get; set; }
}
