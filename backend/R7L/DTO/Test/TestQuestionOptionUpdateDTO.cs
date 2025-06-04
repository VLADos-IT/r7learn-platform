using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestQuestionOptionUpdateDTO
{   
    [Required]
    public int Id { get; set; }

    public string Content { get; set; }

    public bool IsCorrect { get; set; }
}
