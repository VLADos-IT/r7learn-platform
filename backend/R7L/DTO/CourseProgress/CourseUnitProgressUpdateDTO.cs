using System.ComponentModel.DataAnnotations;

namespace R7L.DTO.CourseProgress;

public class CourseUnitProgressUpdateDTO
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int CourseUnitId { get; set; }

    [Required]
    public int Degree { get; set; }
}
