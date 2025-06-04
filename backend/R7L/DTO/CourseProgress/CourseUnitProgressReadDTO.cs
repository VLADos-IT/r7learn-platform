using R7L.Models;

namespace R7L.DTO.CourseProgress;

public class CourseUnitProgressReadDTO
{
    public int CourseUnitId { get; set; }

    public int Degree { get; set; }


    public CourseUnitProgressReadDTO(UserCourseUnit userCourseUnit)
    {
        CourseUnitId = userCourseUnit.CourseUnitId;
        Degree = userCourseUnit.Degree;
    }
}
