using R7L.DTO.Comment;
using R7L.Models;

namespace R7L.Services.Comment;

public interface ICommentService
{
    Task<UserCourseUnitComment> CreateComment(CommentCreateDTO createDTO);

    Task<List<CommentReadDTO>> GetAllRepliesToComment(int commentId, int since, int count);

    Task<List<CommentReadDTO>> GetAllCommentsToCourseUnit(int courseUnitId, int since, int count);

    Task DeleteComment(int commentId);
}
