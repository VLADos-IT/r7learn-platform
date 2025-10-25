using Microsoft.EntityFrameworkCore;
using R7L.DTO.Course;

namespace R7L.Services.Course;

public class CourseService : ICourseService
{
    private readonly AppDbContext _context;


    public CourseService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<List<Models.Course>> GetAllCourses()
    {
        List<Models.Course> allCourses = await _context.Courses.ToListAsync();
        return allCourses;
    }

    public async Task<List<CourseReadDTO>> GetAllCoursesInReadDTOs()
    {
        List<CourseReadDTO> allCoursesInReadDTOs = await _context.Courses
            .Select(c => new CourseReadDTO(c))
            .ToListAsync();

        return allCoursesInReadDTOs;
    }

    public async Task<List<Models.CourseUnit>> GetOrderedCourseUnits(int courseId)
    {
        Models.Course? course = await _context.Courses
            .Include(c => c.CourseUnits)
            .FirstOrDefaultAsync(c => c.Id == courseId);

        if (course is null)
            throw Errors.Errors.KeyNotFound("course", "id", courseId);

        List<Models.CourseUnit> courseUnits = course.CourseUnits
            .Where(cu => !cu.IsDeleted)
            .OrderBy(unit => unit.OrderInCourse)
            .ToList();

        return courseUnits;
    }

    public async Task<Models.Course> CreateCourse(CourseCreateDTO createDTO)
    {
        var newCourse = _context.CreateProxy<Models.Course>();

        newCourse.Name = createDTO.Name;
        newCourse.SystemName = createDTO.SystemName;
        newCourse.Description = createDTO.Description;

        await _context.Courses.AddAsync(newCourse);
        await _context.SaveChangesAsync();

        return newCourse;
    }
}
