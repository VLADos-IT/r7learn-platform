using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.CourseUnit;

public class CourseUnitCreateDTO
{
    [Required]
    public int CourseId { get; set; }

    [Required]
    public int OrderInCourse { get; set; }

    [Required]
    public string CourseUnitTypeName { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public int MaxDegree { get; set; }
}