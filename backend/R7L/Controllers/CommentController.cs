using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using R7L.DTO.Comment;
using R7L.Services.Comment;

namespace R7L.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommentController : ControllerBase
{
    private readonly ICommentService _service;

    public CommentController(ICommentService commentService)
    {
        _service = commentService;
    }



    [HttpGet("{courseUnitId:int}/{sortAscending:bool}/{since:int}/{count:int}")]
    public async Task<ActionResult<List<CommentReadDTO>>> GetAllCommentsToCourseUnit(int courseUnitId,
         bool sortAscending, int since, int count)
    {
        List<CommentReadDTO> allCommentsToCourseUnit =
            await _service.GetComments(courseUnitId, null, sortAscending, since, count);

        return Ok(allCommentsToCourseUnit);
    }

    [HttpGet("{courseUnitId:int}/RepliesTo/{commentId:int}/{sortAscending:bool}/{since:int}/{count:int}")]
    public async Task<ActionResult<List<CommentReadDTO>>> GetAllRepliesToComment(int courseUnitId,
        int commentId, bool sortAscending, int since, int count)
    {
        List<CommentReadDTO> allRepliesToComment =
            await _service.GetComments(courseUnitId, commentId, sortAscending, since, count);

        return Ok(allRepliesToComment);
    }

    [HttpPost("Create")]
    public async Task<ActionResult<CommentReadDTO>> CreateComment([FromBody] CommentCreateDTO createDTO)
    {
        Models.UserCourseUnitComment newComment = await _service.CreateComment(createDTO);

        return Ok(new CommentReadDTO(newComment));
    }

    [HttpDelete("{commentId:int}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> DeleteComment(int commentId)
    {
        await _service.DeleteComment(commentId);
        return NoContent();
    }
}
