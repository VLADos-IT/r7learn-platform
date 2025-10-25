using R7L.DTO.Comment;
using R7L.Models;

namespace R7L.Services.Comment;

public interface ICommentService
{
    Task<UserCourseUnitComment> CreateComment(CommentCreateDTO createDTO);

    Task<List<CommentReadDTO>> GetComments(int courseUnitId, int? replyTo,bool sortAscending, int since, int count);

    Task DeleteComment(int commentId);
}
