using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestUpdateDTO
{
    [Required]
    public int Id { get; set; }

    public string? Description { get; set; }
}
