using R7L.DTO.CourseProgress;
using R7L.Models;

namespace R7L.Services.CourseProgress;

public interface ICourseProgressService
{
    Task<List<UserCourseUnit>> GetUserCourseProgress(int courseId, int userId);

    Task<List<CourseUnitProgressReadDTO>> GetUserCourseProgressInReadDTOs(
        int courseId, int userId);

    Task UpdateCourseUnitUserProgress(CourseUnitProgressUpdateDTO progressUpdateDTO);
}
