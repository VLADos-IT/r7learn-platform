using Microsoft.AspNetCore.Authorization;
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


    [Authorize]
    [HttpGet("{courseId:int}")]
    public async Task<ActionResult<List<CourseUnitProgressReadDTO>>> GetUserCourseProgress(int courseId)
    {
        var userIdStr = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var userCourseProgress = await _service.GetUserCourseProgressInReadDTOs(courseId, userId);
        return Ok(userCourseProgress);
    }

    [Authorize]
    [HttpPut("Update")]
    public async Task<ActionResult> UpdateCourseUnitUserProgress(
        [FromBody] CourseUnitProgressUpdateDTO progressUpdateDTO)
    {
        var userIdStr = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            return Unauthorized();

        progressUpdateDTO.UserId = userId;

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
