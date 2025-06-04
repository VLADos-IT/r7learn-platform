using R7L.DTO.Course;

namespace R7L.Services.Course;

public interface ICourseService
{
    Task<List<Models.Course>> GetAllCourses();

    Task<List<CourseReadDTO>> GetAllCoursesInReadDTOs();

    Task<List<Models.CourseUnit>> GetOrderedCourseUnits(int courseId);

    Task<Models.Course> CreateCourse(CourseCreateDTO createDTO);

}
