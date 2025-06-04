using Microsoft.AspNetCore.Mvc;
using R7L.DTO.CourseProgress;
using R7L.Services.CourseProgress;

namespace R7L.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CourseProgressController : Controller
{
    private readonly ICourseProgressService _service;


    public CourseProgressController(ICourseProgressService courseProgressService)
    {
        _service = courseProgressService;
    }


    [HttpGet("{courseId:int}/{userId:int}")]
    public async Task<ActionResult<List<CourseUnitProgressReadDTO>>> GetUserCourseProgress(
        int courseId, int userId)
    {
        List<CourseUnitProgressReadDTO> userCourseProgress = await _service
            .GetUserCourseProgressInReadDTOs(courseId, userId);

        return Ok(userCourseProgress);
    }

    [HttpPut("Update")]
    public async Task<ActionResult> UpdateCourseUnitUserProgress(
        [FromBody] CourseUnitProgressUpdateDTO progressUpdateDTO)
    {
        try
        {
            await _service.UpdateCourseUnitUserProgress(progressUpdateDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }
}
