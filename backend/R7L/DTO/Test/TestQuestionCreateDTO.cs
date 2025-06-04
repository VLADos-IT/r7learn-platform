using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestQuestionCreateDTO
{
    [Required]
    public int TestId { get; set; }

    [Required]
    public string TypeName { get; set; }

    [Required]
    public string Question { get; set; }
}
