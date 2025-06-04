using R7L.DTO.CourseUnit;

namespace R7L.Services.CourseUnit;

public interface ICourseUnitService
{
    Task<Models.CourseUnit> CreateCourseUnit(CourseUnitCreateDTO createDTO);

    Task UpdateCourseUnit(CourseUnitUpdateDTO updateDTO);

    Task ChangeCourseUnitOrderInCourse(int courseUnitId, int newOrderInCourse);

    Task DeleteCourseUnit(int courseUnitId);
}
