using Microsoft.EntityFrameworkCore;
using R7L.DTO.CourseProgress;
using R7L.Models;

namespace R7L.Services.CourseProgress;

public class CourseProgressService : ICourseProgressService
{
    private readonly AppDbContext _context;


    public CourseProgressService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<List<UserCourseUnit>> GetUserCourseProgress(int courseId, int userId)
    {
        List<int> courseUnitsIds = await GetAllCourseUnitsIds(courseId);

        List<UserCourseUnit> userCourseUnitsProgress = await _context.UserCourseUnits
            .Where(ucu => ucu.UserId == userId
                          && courseUnitsIds.Contains(ucu.CourseUnitId))
            .ToListAsync();

        return userCourseUnitsProgress;
    }

    public async Task<List<CourseUnitProgressReadDTO>> GetUserCourseProgressInReadDTOs(int courseId, int userId)
    {
        List<int> courseUnitsIds = await GetAllCourseUnitsIds(courseId);

        List<CourseUnitProgressReadDTO> userCourseUnitsProgressReadDTOs = await _context.UserCourseUnits
            .Where(ucu => ucu.UserId == userId
                          && courseUnitsIds.Contains(ucu.CourseUnitId))
            .Select(ucu => new CourseUnitProgressReadDTO(ucu))
            .ToListAsync();

        return userCourseUnitsProgressReadDTOs;
    }

    public async Task UpdateCourseUnitUserProgress(CourseUnitProgressUpdateDTO progressUpdateDTO)
    {
        int courseUnitId = progressUpdateDTO.CourseUnitId;
        int userId = progressUpdateDTO.UserId;

        UserCourseUnit? courseUnit = await _context.UserCourseUnits
            .FirstOrDefaultAsync(ucu => ucu.CourseUnitId == courseUnitId
                                        && ucu.UserId == userId);

        if (courseUnit is null)
        {
            await CreateCourseUnitUserProgress(progressUpdateDTO);
            return;
        }

        courseUnit.Degree = progressUpdateDTO.Degree;
        await _context.SaveChangesAsync();
    }

    private async Task CreateCourseUnitUserProgress(CourseUnitProgressUpdateDTO progressUpdateDTO)
    {
        var newUserCourseUnit = _context.CreateProxy<Models.UserCourseUnit>();

        newUserCourseUnit.CourseUnitId = progressUpdateDTO.CourseUnitId;
        newUserCourseUnit.UserId = progressUpdateDTO.UserId;
        newUserCourseUnit.Degree = progressUpdateDTO.Degree;

        await _context.UserCourseUnits.AddAsync(newUserCourseUnit);
        await _context.SaveChangesAsync();
    }

    private async Task<List<int>> GetAllCourseUnitsIds(int courseId)
    {
        return await _context.CourseUnits
            .Where(cu => cu.CourseId == courseId)
            .Select(cu => cu.Id)
            .ToListAsync();
    }
}
