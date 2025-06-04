using Microsoft.EntityFrameworkCore;
using R7L.DTO.CourseUnit;
using R7L.Models;
using R7L.Erorrs;
using System.Collections;

namespace R7L.Services.CourseUnit;

public class CourseUnitService : ICourseUnitService
{
    private readonly int _defaultOrderInCourse = int.MaxValue;
    private readonly AppDbContext _context;

    public CourseUnitService(AppDbContext context)
    {
        _context = context;
    }


    public async Task<Models.CourseUnit> GetCourseUnitById(int id)
    {
        Models.CourseUnit? courseUnit = await _context.CourseUnits
            .FirstOrDefaultAsync(cu => cu.Id == id);

        if (courseUnit is null)
            throw Errors.KeyNotFound("course unit", "id", id);

        return courseUnit;
    }

    public async Task<Models.CourseUnit> CreateCourseUnit(CourseUnitCreateDTO createDTO)
    {
        string typeName = createDTO.CourseUnitTypeName;
        CourseUnitType? type = await _context.CourseUnitTypes
            .FirstOrDefaultAsync(type => type.Name == typeName);

        if (type is null)
            throw Errors.KeyNotFound("course unit type", "name", createDTO.CourseUnitTypeName);

        var newCourseUnit = _context.CreateProxy<Models.CourseUnit>();

        newCourseUnit.CourseId = createDTO.CourseId;
        newCourseUnit.OrderInCourse = _defaultOrderInCourse;
        newCourseUnit.CourseUnitTypeId = type.Id;
        newCourseUnit.Name = createDTO.Name;
        newCourseUnit.MaxDegree = createDTO.MaxDegree;

        await _context.CourseUnits.AddAsync(newCourseUnit);
        await _context.SaveChangesAsync();

        await ChangeCourseUnitOrderInCourse(newCourseUnit.Id, createDTO.OrderInCourse);

        return newCourseUnit;
    }

    public async Task UpdateCourseUnit(CourseUnitUpdateDTO updateDTO)
    {
        Models.CourseUnit courseUnit = await GetCourseUnitById(updateDTO.Id);

        courseUnit.Name = updateDTO.Name;
        courseUnit.MaxDegree = updateDTO.MaxDegree;

        await _context.SaveChangesAsync();
    }

    public async Task ChangeCourseUnitOrderInCourse(int courseUnitId, int newOrderInCourse)
    {
        Models.CourseUnit courseUnit = await GetCourseUnitById(courseUnitId);
        Models.Course course = courseUnit.Course;
        
        int oldOrderInCourse = courseUnit.OrderInCourse;
        int min = Math.Min(oldOrderInCourse, newOrderInCourse);
        int max = Math.Max(oldOrderInCourse, newOrderInCourse);

        if (min == max)
            return;

        List<Models.CourseUnit> courseUnitsToChange = await _context.CourseUnits
            .Where(cu =>   cu.CourseId == course.Id
                        && cu.OrderInCourse >= min
                        && cu.OrderInCourse <= max)
            .ToListAsync();

        foreach (Models.CourseUnit currentCourseUnit in courseUnitsToChange)
            currentCourseUnit.OrderInCourse += (oldOrderInCourse > newOrderInCourse) ? 1 : -1;
        courseUnit.OrderInCourse = newOrderInCourse;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteCourseUnit(int courseUnitId)
    {
        Models.CourseUnit courseUnit = await GetCourseUnitById(courseUnitId);

        courseUnit.IsDeleted = new BitArray([true]);

        await _context.SaveChangesAsync();
    }
}
