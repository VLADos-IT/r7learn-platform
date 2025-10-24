using Microsoft.AspNetCore.Mvc;
using R7L.DTO.Comment;
using R7L.Services.Comment;

namespace R7L.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly ICommentService _service;

    public CommentController(ICommentService commentService)
    {
        _service = commentService;
    }

    [HttpGet("{courseUnitId:int}/{since:int}/{count:int}")]
    public async Task<ActionResult<List<CommentReadDTO>>> GetAllCommentsToCourseUnit(int courseUnitId,
        int since, int count)
    {
        List<CommentReadDTO> allCommentsToCourseUnit =
            await _service.GetAllCommentsToCourseUnit(courseUnitId, since, count);

        return Ok(allCommentsToCourseUnit);
    }

    [HttpGet("/RepliesTo/{commentId:int}/{since:int}/{count:int}")]
    public async Task<ActionResult<List<CommentReadDTO>>> GetAllRepliesToComment(int commentId,
        int since, int count)
    {
        List<CommentReadDTO> allRepliesToComment =
            await _service.GetAllRepliesToComment(commentId, since, count);

        return Ok(allRepliesToComment);
    }

    [HttpPost("Create")]
    public async Task<ActionResult<CommentReadDTO>> CreateComment([FromBody] CommentCreateDTO createDTO)
    {
        Models.UserCourseUnitComment newComment = await _service.CreateComment(createDTO);

        return Ok(new CommentReadDTO(newComment));
    }

    [HttpDelete("{commentId:int}")]
    public async Task<ActionResult> DeleteComment(int commentId)
    {
        await _service.DeleteComment(commentId);
        return NoContent();
    }
}
