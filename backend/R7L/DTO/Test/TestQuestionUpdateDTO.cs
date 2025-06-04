using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestQuestionUpdateDTO
{
    [Required]
    public int Id { get; set; }

    public string TypeName { get; set; }

    public string Question { get; set; }
}
