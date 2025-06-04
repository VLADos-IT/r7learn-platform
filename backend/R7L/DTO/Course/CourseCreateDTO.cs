using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.Course;

public class CourseCreateDTO
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string SystemName { get; set; }

    [Required]
    public string? Description { get; set; }
}
