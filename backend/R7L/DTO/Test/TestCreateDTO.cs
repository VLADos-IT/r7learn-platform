using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Test;

public class TestCreateDTO
{
    [Required]
    public int CourseUnitId { get; set; }

    public string? Description { get; set; }
}
