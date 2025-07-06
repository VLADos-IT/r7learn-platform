using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using R7L.Services.Course;
using R7L.Models;
using R7L.DTO.CourseUnit;
using R7L.DTO.Course;

namespace R7L.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseController : ControllerBase
{
    private readonly ICourseService _service;

    public CourseController(ICourseService courseUnitService)
    {
        _service = courseUnitService;
    }

    [HttpGet("GetAllCourses")]
    public async Task<ActionResult<List<CourseReadDTO>>> GetAllCourses()
    {
        List<CourseReadDTO> allCourses = await _service.GetAllCoursesInReadDTOs();
        return Ok(allCourses);
    }

    [HttpGet("{courseId}/Units")]
    public async Task<ActionResult<List<CourseUnitReadDTO>>> GetUnits(int courseId)
    {
        List<CourseUnit> courseUnits;

        try
        {
            courseUnits = await _service.GetOrderedCourseUnits(courseId);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        List<CourseUnitReadDTO> courseUnitsReadDTOs = courseUnits
            .Select(unit => new CourseUnitReadDTO(unit))
            .ToList();

        return Ok(courseUnitsReadDTOs);
    }

    [HttpPost("Create")]
    public async Task<ActionResult<CourseReadDTO>> CreateCourse([FromBody] CourseCreateDTO createDTO)
    {
        Course createdCourse = await _service.CreateCourse(createDTO);
        var createdCourseReadDTO = new CourseReadDTO(createdCourse);

        return Ok(createdCourseReadDTO);
    }
}
