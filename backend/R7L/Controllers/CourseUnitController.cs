using Microsoft.AspNetCore.Mvc;
using R7L.DTO.CourseUnit;
using R7L.Services.CourseUnit;
using R7L.Models;
using Microsoft.AspNetCore.Authorization;

namespace R7L.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourseUnitController : Controller
{
    private readonly ICourseUnitService _service;

    public CourseUnitController(ICourseUnitService courseUnitService)
    {
        _service = courseUnitService;
    }

    [HttpPost("Create")]
    public async Task<ActionResult<CourseUnitReadDTO>> CreateCourseUnit(
        [FromBody] CourseUnitCreateDTO createDTO)
    {
        CourseUnit createdCourseUnit = await _service.CreateCourseUnit(createDTO);
        var createdCourseUnitReadDTO = new CourseUnitReadDTO(createdCourseUnit);

        return Ok(createdCourseUnitReadDTO);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateCourseUnit([FromBody] CourseUnitUpdateDTO updateDTO)
    {
        try
        {
            await _service.UpdateCourseUnit(updateDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }

    [HttpPatch("{courseUnitId:int}/{newOrderInCourse:int}")]
    public async Task<ActionResult> ChangeCourseUnitOrderInCourse(int courseUnitId,
        int newOrderInCourse)
    {
        await _service.ChangeCourseUnitOrderInCourse(courseUnitId, newOrderInCourse);
        return NoContent();
    }

    [HttpDelete("{courseUnitId:int}")]
    public async Task<ActionResult> DeleteCourseUnit(int courseUnitId)
    {
        await _service.DeleteCourseUnit(courseUnitId);
        return NoContent();
    }
}
