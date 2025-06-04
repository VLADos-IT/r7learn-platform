using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.CourseUnit;

public class CourseUnitUpdateDTO
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public int MaxDegree { get; set; }
}